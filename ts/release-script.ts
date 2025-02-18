import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface PackageJson {
  version: string;

  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  peerDependencies?: { [key: string]: string };
  updateIgnore?: string[];
}

interface ReleaseConfig {
  package: ReleasePackage;
  subPackages: ReleasePackage[];
}

interface ReleasePackage {
  name: string;
  directory: string;
  release: boolean;
  releaseOptions?: ReleaseOptions;
  updateDeps: boolean;
}

interface ReleaseOptions {
  tagPrefix: string;
  foldersToScanAndBumpThisPackage: {
    folder: string;
  }[];
}

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

function generateTag(
  releaseOptions: ReleaseOptions,
  newVersion: string,
): string {
  return `${releaseOptions.tagPrefix}${newVersion}`;
}

function checkTagExists(tag: string, pkgName: string): boolean {
  try {
    execSync(`git rev-parse ${tag}`, { stdio: "ignore" });
    console.log(`Tag ${tag} already exists. Skipping ${pkgName}.`);
    return true;
  } catch (error) {
    console.log(`Tag ${tag} does not exist. Continuing release.`);
    return false;
  }
}

function updateDependencies(
  pkg: ReleasePackage,
  packageDir: string,
  newVersion: string,
): void {
  if (pkg.dependencies.length === 0) {
    return;
  }
  const packageJsonPath = path.join(packageDir, "package.json");
  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf-8"),
  ) as PackageJson;
  console.log("Current package.json", packageJson);
  pkg.dependencies.forEach((dep) => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      packageJson.dependencies[dep] = newVersion;
    }
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      packageJson.devDependencies[dep] = newVersion;
    }
  });
  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
  console.log(`Updated dependencies in ${pkg.name}`, packageJson);
}

function publishPackage(packageDir: string, pkg: ReleasePackage): void {
  console.log(`Publishing ${pkg.name}...`);
  // Run lint
  execSync("yarn lint", { stdio: "inherit" });
  // Build the package
  execSync("yarn build", { stdio: "inherit" });
  // Publish the package
  execSync("npm publish", { stdio: "inherit" });
}

function commitAndTag(
  tag: string,
  pkg: ReleasePackage,
  newVersion: string,
): void {
  // Stage changes
  execSync("git add .", { stdio: "inherit" });
  // Create commit
  execSync(`git commit -m "chore(release): ${pkg.name} v${newVersion}"`, {
    stdio: "inherit",
  });
  // Create tag
  execSync(`git tag ${tag}`, { stdio: "inherit" });
  console.log(`Created commit and tagged ${pkg.name} with ${tag}.`);
}

// Usage in your release loop:
function releasePackage(pkg: ReleasePackage): void {
  const newVersion = getNewVersion();

  const tag = generateTag(pkg, newVersion);

  // Check if tag exists.
  if (checkTagExists(tag, pkg.name)) {
    return;
  }

  console.log(`Releasing ${pkg.name}...`);
  const packageDir = path.resolve(__dirname, pkg.directory);
  process.chdir(packageDir);

  // Update dependencies in package.json if needed.
  updateDependencies(pkg, packageDir, newVersion);

  // Publish package (lint, build, publish).
  publishPackage(packageDir, pkg);

  // Stage commit and create tag.
  commitAndTag(tag, pkg, newVersion);
}

function bumpDependencies(packageJson: PackageJson): void {
  const updateIgnore = packageJson.updateIgnore;
  if (updateIgnore) {
    execSync(`ncu -u --reject ${updateIgnore.join(" ")}`, { stdio: "inherit" });
  } else {
    execSync("ncu -u", { stdio: "inherit" });
  }
}

function getNewVersion(): string {
  const lernaJsonPath = path.resolve(process.cwd(), "lerna.json");
  const lernaJson = JSON.parse(fs.readFileSync(lernaJsonPath, "utf-8")) as {
    version: string;
  };
  const newVersion = lernaJson.version;
  return newVersion;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function logger(message: string, ...other: unknown[]): void {
  console.log(`[sovendus-release-tool]: ${message}`, ...other);
}

function loggerError(message: string, ...other: unknown[]): void {
  // eslint-disable-next-line no-console
  console.error(`[sovendus-release-tool]: ${message}`, ...other);
}
