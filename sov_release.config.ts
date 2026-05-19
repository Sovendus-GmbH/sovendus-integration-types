import type { ReleaseConfig } from "sovendus-release-tool";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      updateDeps: true,
      lint: true,
      build: true,
      test: false,
      release: {
        version: "3.9.1",
        foldersToScanAndBumpThisPackage: [
          // scan whole dev env
          { folder: "../../../../" },
        ],
      },
    },
  ],
};
export default releaseConfig;
