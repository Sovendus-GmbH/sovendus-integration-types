/* eslint-disable no-console */
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { Command } from "commander";
import { rmSync } from "fs";
import tailwindcss from "tailwindcss";
import { build } from "vite";

const program = new Command();

program
  .command("build")
  .description("buildType: build")
  .option(
    "-bp, --backendpath <path>",
    "specify the dist folder path",
    "../dist",
  )
  .option(
    "-fp, --frontendpath <path>",
    "specify the dist folder path",
    "../dist",
  )
  .action(async (options: { backendpath: string; frontendpath: string }) => {
    console.log("Building started");
    const backendDistFolder = options.backendpath;
    const frontendDistFolder = options.frontendpath;
    cleanDistFolder(backendDistFolder);
    cleanDistFolder(frontendDistFolder);
    await compileToJsFilesWithVite(backendDistFolder, frontendDistFolder);
  });

const filesToCompile = [
  {
    input: "../admin-frontend/frontend_react_loader.ts",
    output: "frontend_react_loader.js",
    type: "backend",
  },
  {
    input: "page-scripts/landing-page/sovendus-page.ts",
    output: "sovendus-page.js",
    type: "frontend",
  },
  {
    input: "page-scripts/thankyou-page/thankyou-page.ts",
    output: "thankyou-page.js",
    type: "frontend",
  },
];

async function compileToJsFilesWithVite(
  backendDistFolder: string,
  frontendDistFolder: string,
): Promise<void> {
  await Promise.all(
    filesToCompile.map(async (file) => {
      await build({
        root: "./",
        base: "./",
        plugins: [react()],
        css: {
          postcss: {
            plugins: [tailwindcss, autoprefixer],
          },
        },
        build: {
          target: "es6",
          outDir:
            file.type === "backend" ? backendDistFolder : frontendDistFolder,
          minify: false,
          emptyOutDir: false,
          cssMinify: false,
          cssCodeSplit: true,
          sourcemap: true,
          rollupOptions: {
            input: file.input,
            output: {
              entryFileNames: file.output,
              assetFileNames: "[name][extname]",
              exports: "none",
              format: "iife",
            },
            // preserveEntrySignatures: "strict",
          },
        },
      });
    }),
  );
}

function cleanDistFolder(distDir: string): void {
  console.log(`started dist folder cleaning (${distDir})`);
  try {
    rmSync(distDir, { force: true, recursive: true });
    console.log(`Done dist folder cleaning (${distDir})`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log("No dist folder found to clean");
  }
}

program.parse(process.argv);
