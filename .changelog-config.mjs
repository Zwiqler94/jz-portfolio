import createAngularPreset from "conventional-changelog-angular";

const LOW_SIGNAL_SECTION_MAP = new Map([
  ["chore", "Maintenance"],
  ["Build System", "Maintenance"],
  ["Continuous Integration", "Maintenance"],
]);

const preset = createAngularPreset();
const originalTransform = preset.writer.transform;
const changelogFrom = process.env.CHANGELOG_FROM;
const changelogDate = process.env.CHANGELOG_DATE;

if (changelogDate && !/^\d{4}-\d{2}-\d{2}$/.test(changelogDate)) {
  throw new Error("CHANGELOG_DATE must use YYYY-MM-DD format");
}

export default {
  gitRawCommitsOpts: {
    ...(changelogFrom ? { from: changelogFrom } : {}),
  },
  writerOpts: {
    ...(changelogFrom || changelogDate
      ? {
          finalizeContext(context) {
            return {
              ...context,
              ...(changelogDate ? { date: changelogDate } : {}),
              ...(changelogFrom
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

      if (!transformedCommit) {
        return transformedCommit;
      }

      return {
        ...transformedCommit,
        type:
          LOW_SIGNAL_SECTION_MAP.get(transformedCommit.type) ??
          transformedCommit.type,
      };
    },
  },
};
