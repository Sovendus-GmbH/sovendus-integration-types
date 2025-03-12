import type { ReleaseConfig } from "sovendus-release-tool";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      updateDeps: true,
      version: "3.3.26",
      release: true,
      lintAndBuild: true,
      test: false, // TODO add some zod validation test
      releaseOptions: {
        foldersToScanAndBumpThisPackage: [
          // scan whole dev env
          { folder: "../../../../" },
        ],
      },
    },
  ],
};
export default releaseConfig;
