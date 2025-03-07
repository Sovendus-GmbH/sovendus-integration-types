import type { BuildConfig } from "sovendus-builder";

const buildConfig: BuildConfig = {
  foldersToClean: ["dist"],
  filesToCompile: [
    {
      input: "src/v3/index.ts",
      output: "dist/v3/index",
      options: {
        type: "vanilla",
        packageConfig: {
          dtsEntryRoot: "src",
          dtsInclude: ["src/**/*"],
          isPackage: true,
        },
      },
    },
  ],
};

export default buildConfig;
