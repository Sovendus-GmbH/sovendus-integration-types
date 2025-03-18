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
          dtsEntryRoot: "src/v3",
          dtsInclude: ["src/v3/**/*"],
          isPackage: true,
        },
      },
    },
    {
      input: "src/v3/settings-only/index.ts",
      output: "dist/v3/settings-only/index",
      options: {
        type: "vanilla",
        packageConfig: {
          dtsEntryRoot: "src/v3/settings-only",
          dtsInclude: ["src/v3/settings-only/**/*"],
          isPackage: true,
        },
      },
    },
  ],
};

export default buildConfig;
