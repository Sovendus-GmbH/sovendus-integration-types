const releaseConfig: ReleaseConfig = {
  package: {
    name: "sovendus-plugins-core",
    directory: "./",
    release: false,
    updateDeps: true,
  },
  subPackages: [
    {
      name: "sovendus-integration-types",
      directory: "integration-types",
      updateDeps: true,
      release: true,
      releaseOptions: {
        tagPrefix: "types_",
        foldersToScanAndBumpThisPackage: [
          { folder: "integration-settings-ui" },
          { folder: "integration-scripts" },
        ],
      },
    },
    {
      name: "sovendus-integration-settings-ui",
      directory: "integration-settings-ui",
      updateDeps: true,
      release: true,
      releaseOptions: {
        tagPrefix: "settings_ui_",
        foldersToScanAndBumpThisPackage: [],
      },
    },
    {
      name: "sovendus-integration-scripts",
      directory: "integration-scripts",
      updateDeps: true,
      release: true,
      releaseOptions: {
        tagPrefix: "scripts_",
        foldersToScanAndBumpThisPackage: [],
      },
    },
  ],
};
