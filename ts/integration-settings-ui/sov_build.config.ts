import type { BuildConfig, PluginOption } from "sovendus-builder";
import dts from "vite-plugin-dts";

const buildConfig: BuildConfig = {
  foldersToClean: ["dist"],
  filesToCompile: [
    // {
    //   input: "src/sovendus-app-settings.tsx",
    //   output: "dist/sovendus-app-settings.js",
    //   options: {
    //     type: "react-tailwind",
    //     otherOptions: {

    //     },
    //     rollupOptions: {
    //       output: {
    //         exports: "auto",
    //       },
    //     },
    //   },
    // },
    {
      input: "src/index.ts",
      output: "dist/index.js",
      options: {
        type: "react-tailwind",
        plugins: [
          dts({
            include: ["src/**/*"],
            exclude: ["src/**/*.test.tsx", "src/**/*.stories.tsx"],
          }) as unknown as PluginOption,
        ],

        buildOptions: {
          cssCodeSplit: false,
          cssMinify: false,
          lib: {
            entry: "src/index.ts",
            formats: ["es", "cjs"],
            fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
          },
        },

        rollupOptions: {
          output: {
            exports: "auto",
          },
          external: (id): boolean => {
            const modulesToExternalize = [
              "os",
              "path",
              "child_process",
              "fs",
              "process",
              "fsevents",
            ];
            return modulesToExternalize.includes(id) || id.startsWith("node:");
          },
        },
      },
    },

    // {
    //   input: "src/components/backend-form.tsx",
    //   output: "dist/backend-form.js",
    //   options: {
    //     type: "react",
    //     rollupOptions: {
    //       output: {
    //         exports: "auto",
    //       },
    //     },
    //   },
    // },
  ],
};

export default buildConfig;
