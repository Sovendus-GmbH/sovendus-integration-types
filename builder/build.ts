import { Command } from "commander";
import { rmSync } from "fs";
import { build } from "vite";
import { execSync } from "child_process";
import react from "@vitejs/plugin-react";

// execute me with:
// npx ts-node build.ts build

const program = new Command();

("sovendus-plugins-commons/builder/build.ts build");

program
  .command("build")
  .description("buildType: build")
  .action(async () => {
    console.log("Building started");

    const buildRootDir = "../dist";
    cleanDistFolder(buildRootDir);
    await compileToJsFilesWithVite(buildRootDir);
  });

export async function compileToJsFilesWithVite(
  buildRootDir: string
): Promise<void> {
  await build({
    plugins: [react()],
    build: {
      target: "es6",
      outDir: buildRootDir,
      emptyOutDir: false,
      cssMinify: false,
      cssCodeSplit: false,
      sourcemap: true,
      rollupOptions: {
        input: "../admin-frontend/frontend_react_loader.ts",
        output: {
          entryFileNames: "frontend_react_loader.js",
        },
        // preserveEntrySignatures: "strict",
      },
    },
  });
}

export function cleanDistFolder(distDir: string): void {
  console.log(`started dist folder cleaning (${distDir})`);
  try {
    rmSync(distDir, { force: true, recursive: true });
    console.log(`Done dist folder cleaning (${distDir})`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log("No dist folder found to clean");
  }
}

export function runShellCommand(cmd: string): void {
  try {
    console.log(`Executing: ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
  } catch (error) {
    console.error(
      `Error executing command: ${cmd} | error: ${(error as Error)?.message || (error as Error)}`
    );
    process.exit(1);
  }
}

program.parse(process.argv);
