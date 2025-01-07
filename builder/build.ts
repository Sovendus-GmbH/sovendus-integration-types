import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { execSync } from "child_process";
import { Command } from "commander";
import tailwindcss from "tailwindcss";
import { build } from "vite";
// execute me with:
// npx ts-node build.ts build

const program = new Command();

program
  .command("build")
  .description("buildType: build")
  .action(async () => {
    console.log("Building started");

    await compileToJsFilesWithVite();
  });

export async function compileToJsFilesWithVite(): Promise<void> {
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
      outDir: "../dist",
      emptyOutDir: true,
      cssMinify: false,
      cssCodeSplit: false,
      sourcemap: true,
      rollupOptions: {
        input: "../admin-frontend/frontend_react_loader.ts",
        output: {
          entryFileNames: "frontend_react_loader.js",
          exports: "none",
          format: "iife",
        },
        // preserveEntrySignatures: "strict",
      },
    },
  });
}

export function runShellCommand(cmd: string): void {
  try {
    console.log(`Executing: ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
  } catch (error) {
    console.error(
      `Error executing command: ${cmd} | error: ${(error as Error)?.message || (error as Error)}`,
    );
    process.exit(1);
  }
}

program.parse(process.argv);
