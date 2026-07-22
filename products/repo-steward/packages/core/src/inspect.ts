import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import type { RepositoryInspection } from "./types.js";

function safeList(path: string): string[] {
  try {
    return readdirSync(path);
  } catch {
    return [];
  }
}

function packageManagerFromField(value: unknown): RepositoryInspection["packageManager"] {
  if (typeof value !== "string") return "unknown";
  const name = value.split("@")[0];
  return name === "pnpm" || name === "npm" || name === "yarn" ? name : "unknown";
}

export function inspectRepository(inputRoot: string): RepositoryInspection {
  const root = resolve(inputRoot);
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    throw new Error(`Repository root does not exist or is not a directory: ${root}`);
  }

  const findings: string[] = [];
  const packageJsonPath = join(root, "package.json");

  let packageManager: RepositoryInspection["packageManager"] = "unknown";
  if (existsSync(join(root, "pnpm-lock.yaml"))) packageManager = "pnpm";
  else if (existsSync(join(root, "package-lock.json"))) packageManager = "npm";
  else if (existsSync(join(root, "yarn.lock"))) packageManager = "yarn";

  let scripts: string[] = [];
  if (existsSync(packageJsonPath)) {
    try {
      const parsed = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
        scripts?: Record<string, string>;
        packageManager?: unknown;
      };
      scripts = Object.keys(parsed.scripts ?? {});
      if (packageManager === "unknown") {
        packageManager = packageManagerFromField(parsed.packageManager);
      }
    } catch {
      findings.push("package.json could not be parsed.");
    }
  }

  const workflows = safeList(join(root, ".github", "workflows")).filter((name) =>
    /\.ya?ml$/i.test(name)
  );

  const securityCandidates = [
    "SECURITY.md",
    ".gitignore",
    ".env.example",
    ".github/CODEOWNERS",
    "docs/CODEOWNERS",
    "CODEOWNERS",
    ".github/dependabot.yml"
  ];
  const securityFiles = securityCandidates.filter((name) => existsSync(join(root, name)));

  if (!existsSync(join(root, ".gitignore"))) findings.push("Missing .gitignore.");
  if (!existsSync(join(root, "SECURITY.md"))) findings.push("Missing SECURITY.md.");
  if (workflows.length === 0) findings.push("No GitHub Actions workflows detected.");
  if (existsSync(packageJsonPath) && packageManager === "unknown") {
    findings.push("package.json exists without a recognized package manager or lockfile.");
  }

  return {
    root,
    packageManager,
    scripts: scripts.sort(),
    workflows: workflows.sort(),
    securityFiles: securityFiles.sort(),
    findings
  };
}
