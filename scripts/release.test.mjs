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
  parseReleaseDate,
  parseReleaseThrough,
  parseReleaseVersion,
  validateRebaseCandidate,
  validateReleaseCommit,
  validateTagTarget,
} from "./release.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const releaseDate = "2026-08-21";
const recoveredRelease = Object.freeze({
  changedFiles: ["CHANGELOG.md", "package-lock.json", "package.json"],
  mode: "full-compatibility",
  parentSha: "4d32df1f40344e90882af64bb4db3b5810259b99",
  releaseCommitSha: "e1a7583eb414fbd68e4d5ba40d6b1046a256d03a",
  releaseDate: "2026-08-24",
  releaseThroughSha: "3b153db24be67c033b8a865ffc9578f859c1b358",
  treeSha: "7254f3df63a2f5c5dd77af6f8503184d7813830c",
  version: "5.4.2",
});

function releaseMetadata(releaseThroughSha) {
  return `Release-Through: ${releaseThroughSha}\n\nRelease-Date: ${releaseDate}`;
}

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

function withRepositoryClone(run) {
  const repo = mkdtempSync(join(tmpdir(), "jz-release-clone-test-"));
  try {
    rmSync(repo, { force: true, recursive: true });
    execFileSync("git", ["clone", "--no-local", projectRoot, repo], {
      stdio: "ignore",
    });
    git(repo, "config", "user.name", "Release Test");
    git(repo, "config", "user.email", "release-test@example.invalid");
    git(repo, "config", "commit.gpgsign", "false");
    git(repo, "config", "tag.gpgsign", "false");
    return run({ repo });
  } finally {
    rmSync(repo, { force: true, recursive: true });
  }
}

function commitEmpty(repo, subject) {
  git(repo, "commit", "--allow-empty", "-m", subject);
  return git(repo, "rev-parse", "HEAD");
}

function generateChangelog(repo, { from, to, date = releaseDate } = {}) {
  const env = {
    ...process.env,
    ...(date === undefined ? {} : { CHANGELOG_DATE: date }),
    ...(from === undefined ? {} : { CHANGELOG_FROM: from }),
    ...(to === undefined ? {} : { CHANGELOG_TO: to }),
  };

  return execFileSync(
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
      env,
    },
  );
}

function countChangelogHeadings(changelog, version) {
  return [...changelog.matchAll(new RegExp(`^## \\[` + version + "\\]", "gm"))]
    .length;
}

function changelogSectionContaining(changelog, text) {
  const matchIndex = changelog.indexOf(text);
  assert.notEqual(matchIndex, -1, `Expected changelog to contain ${text}`);
  const headingBeforeMatch = [
    ...changelog.slice(0, matchIndex).matchAll(/^## \[/gm),
  ].at(-1);
  assert.ok(headingBeforeMatch, `Expected a release heading before ${text}`);
  const headingIndex = headingBeforeMatch.index;
  const nextHeadingIndex = changelog.indexOf("\n## [", matchIndex);
  return changelog.slice(
    headingIndex,
    nextHeadingIndex === -1 ? undefined : nextHeadingIndex,
  );
}

function changelogSubsectionContaining(changelog, text) {
  const releaseSection = changelogSectionContaining(changelog, text);
  const matchIndex = releaseSection.indexOf(text);
  const headingBeforeMatch = [
    ...releaseSection.slice(0, matchIndex).matchAll(/^### .+$/gm),
  ].at(-1);
  assert.ok(headingBeforeMatch, `Expected a subsection heading before ${text}`);
  const headingIndex = headingBeforeMatch.index;
  const nextHeadingIndex = releaseSection.indexOf("\n### ", matchIndex);
  return releaseSection.slice(
    headingIndex,
    nextHeadingIndex === -1 ? undefined : nextHeadingIndex,
  );
}

function createTaggedRelease(repo, version = "1.0.1") {
  writeFileSync(join(repo, "app.txt"), "released source\n");
  const releaseThroughSha = commitAll(repo, "fix: release source");
  writeReleaseFiles(repo, version, `# ${version}\n`);
  const releaseCommitSha = commitAll(
    repo,
    `chore(release): ${version}`,
    releaseMetadata(releaseThroughSha),
  );
  git(repo, "tag", `v${version}`, releaseCommitSha);
  return { releaseCommitSha, releaseThroughSha };
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
  assert.equal(
    parseReleaseDate(`body\n\nRelease-Date: ${releaseDate}`),
    releaseDate,
  );
  assert.equal(parseReleaseDate("Release-Date: 2026-02-30"), undefined);
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

test("recovers the exact 5.4.2 metadata before its tag exists and requires a lightweight tag for coverage", () =>
  withRepositoryClone(({ repo }) => {
    const {
      parentSha,
      releaseCommitSha,
      releaseDate: expectedReleaseDate,
      releaseThroughSha,
      version,
    } = recoveredRelease;
    try {
      git(repo, "tag", "-d", `v${version}`);
    } catch {
      // Keep the pre-tag case deterministic after the recovered tag exists upstream.
    }

    assert.deepEqual(inspectReleaseCommit(repo, releaseCommitSha), {
      parentSha,
      releaseDate: expectedReleaseDate,
      releaseThroughSha,
      version,
    });
    assert.throws(
      () => findReleaseCoverage(repo, releaseCommitSha, version),
      /not finalized|tag/i,
    );

    git(repo, "tag", `v${version}`, parentSha);
    assert.throws(
      () => findReleaseCoverage(repo, releaseCommitSha, version),
      /not finalized|points to/i,
    );

    git(repo, "tag", "-d", `v${version}`);
    git(repo, "tag", "-a", `v${version}`, releaseCommitSha, "-m", "annotated");
    assert.throws(
      () => findReleaseCoverage(repo, releaseCommitSha, version),
      /lightweight|annotated/i,
    );

    git(repo, "tag", "-d", `v${version}`);
    git(repo, "tag", `v${version}`, releaseCommitSha);
    assert.deepEqual(findReleaseCoverage(repo, releaseCommitSha, version), {
      releaseCommitSha,
      releaseThroughSha,
    });
  }));

test("accepts only an exact full-compatibility known-release record", () =>
  withRepository(({ repo }) => {
    writeFileSync(join(repo, "app.txt"), "release source\n");
    const releaseThroughSha = commitAll(repo, "fix: release source");
    writeReleaseFiles(repo, "1.0.1", "# 1.0.1\n");
    const releaseCommitSha = commitAll(
      repo,
      "chore(release): 1.0.1",
      `Release-Through: ${releaseThroughSha}`,
    );
    const fullRecord = {
      changedFiles: ["CHANGELOG.md", "package-lock.json", "package.json"],
      mode: "full-compatibility",
      parentSha: releaseThroughSha,
      releaseCommitSha,
      releaseDate,
      releaseThroughSha,
      treeSha: git(repo, "rev-parse", `${releaseCommitSha}^{tree}`),
      version: "1.0.1",
    };

    assert.deepEqual(
      inspectReleaseCommit(repo, releaseCommitSha, [fullRecord]),
      {
        parentSha: releaseThroughSha,
        releaseDate,
        releaseThroughSha,
        version: "1.0.1",
      },
    );
    assert.doesNotThrow(() =>
      validateReleaseCommit(repo, {
        baseSha: releaseCommitSha,
        commitSha: releaseCommitSha,
        expectedTreeSha: fullRecord.treeSha,
        knownReleases: [fullRecord],
        releaseDate,
        releaseThroughSha,
        version: "1.0.1",
      }),
    );
    assert.throws(() =>
      validateReleaseCommit(repo, {
        baseSha: releaseCommitSha,
        commitSha: releaseCommitSha,
        expectedTreeSha: fullRecord.treeSha,
        knownReleases: [fullRecord],
        releaseDate: "2026-08-22",
        releaseThroughSha,
        version: "1.0.1",
      }),
    );
    git(repo, "tag", "v1.0.1", releaseCommitSha);
    assert.equal(
      createReleasePlan(repo, {
        baseSha: releaseCommitSha,
        knownReleases: [fullRecord],
        sourceSha: releaseThroughSha,
      }).mode,
      "skip",
    );

    for (const [name, value] of [
      ["releaseCommitSha", "a".repeat(40)],
      ["parentSha", "b".repeat(40)],
      ["releaseThroughSha", "c".repeat(40)],
      ["treeSha", "d".repeat(40)],
      ["version", "1.0.2"],
      ["changedFiles", ["CHANGELOG.md", "package.json"]],
    ]) {
      const tamperedRecord = { ...fullRecord, [name]: value };
      assert.throws(() =>
        inspectReleaseCommit(repo, releaseCommitSha, [tamperedRecord]),
      );
    }
  }));

test("rejects release metadata without a date unless it is an exact compatibility record", () =>
  withRepository(({ repo }) => {
    writeFileSync(join(repo, "app.txt"), "release source\n");
    const releaseThroughSha = commitAll(repo, "fix: release source");
    writeReleaseFiles(repo, "1.0.1", "# 1.0.1\n");
    const releaseCommitSha = commitAll(
      repo,
      "chore(release): 1.0.1",
      `Release-Through: ${releaseThroughSha}`,
    );

    assert.throws(
      () => inspectReleaseCommit(repo, releaseCommitSha, []),
      /not a generated release commit|release date/i,
    );
    assert.throws(
      () => findReleaseCoverage(repo, releaseCommitSha, "1.0.1", []),
      /no release date metadata/i,
    );
  }));

test("preserves the built-in 5.4.1 coverage-only tag bypass", () =>
  withRepositoryClone(({ repo }) => {
    const legacyReleaseCommitSha = "b91685a0429a1efaf92d052b1af0ec7a12fb1127";
    const legacyReleaseThroughSha = "e7e490af0e18152f2ffa7c2de16b5cb3d1817601";
    try {
      git(repo, "tag", "-d", "v5.4.1");
    } catch {
      // The test must cover the no-tag compatibility path whether or not a clone has the tag.
    }

    assert.deepEqual(
      findReleaseCoverage(repo, legacyReleaseCommitSha, "5.4.1"),
      {
        releaseCommitSha: legacyReleaseCommitSha,
        releaseThroughSha: legacyReleaseThroughSha,
      },
    );
  }));

test("rejects all first-parent merge commits with the offending SHA and squash-only history guidance", () =>
  withRepository(({ repo }) => {
    const { releaseCommitSha } = createTaggedRelease(repo);
    git(repo, "switch", "-c", "feature", releaseCommitSha);
    writeFileSync(join(repo, "feature.txt"), "feature\n");
    commitAll(repo, "feat: merged feature");
    git(repo, "switch", "development");
    writeFileSync(join(repo, "app.txt"), "development\n");
    commitAll(repo, "fix: development change");
    git(repo, "merge", "--no-ff", "feature", "-m", "Merge feature branch");
    const mergeSha = git(repo, "rev-parse", "HEAD");

    assert.throws(
      () => createReleasePlan(repo, { baseSha: mergeSha, sourceSha: mergeSha }),
      (error) =>
        error instanceof Error &&
        error.message.includes(mergeSha) &&
        /squash-only history/i.test(error.message),
    );
  }));

test("rejects nonconventional first-parent subjects with their SHA and squash-only history guidance", () =>
  withRepository(({ repo }) => {
    const { releaseCommitSha } = createTaggedRelease(repo);
    writeFileSync(join(repo, "app.txt"), "unconventional\n");
    const invalidSha = commitAll(repo, "Update release workflow");

    assert.throws(
      () =>
        createReleasePlan(repo, { baseSha: invalidSha, sourceSha: invalidSha }),
      (error) =>
        error instanceof Error &&
        error.message.includes(invalidSha) &&
        /squash-only history/i.test(error.message),
    );
    assert.equal(releaseCommitSha.length, 40);
  }));

test("skips only one-parent generated release commits and retains conventional bump precedence", () =>
  withRepository(({ repo }) => {
    const { releaseCommitSha } = createTaggedRelease(repo);
    writeFileSync(join(repo, "app.txt"), "patch\n");
    commitAll(repo, "fix: patch");
    writeFileSync(join(repo, "app.txt"), "minor\n");
    commitAll(repo, "feat: minor");
    writeFileSync(join(repo, "app.txt"), "major\n");
    const baseSha = commitAll(repo, "refactor!: major");

    const plan = createReleasePlan(repo, { baseSha, sourceSha: baseSha });
    assert.equal(plan.bumpType, "major");
    assert.equal(plan.nextVersion, "2.0.0");
    assert.equal(plan.releaseCommitSha, releaseCommitSha);
  }));

test("rejects release-looking commits that are not the validated coverage release", () =>
  withRepository(({ repo }) => {
    createTaggedRelease(repo);
    const invalidSha = commitEmpty(repo, "chore(release): 1.0.2");

    assert.throws(
      () =>
        createReleasePlan(repo, { baseSha: invalidSha, sourceSha: invalidSha }),
      (error) =>
        error instanceof Error &&
        error.message.includes(invalidSha) &&
        /validated release commit/i.test(error.message) &&
        /squash-only history/i.test(error.message),
    );
  }));

test("does not skip a generated release subject until after confirming it has one parent", () =>
  withRepository(({ repo }) => {
    const { releaseCommitSha } = createTaggedRelease(repo);
    git(repo, "switch", "-c", "generated-release", releaseCommitSha);
    commitEmpty(repo, "chore(release): 1.0.2");
    git(repo, "switch", "development");
    git(
      repo,
      "merge",
      "--no-ff",
      "generated-release",
      "-m",
      "chore(release): 1.0.2",
    );
    const mergeSha = git(repo, "rev-parse", "HEAD");

    assert.throws(
      () => createReleasePlan(repo, { baseSha: mergeSha, sourceSha: mergeSha }),
      (error) =>
        error instanceof Error &&
        error.message.includes(mergeSha) &&
        /squash-only history/i.test(error.message),
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
      releaseMetadata(throughSha),
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
      releaseMetadata(throughSha),
    );
    const expectedTreeSha = git(repo, "rev-parse", `${generatedSha}^{tree}`);
    assert.deepEqual(inspectReleaseCommit(repo, generatedSha), {
      parentSha: throughSha,
      releaseDate,
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
      releaseMetadata(throughSha),
    );

    assert.doesNotThrow(() =>
      validateReleaseCommit(repo, {
        baseSha: git(repo, "rev-parse", `${rebasedSha}^`),
        commitSha: rebasedSha,
        expectedTreeSha,
        releaseDate,
        releaseThroughSha: throughSha,
        version: "1.0.1",
      }),
    );
    assert.throws(
      () =>
        validateReleaseCommit(repo, {
          baseSha: git(repo, "rev-parse", `${rebasedSha}^`),
          commitSha: rebasedSha,
          expectedTreeSha,
          releaseDate: "2026-08-22",
          releaseThroughSha: throughSha,
          version: "1.0.1",
        }),
      /invalid date metadata/,
    );

    git(repo, "switch", "-c", "untrusted-parent", throughSha);
    writeFileSync(join(repo, "app.txt"), "off-development change\n");
    commitAll(repo, "fix: off-development parent");
    writeReleaseFiles(repo, "1.0.1", "# 1.0.1\n");
    const untrustedSha = commitAll(
      repo,
      "chore(release): 1.0.1",
      releaseMetadata(throughSha),
    );
    assert.throws(
      () =>
        validateReleaseCommit(repo, {
          baseSha: rebasedSha,
          commitSha: untrustedSha,
          expectedTreeSha,
          releaseDate,
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
      releaseMetadata(rebasedSha),
    );
    assert.throws(
      () =>
        validateReleaseCommit(repo, {
          baseSha: git(repo, "rev-parse", `${tamperedSha}^`),
          commitSha: tamperedSha,
          expectedTreeSha: git(repo, "rev-parse", `${tamperedSha}^{tree}`),
          releaseDate,
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
      releaseMetadata(throughSha),
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
    const releaseThroughSha = commitAll(repo, "fix: unreleased fix");
    writeReleaseFiles(repo, "1.0.2", "# 1.0.1\n");

    const changelog = generateChangelog(repo, {
      from: releasedSourceSha,
      to: releaseThroughSha,
    });

    assert.match(changelog, /^## \[1\.0\.2\]/m);
    assert.match(changelog, /\(2026-08-21\)/);
    assert.match(
      changelog,
      new RegExp(`/compare/${releasedSourceSha}\\.\\.\\.v1\\.0\\.2`),
    );
    assert.match(changelog, /unreleased fix/);
    assert.doesNotMatch(changelog, /released source/);
    assert.doesNotMatch(changelog, /chore\(release\)/);
  }));

test("renders one controlled range across an intermediate release tag and retains typed sections", () =>
  withRepository(({ repo }) => {
    const releaseFromSha = commitEmpty(repo, "fix: previous release boundary");
    const intermediateReleaseSha = commitEmpty(repo, "chore(release): 1.0.1");
    git(repo, "tag", "v1.0.1", intermediateReleaseSha);

    commitEmpty(repo, "fix: repair in-range bug (#101)");
    commitEmpty(repo, "feat: add in-range feature (#102)");
    commitEmpty(repo, "feat!: break an in-range API (#103)");
    commitEmpty(repo, "chore: maintain in-range tooling (#104)");
    commitEmpty(repo, "ci: maintain in-range checks (#105)");
    commitEmpty(repo, "revert: restore in-range behavior (#107)");
    const releaseThroughSha = commitEmpty(
      repo,
      "build: maintain in-range build tooling (#106)",
    );
    writeReleaseFiles(repo, "1.0.2", "# 1.0.1\n");

    const changelog = generateChangelog(repo, {
      from: releaseFromSha,
      to: releaseThroughSha,
    });

    assert.equal(countChangelogHeadings(changelog, "1.0.2"), 1);
    assert.equal(countChangelogHeadings(changelog, "1.0.1"), 0);
    assert.match(
      changelogSubsectionContaining(changelog, "repair in-range bug"),
      /^### Bug Fixes/m,
    );
    for (const subject of ["add in-range feature", "break an in-range API"]) {
      assert.match(
        changelogSubsectionContaining(changelog, subject),
        /^### Features/m,
      );
    }
    for (const subject of [
      "maintain in-range tooling",
      "maintain in-range checks",
      "maintain in-range build tooling",
    ]) {
      assert.match(
        changelogSubsectionContaining(changelog, subject),
        /^### Maintenance/m,
      );
    }
    assert.match(
      changelogSubsectionContaining(changelog, "restore in-range behavior"),
      /^### Reverts/m,
    );
    assert.match(changelog, /BREAKING CHANGES/);
    assert.match(changelog, /break an in-range API/);
    assert.doesNotMatch(changelog, /chore\(release\)/);
  }));

test("fails closed when CHANGELOG_TO is not the current HEAD", () =>
  withRepository(({ repo }) => {
    const releaseFromSha = commitEmpty(repo, "fix: coverage lower bound");
    const releaseThroughSha = commitEmpty(repo, "fix: coverage upper bound");
    commitEmpty(repo, "fix: sentinel after controlled range");
    writeReleaseFiles(repo, "1.0.2", "# 1.0.1\n");

    assert.throws(
      () =>
        generateChangelog(repo, {
          from: releaseFromSha,
          to: releaseThroughSha,
        }),
      (error) => {
        assert.match(
          `${error.message}\n${error.stderr ?? ""}`,
          /CHANGELOG_TO.*HEAD|HEAD.*CHANGELOG_TO/,
        );
        return true;
      },
    );
  }));

test("requires CHANGELOG_FROM and CHANGELOG_TO together", () =>
  withRepository(({ repo }) => {
    const releaseFromSha = commitEmpty(repo, "fix: coverage lower bound");
    const releaseThroughSha = commitEmpty(repo, "fix: coverage upper bound");

    for (const inputs of [
      { from: releaseFromSha, to: undefined },
      { from: undefined, to: releaseThroughSha },
    ]) {
      assert.throws(
        () => generateChangelog(repo, inputs),
        (error) => {
          assert.match(
            `${error.message}\n${error.stderr ?? ""}`,
            /CHANGELOG_FROM and CHANGELOG_TO must be set together/,
          );
          return true;
        },
      );
    }
  }));

test("passes identical bounded changelog inputs from release creation and finalization", () => {
  const expectedInvocation = [
    'CHANGELOG_DATE="$RELEASE_DATE"',
    'CHANGELOG_FROM="$RELEASE_FROM_SHA"',
    'CHANGELOG_TO="$RELEASE_THROUGH_SHA"',
    "npm run changelog:update",
  ].join(" \\\n            ");
  const versionWorkflow = readFileSync(
    join(projectRoot, ".github", "workflows", "version.yml"),
    "utf8",
  );
  const finalizationWorkflow = readFileSync(
    join(projectRoot, ".github", "workflows", "finalize-release.yml"),
    "utf8",
  );

  assert.ok(versionWorkflow.includes(expectedInvocation));
  assert.ok(finalizationWorkflow.includes(expectedInvocation));
});

test("keeps one corrected release section per current range without replacing historical releases", () => {
  const changelog = readFileSync(join(projectRoot, "CHANGELOG.md"), "utf8");

  assert.equal(countChangelogHeadings(changelog, "5.4.4"), 1);
  assert.equal(countChangelogHeadings(changelog, "5.4.3"), 1);
  assert.equal(countChangelogHeadings(changelog, "5.4.2"), 1);
  assert.match(
    changelog,
    /^## \[5\.4\.4\]\(https:\/\/github\.com\/Zwiqler94\/jz-portfolio\/compare\/dcadea51e11c9f5ead548d6fef20734e2a1ecf7a\.\.\.v5\.4\.4\)/m,
  );
  assert.match(
    changelog,
    /^## \[5\.4\.3\]\(https:\/\/github\.com\/Zwiqler94\/jz-portfolio\/compare\/3b153db24be67c033b8a865ffc9578f859c1b358\.\.\.v5\.4\.3\)/m,
  );
  assert.match(
    changelog,
    /^## \[5\.4\.2\]\(https:\/\/github\.com\/Zwiqler94\/jz-portfolio\/compare\/e7e490af0e18152f2ffa7c2de16b5cb3d1817601\.\.\.v5\.4\.2\)/m,
  );

  for (const issue of ["#892", "#893"]) {
    const section = changelogSectionContaining(changelog, issue);
    assert.match(section, /^## \[5\.4\.3\]/);
    assert.match(
      changelogSubsectionContaining(changelog, issue),
      /^### Bug Fixes/m,
    );
  }
  for (const issue of ["#896"]) {
    const section = changelogSectionContaining(changelog, issue);
    assert.match(section, /^## \[5\.4\.3\]/);
    assert.match(
      changelogSubsectionContaining(changelog, issue),
      /^### Maintenance/m,
    );
  }
  const pinnedActionsSection = changelogSectionContaining(changelog, "#903");
  assert.match(pinnedActionsSection, /^## \[5\.4\.4\]/);
  assert.match(
    changelogSubsectionContaining(changelog, "#903"),
    /^### Maintenance/m,
  );

  assert.doesNotMatch(
    changelog,
    /3b153db24be67c033b8a865ffc9578f859c1b358\.\.\.v5\.4\.2/,
  );
  assert.match(changelog, /^## \[5\.4\.1\]/m);
  assert.match(changelog, /action version/);
});

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
  assert.match(versionWorkflow, /Release-Date:/);
  assert.match(versionWorkflow, /CHANGELOG_DATE=/);
  assert.match(finalizationWorkflow, /CHANGELOG_DATE=/);

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
  const tagIndex = finalizationWorkflow.indexOf(
    "Create or resume the post-merge tag",
  );
  const deleteBranchIndex = finalizationWorkflow.indexOf(
    "Delete the merged release branch",
  );
  assert.ok(metadataIndex >= 0);
  assert.ok(authenticationIndex > metadataIndex);
  assert.ok(validationIndex > authenticationIndex);
  assert.ok(writeTokenIndex > validationIndex);
  assert.ok(deleteBranchIndex > writeTokenIndex);
  assert.ok(tagIndex > deleteBranchIndex);
  assert.match(
    finalizationWorkflow.slice(deleteBranchIndex),
    /validate-commit[\s\S]+gh api --method DELETE/,
  );
});

test("fixture package files remain valid JSON", () =>
  withRepository(({ repo }) => {
    assert.equal(
      JSON.parse(readFileSync(join(repo, "package.json"))).version,
      "1.0.0",
    );
  }));
