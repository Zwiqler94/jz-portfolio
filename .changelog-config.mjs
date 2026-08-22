import createAngularPreset from "conventional-changelog-angular";

const LOW_SIGNAL_SECTION_MAP = new Map([
  ["chore", "Maintenance"],
  ["Build System", "Maintenance"],
  ["Continuous Integration", "Maintenance"],
]);

const preset = createAngularPreset();
const originalTransform = preset.writer.transform;
const changelogFrom = process.env.CHANGELOG_FROM;

export default {
  gitRawCommitsOpts: {
    ...(changelogFrom ? { from: changelogFrom } : {}),
  },
  writerOpts: {
    ...(changelogFrom
      ? {
          finalizeContext(context) {
            return {
              ...context,
              currentTag: `v${context.version}`,
              linkCompare: true,
              previousTag: changelogFrom,
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
