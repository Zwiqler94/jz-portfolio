import createAngularPreset from "conventional-changelog-angular";
import { execFileSync } from "node:child_process";

const LOW_SIGNAL_TYPES = new Set(["chore", "ci", "build"]);
const FULL_SHA_PATTERN = /^[0-9a-f]{40}$/;

const preset = createAngularPreset();
const originalTransform = preset.writer.transform;
const changelogFrom = process.env.CHANGELOG_FROM;
const changelogTo = process.env.CHANGELOG_TO;
const changelogDate = process.env.CHANGELOG_DATE;
const controlledRange = Boolean(changelogFrom || changelogTo);

if (Boolean(changelogFrom) !== Boolean(changelogTo)) {
  throw new Error("CHANGELOG_FROM and CHANGELOG_TO must be set together");
}

if (
  controlledRange &&
  (!FULL_SHA_PATTERN.test(changelogFrom) || !FULL_SHA_PATTERN.test(changelogTo))
) {
  throw new Error(
    "CHANGELOG_FROM and CHANGELOG_TO must be full 40-character commit SHAs",
  );
}

if (controlledRange) {
  const currentHead = execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();

  if (currentHead !== changelogTo) {
    throw new Error(
      `CHANGELOG_TO must equal the current Git HEAD (${currentHead}), received ${changelogTo}`,
    );
  }
}

if (changelogDate && !/^\d{4}-\d{2}-\d{2}$/.test(changelogDate)) {
  throw new Error("CHANGELOG_DATE must use YYYY-MM-DD format");
}

export default {
  ...(controlledRange
    ? {
        parserOpts: {
          breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
        },
      }
    : {}),
  gitRawCommitsOpts: {
    ...(controlledRange
      ? {
          // The writer setting below keeps this explicit coverage range from
          // splitting at intermediate semver tags.
          from: changelogFrom,
          to: changelogTo,
        }
      : {}),
  },
  writerOpts: {
    ...(controlledRange ? { generateOn: null } : {}),
    ...(controlledRange || changelogDate
      ? {
          finalizeContext(context) {
            return {
              ...context,
              ...(changelogDate ? { date: changelogDate } : {}),
              ...(controlledRange
                ? {
                    currentTag: `v${context.version}`,
                    linkCompare: true,
                    previousTag: changelogFrom,
                  }
                : {}),
            };
          },
        }
      : {}),
    transform(commit, context) {
      if (commit.header?.startsWith("chore(release):")) {
        return undefined;
      }

      const transformedCommit = originalTransform(commit, context);

      if (transformedCommit) {
        return {
          ...transformedCommit,
          type:
            LOW_SIGNAL_TYPES.has(commit.type) &&
            transformedCommit.type !== "Reverts"
              ? "Maintenance"
              : transformedCommit.type,
        };
      }

      if (!LOW_SIGNAL_TYPES.has(commit.type) || commit.revert) {
        return undefined;
      }

      // Angular discards chore/ci/build commits before normalizing their
      // subjects and references. Normalize via a supported type, then retain
      // the original low-signal category as Maintenance.
      return {
        ...originalTransform({ ...commit, type: "fix" }, context),
        type: "Maintenance",
      };
    },
  },
};
