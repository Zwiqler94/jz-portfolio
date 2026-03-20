import createAngularPreset from "conventional-changelog-angular";

const LOW_SIGNAL_SECTION_MAP = new Map([
  ["chore", "Maintenance"],
  ["Build System", "Maintenance"],
  ["Continuous Integration", "Maintenance"],
]);

const preset = createAngularPreset();
const originalTransform = preset.writer.transform;

export default {
  writerOpts: {
    transform(commit, context) {
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
