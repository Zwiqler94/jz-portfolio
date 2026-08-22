import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  classifyCommitSubject,
  classifyPullRequestTitle,
  createReleasePlan,
  evaluateVersionStatus,
  findReleaseCoverage,
  highestVersionBump,
  incrementVersion,
  inspectReleaseCommit,
  parseReleaseThrough,
  parseReleaseVersion,
  validateRebaseCandidate,
  validateReleaseCommit,
  validateTagTarget,
} from "./release.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function git(repo, ...args) {
  return execFileSync("git", ["-C", repo, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function writeReleaseFiles(repo, version, changelog = `# ${version}\n`) {
  writeFileSync(join(repo, "CHANGELOG.md"), changelog);
  writeFileSync(
    join(repo, "package-lock.json"),
    `${JSON.stringify({ name: "fixture", version }, undefined, 2)}\n`,
  );
  writeFileSync(
    join(repo, "package.json"),
    `${JSON.stringify({ name: "fixture", version }, undefined, 2)}\n`,
  );
}

function commitAll(repo, subject, body) {
  git(repo, "add", ".");
  const args = ["commit", "-m", subject];
  if (body) {
    args.push("-m", body);
  }
  git(repo, ...args);
  return git(repo, "rev-parse", "HEAD");
}

function createRepository() {
  const repo = mkdtempSync(join(tmpdir(), "jz-release-test-"));
  git(repo, "init", "--initial-branch=development");
  git(repo, "config", "user.name", "Release Test");
  git(repo, "config", "user.email", "release-test@example.invalid");
  git(repo, "config", "commit.gpgsign", "false");
  git(repo, "config", "tag.gpgsign", "false");
  writeReleaseFiles(repo, "1.0.0");
  writeFileSync(join(repo, "app.txt"), "initial\n");
  const initialSha = commitAll(repo, "feat: initial fixture");
  return { initialSha, repo };
}

function withRepository(run) {
  const fixture = createRepository();
  try {
    return run(fixture);
  } finally {
    rmSync(fixture.repo, { force: true, recursive: true });
  }
}

test("classifies the existing conventional version policy", () => {
  assert.equal(classifyCommitSubject("fix(api): repair"), "patch");
  assert.equal(classifyCommitSubject("docs: explain"), "patch");
  assert.equal(classifyCommitSubject("feat(ui): add"), "minor");
  assert.equal(classifyCommitSubject("feat(api)!: replace"), "major");
  assert.equal(
    classifyCommitSubject("chore(release): 1.2.3 (#123)"),
    undefined,
  );
  assert.equal(classifyPullRequestTitle("chore(release): 1.2.3"), "stop");
  assert.equal(classifyPullRequestTitle("feat(ui): add"), "minor");
  assert.throws(
    () => classifyCommitSubject("Update the workflow"),
    /Cannot determine a version bump/,
  );
});

test("chooses the highest bump and increments stable versions", () => {
  assert.equal(highestVersionBump(["docs: one", "feat: two"]), "minor");
  assert.equal(
    highestVersionBump(["fix: one", "refactor!: two", "feat: three"]),
    "major",
  );
  assert.equal(incrementVersion("1.2.3", "patch"), "1.2.4");
  assert.equal(incrementVersion("1.2.3", "minor"), "1.3.0");
  assert.equal(incrementVersion("1.2.3", "major"), "2.0.0");
});

test("parses release subjects and coverage trailers", () => {
  const sha = "a".repeat(40);
  assert.equal(parseReleaseVersion("chore(release): 5.4.1 (#882)"), "5.4.1");
  assert.equal(parseReleaseThrough(`body\n\nRelease-Through: ${sha}`), sha);
});

test("uses a legacy release parent as the initial coverage point", () =>
  withRepository(({ initialSha, repo }) => {
    writeFileSync(join(repo, "app.txt"), "released source\n");
    const releasedSourceSha = commitAll(repo, "fix: released source");
    writeReleaseFiles(repo, "1.0.1", "# 1.0.1\n");
    const releaseSha = commitAll(repo, "chore(release): 1.0.1 (#1)");
    const legacyRelease = {
      releaseCommitSha: releaseSha,
      releaseThroughSha: releasedSourceSha,
      version: "1.0.1",
    };
    writeFileSync(join(repo, "app.txt"), "docs\n");
    const docsSha = commitAll(repo, "docs: after release");
    writeFileSync(join(repo, "app.txt"), "feature\n");
    const baseSha = commitAll(repo, "feat: after release");

    assert.deepEqual(
      findReleaseCoverage(repo, baseSha, "1.0.1", legacyRelease),
      {
        releaseCommitSha: releaseSha,
        releaseThroughSha: releasedSourceSha,
      },
    );
    assert.equal(
      createReleasePlan(repo, {
        baseSha,
        legacyRelease,
        sourceSha: initialSha,
      }).mode,
      "skip",
    );
    assert.deepEqual(
      createReleasePlan(repo, { baseSha, legacyRelease, sourceSha: docsSha }),
      {
        baseSha,
        bumpType: "minor",
        currentVersion: "1.0.1",
        mode: "release",
        nextVersion: "1.1.0",
        releaseBranch: "release/v1.1.0",
        releaseCommitSha: releaseSha,
        releaseFromSha: releasedSourceSha,
        releaseThroughSha: baseSha,
        sourceSha: docsSha,
      },
    );
  }));

test("does not mark a later merge covered by an earlier release trailer", () =>
  withRepository(({ repo }) => {
    writeFileSync(join(repo, "app.txt"), "through\n");
    const throughSha = commitAll(repo, "fix: covered source");
    writeFileSync(join(repo, "app.txt"), "queued\n");
    const queuedSha = commitAll(repo, "feat: queued source");
    writeReleaseFiles(repo, "1.0.1", "# 1.0.1\n");
    const releaseSha = commitAll(
      repo,
      "chore(release): 1.0.1",
      `Release-Through: ${throughSha}`,
    );
    const baseSha = git(repo, "rev-parse", "HEAD");

    assert.throws(
      () => createReleasePlan(repo, { baseSha, sourceSha: queuedSha }),
      /is not finalized/,
    );
    git(repo, "tag", "v1.0.1", releaseSha);

    const plan = createReleasePlan(repo, { baseSha, sourceSha: queuedSha });
    assert.equal(plan.mode, "release");
    assert.equal(plan.bumpType, "minor");
    assert.equal(plan.releaseThroughSha, baseSha);
  }));

test("validates a rebased release delta and rejects application changes", () =>
  withRepository(({ repo }) => {
    writeFileSync(join(repo, "app.txt"), "through\n");
    const throughSha = commitAll(repo, "fix: release source");

    git(repo, "switch", "-c", "generated", throughSha);
    writeReleaseFiles(repo, "1.0.1", "# 1.0.1\n");
    const generatedSha = commitAll(
      repo,
      "chore(release): 1.0.1",
      `Release-Through: ${throughSha}`,
    );
    const expectedTreeSha = git(repo, "rev-parse", `${generatedSha}^{tree}`);
    assert.deepEqual(inspectReleaseCommit(repo, generatedSha), {
      parentSha: throughSha,
      releaseThroughSha: throughSha,
      version: "1.0.1",
    });

    git(repo, "switch", "development");
    writeFileSync(join(repo, "app.txt"), "advanced base\n");
    commitAll(repo, "docs: advance base");
    writeReleaseFiles(repo, "1.0.1", "# 1.0.1\n");
    const rebasedSha = commitAll(
      repo,
      "chore(release): 1.0.1",
      `Release-Through: ${throughSha}`,
    );

    assert.doesNotThrow(() =>
      validateReleaseCommit(repo, {
        baseSha: git(repo, "rev-parse", `${rebasedSha}^`),
        commitSha: rebasedSha,
        expectedTreeSha,
        releaseThroughSha: throughSha,
        version: "1.0.1",
      }),
    );

    git(repo, "switch", "-c", "untrusted-parent", throughSha);
    writeFileSync(join(repo, "app.txt"), "off-development change\n");
    commitAll(repo, "fix: off-development parent");
    writeReleaseFiles(repo, "1.0.1", "# 1.0.1\n");
    const untrustedSha = commitAll(
      repo,
      "chore(release): 1.0.1",
      `Release-Through: ${throughSha}`,
    );
    assert.throws(
      () =>
        validateReleaseCommit(repo, {
          baseSha: rebasedSha,
          commitSha: untrustedSha,
          expectedTreeSha,
          releaseThroughSha: throughSha,
          version: "1.0.1",
        }),
      /is not contained in development/,
    );

    git(repo, "switch", "development");
    writeReleaseFiles(repo, "1.0.2", "# 1.0.2\n");
    writeFileSync(join(repo, "app.txt"), "tampered\n");
    const tamperedSha = commitAll(
      repo,
      "chore(release): 1.0.2",
      `Release-Through: ${rebasedSha}`,
    );
    assert.throws(
      () =>
        validateReleaseCommit(repo, {
          baseSha: git(repo, "rev-parse", `${tamperedSha}^`),
          commitSha: tamperedSha,
          expectedTreeSha: git(repo, "rev-parse", `${tamperedSha}^{tree}`),
          releaseThroughSha: rebasedSha,
          version: "1.0.2",
        }),
      /changed unexpected files/,
    );
  }));

test("allows rebasing across application commits but not release-file changes", () =>
  withRepository(({ repo }) => {
    writeFileSync(join(repo, "app.txt"), "through\n");
    const throughSha = commitAll(repo, "fix: release source");

    git(repo, "switch", "-c", "generated", throughSha);
    writeReleaseFiles(repo, "1.0.1", "# 1.0.1\n");
    const releaseSha = commitAll(
      repo,
      "chore(release): 1.0.1",
      `Release-Through: ${throughSha}`,
    );

    git(repo, "switch", "development");
    writeFileSync(join(repo, "app.txt"), "safe advance\n");
    const safeBaseSha = commitAll(repo, "docs: advance application");
    assert.doesNotThrow(() =>
      validateRebaseCandidate(repo, {
        baseSha: safeBaseSha,
        commitSha: releaseSha,
      }),
    );

    writeReleaseFiles(repo, "1.0.1", "# modified outside release\n");
    const unsafeBaseSha = commitAll(repo, "fix: modify release files");
    assert.throws(
      () =>
        validateRebaseCandidate(repo, {
          baseSha: unsafeBaseSha,
          commitSha: releaseSha,
        }),
      /Cannot rebase:.*CHANGELOG\.md/,
    );
  }));

test("accepts only an idempotent tag target", () =>
  withRepository(({ initialSha, repo }) => {
    git(repo, "tag", "v1.0.0", initialSha);
    assert.doesNotThrow(() => validateTagTarget(repo, "v1.0.0", initialSha));
    writeFileSync(join(repo, "app.txt"), "later\n");
    const laterSha = commitAll(repo, "fix: later");
    assert.throws(
      () => validateTagTarget(repo, "v1.0.0", laterSha),
      /points to/,
    );
  }));

test("generates a changelog only from the recorded coverage point", () =>
  withRepository(({ repo }) => {
    writeFileSync(join(repo, "app.txt"), "released source\n");
    const releasedSourceSha = commitAll(repo, "fix: released source");
    writeReleaseFiles(repo, "1.0.1", "# 1.0.1\n");
    commitAll(repo, "chore(release): 1.0.1");
    writeFileSync(join(repo, "app.txt"), "unreleased fix\n");
    commitAll(repo, "fix: unreleased fix");
    writeReleaseFiles(repo, "1.0.2", "# 1.0.1\n");

    const changelog = execFileSync(
      join(projectRoot, "node_modules", ".bin", "conventional-changelog"),
      [
        "-p",
        "angular",
        "-r",
        "1",
        "-n",
        join(projectRoot, ".changelog-config.mjs"),
      ],
      {
        cwd: repo,
        encoding: "utf8",
        env: { ...process.env, CHANGELOG_FROM: releasedSourceSha },
      },
    );

    assert.match(changelog, /^## \[1\.0\.2\]/m);
    assert.match(
      changelog,
      new RegExp(`/compare/${releasedSourceSha}\\.\\.\\.v1\\.0\\.2`),
    );
    assert.match(changelog, /unreleased fix/);
    assert.doesNotMatch(changelog, /released source/);
    assert.doesNotMatch(changelog, /chore\(release\)/);
  }));

test("does not allow skipped jobs to mask release failures", () => {
  assert.deepEqual(
    evaluateVersionStatus({
      finalizeResult: "skipped",
      merged: "true",
      releaseResult: "failure",
      verifyResult: "success",
      versionType: "patch",
    }),
    { message: "Version release failure", ok: false },
  );
  assert.equal(
    evaluateVersionStatus({
      finalizeResult: "success",
      merged: "true",
      releaseResult: "skipped",
      verifyResult: "success",
      versionType: "stop",
    }).ok,
    true,
  );
  assert.equal(
    evaluateVersionStatus({
      finalizeResult: "skipped",
      merged: "false",
      releaseResult: "skipped",
      verifyResult: "skipped",
      versionType: "",
    }).ok,
    true,
  );
});

test("keeps privileged release finalization on trusted development pushes", () => {
  const versionWorkflow = readFileSync(
    join(projectRoot, ".github", "workflows", "version.yml"),
    "utf8",
  );
  const finalizationWorkflow = readFileSync(
    join(projectRoot, ".github", "workflows", "finalize-release.yml"),
    "utf8",
  );
  const releaseWaiter = versionWorkflow.slice(
    versionWorkflow.indexOf("  wait-release-finalization:"),
    versionWorkflow.indexOf("  check-version-job:"),
  );

  assert.ok(releaseWaiter.length > 0);
  assert.doesNotMatch(releaseWaiter, /refs\/pull\//);
  assert.doesNotMatch(releaseWaiter, /pull_request\.head\.sha/);
  assert.doesNotMatch(releaseWaiter, /pull_request\.number/);
  assert.match(releaseWaiter, /Wait for trusted push finalization/);
  assert.doesNotMatch(finalizationWorkflow, /pull_request_target/);
  assert.doesNotMatch(finalizationWorkflow, /refs\/pull\//);
  assert.match(finalizationWorkflow, /push:\n\s+branches: \[development\]/);

  const metadataIndex = finalizationWorkflow.indexOf(
    "Validate trusted release metadata",
  );
  const authenticationIndex = finalizationWorkflow.indexOf(
    "Authenticate to Google Cloud",
  );
  const validationIndex = finalizationWorkflow.indexOf(
    "Recompute and validate the merged release",
  );
  const writeTokenIndex = finalizationWorkflow.indexOf("Get release token");
  assert.ok(metadataIndex >= 0);
  assert.ok(authenticationIndex > metadataIndex);
  assert.ok(validationIndex > authenticationIndex);
  assert.ok(writeTokenIndex > validationIndex);
});

test("fixture package files remain valid JSON", () =>
  withRepository(({ repo }) => {
    assert.equal(
      JSON.parse(readFileSync(join(repo, "package.json"))).version,
      "1.0.0",
    );
  }));
