import type { BuildConfig } from "sovendus-builder";

const buildConfig: BuildConfig = {
  foldersToClean: ["dist"],
  filesToCompile: [
    {
      sovOptions: {
        input: "src/v3/index.ts",
        output: "dist/v3/index",
        type: "vanilla",
        packageConfig: {
          dtsEntryRoot: "src/v3",
          dtsInclude: ["src/v3/**/*"],
          isPackage: true,
        },
      },
    },
    {
      sovOptions: {
        input: "src/v3/settings-only-types/index.ts",
        output: "dist/v3/settings-only-types/index",
        type: "vanilla",
        packageConfig: {
          dtsEntryRoot: "src/v3/settings-only-types",
          dtsInclude: ["src/v3/settings-only-types/**/*"],
          isPackage: true,
        },
      },
    },
  ],
};

export default buildConfig;
