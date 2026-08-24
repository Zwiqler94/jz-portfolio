import { appendFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const RELEASE_FILES = [
  "CHANGELOG.md",
  "package-lock.json",
  "package.json",
];

const RELEASE_SUBJECT_PATTERN = /^chore\(release\):\s+(\d+\.\d+\.\d+)(?:\s|$)/;
const RELEASE_THROUGH_PATTERN = /^Release-Through:\s*([0-9a-f]{40})\s*$/im;
const RELEASE_DATE_PATTERN = /^Release-Date:\s*(\d{4}-\d{2}-\d{2})\s*$/im;
const MAJOR_PATTERN = /^[a-z]+(?:[a-z0-9-]*)?(?:\([^)]+\))?!:/;
const MINOR_PATTERN = /^feat(?:\([^)]+\))?:/;
const PATCH_PATTERN =
  /^(?:fix|perf|revert|docs|style|chore|refactor|test|build|ci)(?:\([^)]+\))?:/;
const BUMP_PRIORITY = new Map([
  ["patch", 1],
  ["minor", 2],
  ["major", 3],
]);
const KNOWN_RELEASES = Object.freeze([
  Object.freeze({
    mode: "coverage-only",
    releaseCommitSha: "b91685a0429a1efaf92d052b1af0ec7a12fb1127",
    releaseThroughSha: "e7e490af0e18152f2ffa7c2de16b5cb3d1817601",
    version: "5.4.1",
  }),
  Object.freeze({
    changedFiles: Object.freeze([...RELEASE_FILES]),
    mode: "full-compatibility",
    parentSha: "4d32df1f40344e90882af64bb4db3b5810259b99",
    releaseCommitSha: "e1a7583eb414fbd68e4d5ba40d6b1046a256d03a",
    releaseDate: "2026-08-24",
    releaseThroughSha: "3b153db24be67c033b8a865ffc9578f859c1b358",
    treeSha: "7254f3df63a2f5c5dd77af6f8503184d7813830c",
    version: "5.4.2",
  }),
]);

function git(repo, args, options = {}) {
  return execFileSync("git", ["-C", repo, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  }).trim();
}

function assertCommitSha(value, name) {
  if (!/^[0-9a-f]{40}$/.test(value)) {
    throw new Error(`${name} must be a full lowercase Git commit SHA`);
  }
}

function assertVersion(value, name = "version") {
  if (!/^\d+\.\d+\.\d+$/.test(value)) {
    throw new Error(`${name} must be a stable semantic version`);
  }
}

function assertReleaseDate(value, name = "releaseDate") {
  if (!isValidReleaseDate(value)) {
    throw new Error(`${name} must be a valid date in YYYY-MM-DD format`);
  }
}

function isValidReleaseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function commitExists(repo, commitSha) {
  try {
    git(repo, ["cat-file", "-e", `${commitSha}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

function isAncestor(repo, ancestorSha, descendantSha) {
  try {
    execFileSync(
      "git",
      ["-C", repo, "merge-base", "--is-ancestor", ancestorSha, descendantSha],
      { stdio: "ignore" },
    );
    return true;
  } catch {
    return false;
  }
}

function getCommit(repo, commitSha) {
  const parents = git(repo, ["show", "-s", "--format=%P", commitSha])
    .split(/\s+/)
    .filter(Boolean);
  return {
    body: git(repo, ["show", "-s", "--format=%B", commitSha]),
    parents,
    subject: git(repo, ["show", "-s", "--format=%s", commitSha]),
  };
}

function getPackageVersion(repo, treeish) {
  const packageJson = git(repo, ["show", `${treeish}:package.json`]);
  return JSON.parse(packageJson).version;
}

function getBlobSha(repo, treeish, file) {
  return git(repo, ["rev-parse", `${treeish}:${file}`]);
}

function getChangedFiles(repo, parentSha, commitSha) {
  const output = git(repo, [
    "diff-tree",
    "--no-commit-id",
    "--name-only",
    "-r",
    parentSha,
    commitSha,
  ]);
  return output ? output.split("\n").sort() : [];
}

function sameFiles(left, right) {
  return (
    left.length === right.length &&
    left.every((file, index) => file === right[index])
  );
}

function normalizeKnownReleases(knownReleases = KNOWN_RELEASES) {
  if (Array.isArray(knownReleases)) {
    return knownReleases;
  }
  if (knownReleases?.releaseCommitSha) {
    return [{ ...knownReleases, mode: "coverage-only" }];
  }
  throw new Error("knownReleases must be an array of known release records");
}

function findKnownRelease(knownReleases, commitSha) {
  return normalizeKnownReleases(knownReleases).find(
    (release) => release.releaseCommitSha === commitSha,
  );
}

function getTreeSha(repo, treeish) {
  return git(repo, ["rev-parse", `${treeish}^{tree}`]);
}

function assertFullCompatibilityRecord(repo, commitSha, commit, release) {
  if (release.mode !== "full-compatibility") {
    throw new Error(`Unknown compatibility mode for release ${commitSha}`);
  }
  assertCommitSha(release.releaseCommitSha, "known release commit");
  assertCommitSha(release.parentSha, "known release parent");
  assertCommitSha(release.releaseThroughSha, "known release coverage");
  assertCommitSha(release.treeSha, "known release tree");
  assertReleaseDate(release.releaseDate, "known release date");
  assertVersion(release.version, "known release version");
  if (!Array.isArray(release.changedFiles)) {
    throw new Error(`Known release ${commitSha} must list its changed files`);
  }
  if (release.releaseCommitSha !== commitSha) {
    throw new Error(`Known release record does not match ${commitSha}`);
  }
  if (commit.parents.length !== 1 || commit.parents[0] !== release.parentSha) {
    throw new Error(`Known release ${commitSha} has an unexpected parent`);
  }
  if (!commitExists(repo, release.releaseThroughSha)) {
    throw new Error(`Known release ${commitSha} has a missing coverage commit`);
  }
  if (!isAncestor(repo, release.releaseThroughSha, release.parentSha)) {
    throw new Error(
      `Known release ${commitSha} has coverage outside its parent history`,
    );
  }
  if (parseReleaseVersion(commit.subject) !== release.version) {
    throw new Error(`Known release ${commitSha} has an unexpected subject`);
  }
  if (getPackageVersion(repo, commitSha) !== release.version) {
    throw new Error(
      `Known release ${commitSha} has an unexpected package version`,
    );
  }
  if (parseReleaseThrough(commit.body) !== release.releaseThroughSha) {
    throw new Error(`Known release ${commitSha} has invalid coverage metadata`);
  }
  if (parseReleaseDate(commit.body)) {
    throw new Error(
      `Known release ${commitSha} must not contain a release date trailer`,
    );
  }
  if (getTreeSha(repo, commitSha) !== release.treeSha) {
    throw new Error(`Known release ${commitSha} has an unexpected tree`);
  }
  if (
    !sameFiles(
      getChangedFiles(repo, release.parentSha, commitSha),
      [...release.changedFiles].sort(),
    ) ||
    !sameFiles([...release.changedFiles].sort(), [...RELEASE_FILES].sort())
  ) {
    throw new Error(`Known release ${commitSha} changed unexpected files`);
  }
}

function resolveReleaseMetadata(
  repo,
  commitSha,
  knownReleases = KNOWN_RELEASES,
) {
  const commit = getCommit(repo, commitSha);
  const version = parseReleaseVersion(commit.subject);
  const knownRelease = findKnownRelease(knownReleases, commitSha);

  if (knownRelease?.mode === "full-compatibility") {
    assertFullCompatibilityRecord(repo, commitSha, commit, knownRelease);
    return {
      kind: "full-compatibility",
      parentSha: knownRelease.parentSha,
      releaseDate: knownRelease.releaseDate,
      releaseThroughSha: knownRelease.releaseThroughSha,
      version: knownRelease.version,
    };
  }

  const releaseThroughSha = parseReleaseThrough(commit.body);
  const releaseDate = parseReleaseDate(commit.body);
  if (
    version &&
    releaseThroughSha &&
    releaseDate &&
    commit.parents.length === 1
  ) {
    return {
      kind: "recorded",
      parentSha: commit.parents[0],
      releaseDate,
      releaseThroughSha,
      version,
    };
  }

  if (
    knownRelease?.mode === "coverage-only" &&
    version === knownRelease.version &&
    commit.parents.length === 1 &&
    commit.parents[0] === knownRelease.releaseThroughSha
  ) {
    return {
      kind: "coverage-only",
      parentSha: commit.parents[0],
      releaseThroughSha: knownRelease.releaseThroughSha,
      version,
    };
  }

  throw new Error(`Commit ${commitSha} is not a generated release commit`);
}

function validateLightweightTagTarget(repo, tag, expectedCommitSha) {
  assertCommitSha(expectedCommitSha, "expectedCommitSha");
  const tagRef = `refs/tags/${tag}`;
  let tagType;
  try {
    tagType = git(repo, ["cat-file", "-t", tagRef]);
  } catch {
    throw new Error(`${tag} does not exist`);
  }
  if (tagType !== "commit") {
    throw new Error(`${tag} must be a lightweight tag, not ${tagType}`);
  }
  const actualCommitSha = git(repo, ["rev-parse", tagRef]);
  if (actualCommitSha !== expectedCommitSha) {
    throw new Error(
      `${tag} points to ${actualCommitSha}, expected ${expectedCommitSha}`,
    );
  }
}

export function parseReleaseVersion(subject) {
  return RELEASE_SUBJECT_PATTERN.exec(subject)?.[1];
}

export function parseReleaseThrough(message) {
  return RELEASE_THROUGH_PATTERN.exec(message)?.[1];
}

export function parseReleaseDate(message) {
  const releaseDate = RELEASE_DATE_PATTERN.exec(message)?.[1];
  return releaseDate && isValidReleaseDate(releaseDate)
    ? releaseDate
    : undefined;
}

export function classifyCommitSubject(subject) {
  const headline = subject.split(/\r?\n/, 1)[0].trim();
  if (parseReleaseVersion(headline)) {
    return undefined;
  }
  if (headline.includes("BREAKING CHANGE:") || MAJOR_PATTERN.test(headline)) {
    return "major";
  }
  if (MINOR_PATTERN.test(headline)) {
    return "minor";
  }
  if (PATCH_PATTERN.test(headline)) {
    return "patch";
  }
  throw new Error(`Cannot determine a version bump from commit: ${headline}`);
}

export function classifyPullRequestTitle(title) {
  return parseReleaseVersion(title.split(/\r?\n/, 1)[0].trim())
    ? "stop"
    : classifyCommitSubject(title);
}

export function highestVersionBump(subjects) {
  let selectedBump;
  for (const subject of subjects) {
    const bump = classifyCommitSubject(subject);
    if (
      bump &&
      (!selectedBump ||
        BUMP_PRIORITY.get(bump) > BUMP_PRIORITY.get(selectedBump))
    ) {
      selectedBump = bump;
    }
  }
  if (!selectedBump) {
    throw new Error("No unreleased conventional commits were found");
  }
  return selectedBump;
}

export function incrementVersion(version, bump) {
  assertVersion(version);
  const [major, minor, patch] = version.split(".").map(Number);
  if (bump === "major") {
    return `${major + 1}.0.0`;
  }
  if (bump === "minor") {
    return `${major}.${minor + 1}.0`;
  }
  if (bump === "patch") {
    return `${major}.${minor}.${patch + 1}`;
  }
  throw new Error(`Unsupported version bump: ${bump}`);
}

export function findReleaseCoverage(
  repo,
  baseSha,
  currentVersion,
  knownReleases = KNOWN_RELEASES,
) {
  assertCommitSha(baseSha, "baseSha");
  assertVersion(currentVersion, "currentVersion");
  const commits = git(repo, ["rev-list", "--first-parent", baseSha]).split(
    "\n",
  );

  for (const commitSha of commits) {
    const commit = getCommit(repo, commitSha);
    if (parseReleaseVersion(commit.subject) !== currentVersion) {
      continue;
    }
    if (getPackageVersion(repo, commitSha) !== currentVersion) {
      continue;
    }
    const knownRelease = findKnownRelease(knownReleases, commitSha);
    if (
      knownRelease?.mode !== "full-compatibility" &&
      parseReleaseThrough(commit.body) &&
      !parseReleaseDate(commit.body)
    ) {
      throw new Error(
        `Release commit ${commitSha} has no release date metadata`,
      );
    }

    const metadata = resolveReleaseMetadata(repo, commitSha, knownReleases);
    if (metadata.version !== currentVersion) {
      continue;
    }
    const { releaseThroughSha } = metadata;
    if (metadata.kind === "recorded") {
      try {
        validateTagTarget(repo, `v${currentVersion}`, commitSha);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
          `Release ${currentVersion} is not finalized: ${message}`,
        );
      }
    } else if (metadata.kind === "full-compatibility") {
      try {
        validateLightweightTagTarget(repo, `v${currentVersion}`, commitSha);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
          `Release ${currentVersion} is not finalized: ${message}`,
        );
      }
    }
    assertCommitSha(releaseThroughSha, "Release-Through");
    if (!commitExists(repo, releaseThroughSha)) {
      throw new Error(
        `Release coverage commit ${releaseThroughSha} is missing`,
      );
    }
    if (!isAncestor(repo, releaseThroughSha, metadata.parentSha)) {
      throw new Error(
        `Release coverage ${releaseThroughSha} is not an ancestor of ${commitSha}`,
      );
    }
    return {
      releaseCommitSha: commitSha,
      releaseThroughSha,
    };
  }

  throw new Error(
    `No development release commit was found for package version ${currentVersion}`,
  );
}

export function createReleasePlan(
  repo,
  { baseSha, knownReleases, legacyRelease, sourceSha },
) {
  assertCommitSha(baseSha, "baseSha");
  assertCommitSha(sourceSha, "sourceSha");
  if (!commitExists(repo, baseSha) || !commitExists(repo, sourceSha)) {
    throw new Error("The base and source commits must exist locally");
  }
  if (!isAncestor(repo, sourceSha, baseSha)) {
    throw new Error(
      `Source commit ${sourceSha} is not contained in ${baseSha}`,
    );
  }

  const currentVersion = getPackageVersion(repo, baseSha);
  const coverage = findReleaseCoverage(
    repo,
    baseSha,
    currentVersion,
    knownReleases ?? legacyRelease ?? KNOWN_RELEASES,
  );
  if (isAncestor(repo, sourceSha, coverage.releaseThroughSha)) {
    return {
      ...coverage,
      baseSha,
      currentVersion,
      mode: "skip",
      releaseFromSha: coverage.releaseThroughSha,
      sourceSha,
    };
  }

  const commitShas = git(repo, [
    "rev-list",
    "--first-parent",
    "--reverse",
    `${coverage.releaseThroughSha}..${baseSha}`,
  ]).split("\n");
  const subjects = [];
  for (const commitSha of commitShas) {
    const commit = getCommit(repo, commitSha);
    if (commit.parents.length !== 1) {
      throw new Error(
        `Commit ${commitSha} has ${commit.parents.length} parents; squash-only history is required`,
      );
    }
    if (commitSha === coverage.releaseCommitSha) {
      continue;
    }
    if (parseReleaseVersion(commit.subject)) {
      throw new Error(
        `Commit ${commitSha} is not the validated release commit; squash-only history is required`,
      );
    }
    try {
      classifyCommitSubject(commit.subject);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Commit ${commitSha} is not conventional; squash-only history is required: ${message}`,
      );
    }
    subjects.push(commit.subject);
  }
  const bumpType = highestVersionBump(subjects);
  const nextVersion = incrementVersion(currentVersion, bumpType);

  return {
    ...coverage,
    baseSha,
    bumpType,
    currentVersion,
    mode: "release",
    nextVersion,
    releaseBranch: `release/v${nextVersion}`,
    releaseFromSha: coverage.releaseThroughSha,
    releaseThroughSha: baseSha,
    sourceSha,
  };
}

export function inspectReleaseCommit(
  repo,
  commitSha,
  knownReleases = KNOWN_RELEASES,
) {
  assertCommitSha(commitSha, "commitSha");
  const { parentSha, releaseDate, releaseThroughSha, version } =
    resolveReleaseMetadata(repo, commitSha, knownReleases);
  if (!releaseDate) {
    throw new Error(`Commit ${commitSha} is not a generated release commit`);
  }
  return {
    parentSha,
    releaseDate,
    releaseThroughSha,
    version,
  };
}

export function validateReleaseCommit(
  repo,
  {
    baseSha,
    commitSha,
    expectedTreeSha,
    knownReleases = KNOWN_RELEASES,
    releaseDate,
    releaseThroughSha,
    version,
  },
) {
  assertCommitSha(baseSha, "baseSha");
  assertCommitSha(commitSha, "commitSha");
  assertCommitSha(expectedTreeSha, "expectedTreeSha");
  assertCommitSha(releaseThroughSha, "releaseThroughSha");
  assertReleaseDate(releaseDate);
  assertVersion(version);
  const metadata = resolveReleaseMetadata(repo, commitSha, knownReleases);
  if (
    metadata.version !== version ||
    metadata.releaseThroughSha !== releaseThroughSha
  ) {
    throw new Error(`Release commit ${commitSha} has invalid release metadata`);
  }
  if (metadata.releaseDate !== releaseDate) {
    throw new Error(`Release commit ${commitSha} has invalid date metadata`);
  }

  const parentSha = metadata.parentSha;
  if (!isAncestor(repo, parentSha, baseSha)) {
    throw new Error(
      `Release parent ${parentSha} is not contained in development ${baseSha}`,
    );
  }
  if (!isAncestor(repo, releaseThroughSha, parentSha)) {
    throw new Error(
      `Release coverage ${releaseThroughSha} is not an ancestor of ${parentSha}`,
    );
  }
  for (const file of RELEASE_FILES) {
    if (
      getBlobSha(repo, parentSha, file) !==
      getBlobSha(repo, releaseThroughSha, file)
    ) {
      throw new Error(`${file} changed after the release coverage point`);
    }
  }

  const changedFiles = getChangedFiles(repo, parentSha, commitSha);
  if (!sameFiles(changedFiles, [...RELEASE_FILES].sort())) {
    throw new Error(
      `Release commit changed unexpected files: ${changedFiles.join(", ")}`,
    );
  }
  for (const file of RELEASE_FILES) {
    if (
      getBlobSha(repo, commitSha, file) !==
      getBlobSha(repo, expectedTreeSha, file)
    ) {
      throw new Error(`${file} does not match the generated release`);
    }
  }
  return { parentSha };
}

export function validateRebaseCandidate(repo, { baseSha, commitSha }) {
  assertCommitSha(baseSha, "baseSha");
  assertCommitSha(commitSha, "commitSha");
  const { parentSha } = inspectReleaseCommit(repo, commitSha);
  if (!isAncestor(repo, parentSha, baseSha)) {
    throw new Error(
      `Release parent ${parentSha} is not contained in development ${baseSha}`,
    );
  }

  const range = `${parentSha}..${baseSha}`;
  const output = git(repo, ["rev-list", "--first-parent", "--reverse", range]);
  const interveningCommits = output ? output.split("\n") : [];
  for (const interveningSha of interveningCommits) {
    const commit = getCommit(repo, interveningSha);
    if (commit.parents.length === 0) {
      throw new Error(`Intervening commit ${interveningSha} has no parent`);
    }
    const changedReleaseFiles = getChangedFiles(
      repo,
      commit.parents[0],
      interveningSha,
    ).filter((file) => RELEASE_FILES.includes(file));
    if (changedReleaseFiles.length > 0) {
      throw new Error(
        `Cannot rebase: intervening commit ${interveningSha} changed ${changedReleaseFiles.join(", ")}`,
      );
    }
  }

  return { parentSha };
}

export function validateTagTarget(repo, tag, expectedCommitSha) {
  assertCommitSha(expectedCommitSha, "expectedCommitSha");
  const actualCommitSha = git(repo, ["rev-list", "-n", "1", tag]);
  if (actualCommitSha !== expectedCommitSha) {
    throw new Error(
      `${tag} points to ${actualCommitSha}, expected ${expectedCommitSha}`,
    );
  }
}

export function evaluateVersionStatus({
  finalizeResult,
  merged,
  releaseResult,
  verifyResult,
  versionType,
}) {
  if (merged !== "true") {
    return {
      message: "Version skipped because the PR was not merged",
      ok: true,
    };
  }
  if (verifyResult !== "success") {
    return { message: `Version classification ${verifyResult}`, ok: false };
  }
  if (versionType === "stop") {
    return finalizeResult === "success"
      ? { message: "Release finalization succeeded", ok: true }
      : { message: `Release finalization ${finalizeResult}`, ok: false };
  }
  return releaseResult === "success"
    ? { message: "Version release succeeded", ok: true }
    : { message: `Version release ${releaseResult}`, ok: false };
}

function parseOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index];
    const value = args[index + 1];
    if (!name?.startsWith("--") || value === undefined) {
      throw new Error(`Invalid command option near ${name ?? "end of input"}`);
    }
    options[name.slice(2)] = value;
  }
  return options;
}

function requireOption(options, name) {
  const value = options[name];
  if (!value) {
    throw new Error(`--${name} is required`);
  }
  return value;
}

function writeGithubOutput(outputPath, values) {
  const lines = Object.entries(values).map(
    ([name, value]) => `${name}=${value}`,
  );
  appendFileSync(outputPath, `${lines.join("\n")}\n`);
}

function runPlan(options) {
  const repo = resolve(options.repo ?? ".");
  const plan = createReleasePlan(repo, {
    baseSha: requireOption(options, "base"),
    sourceSha: requireOption(options, "source"),
  });
  const values = {
    mode: plan.mode,
    base_sha: plan.baseSha,
    source_sha: plan.sourceSha,
    current_version: plan.currentVersion,
    release_commit_sha: plan.releaseCommitSha,
    release_from_sha: plan.releaseFromSha,
    release_through_sha: plan.releaseThroughSha,
    bump_type: plan.bumpType ?? "",
    next_version: plan.nextVersion ?? "",
    release_branch: plan.releaseBranch ?? "",
  };
  if (options.output) {
    writeGithubOutput(resolve(options.output), values);
  } else {
    console.log(JSON.stringify(values));
  }
}

function runClassification(options) {
  const versionType = classifyPullRequestTitle(requireOption(options, "title"));
  if (options.output) {
    writeGithubOutput(resolve(options.output), { versionType });
  } else {
    console.log(versionType);
  }
}

function runValidation(options) {
  validateReleaseCommit(resolve(options.repo ?? "."), {
    baseSha: requireOption(options, "base"),
    commitSha: requireOption(options, "commit"),
    expectedTreeSha: requireOption(options, "expected-tree"),
    releaseDate: requireOption(options, "release-date"),
    releaseThroughSha: requireOption(options, "release-through"),
    version: requireOption(options, "version"),
  });
  console.log(`Validated release commit ${options.commit}`);
}

function runInspection(options) {
  const values = inspectReleaseCommit(
    resolve(options.repo ?? "."),
    requireOption(options, "commit"),
  );
  console.log(
    JSON.stringify({
      parent_sha: values.parentSha,
      release_date: values.releaseDate,
      release_through_sha: values.releaseThroughSha,
      version: values.version,
    }),
  );
}

function runRebaseValidation(options) {
  validateRebaseCandidate(resolve(options.repo ?? "."), {
    baseSha: requireOption(options, "base"),
    commitSha: requireOption(options, "commit"),
  });
  console.log(`Validated rebase of ${options.commit} onto ${options.base}`);
}

function runStatus(options) {
  const status = evaluateVersionStatus({
    finalizeResult: requireOption(options, "finalize-result"),
    merged: requireOption(options, "merged"),
    releaseResult: requireOption(options, "release-result"),
    verifyResult: requireOption(options, "verify-result"),
    versionType: requireOption(options, "version-type"),
  });
  console.log(status.message);
  if (!status.ok) {
    process.exitCode = 1;
  }
}

function runTagValidation(options) {
  validateTagTarget(
    resolve(options.repo ?? "."),
    requireOption(options, "tag"),
    requireOption(options, "commit"),
  );
  console.log(`Validated ${options.tag} at ${options.commit}`);
}

function runCli() {
  const [command, ...args] = process.argv.slice(2);
  const options = parseOptions(args);
  if (command === "plan") {
    runPlan(options);
    return;
  }
  if (command === "classify") {
    runClassification(options);
    return;
  }
  if (command === "validate-commit") {
    runValidation(options);
    return;
  }
  if (command === "inspect") {
    runInspection(options);
    return;
  }
  if (command === "validate-rebase") {
    runRebaseValidation(options);
    return;
  }
  if (command === "status") {
    runStatus(options);
    return;
  }
  if (command === "validate-tag") {
    runTagValidation(options);
    return;
  }
  throw new Error(`Unknown release command: ${command ?? "none"}`);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (fileURLToPath(import.meta.url) === invokedPath) {
  try {
    runCli();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Release command failed: ${message}`);
    process.exitCode = 1;
  }
}
