import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import type { RepositoryInspection } from "./types.js";

function safeList(path: string): string[] {
  try { return readdirSync(path); } catch { return []; }
}

export function inspectRepository(inputRoot: string): RepositoryInspection {
  const root = resolve(inputRoot);
  const findings: string[] = [];
  const packageJsonPath = join(root, "package.json");

  let packageManager: RepositoryInspection["packageManager"] = "unknown";
  if (existsSync(join(root, "pnpm-lock.yaml"))) packageManager = "pnpm";
  else if (existsSync(join(root, "package-lock.json"))) packageManager = "npm";
  else if (existsSync(join(root, "yarn.lock"))) packageManager = "yarn";

  let scripts: string[] = [];
  if (existsSync(packageJsonPath)) {
    try {
      const parsed = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { scripts?: Record<string, string> };
      scripts = Object.keys(parsed.scripts ?? {});
    } catch {
      findings.push("package.json could not be parsed.");
    }
  }

  const workflows = safeList(join(root, ".github", "workflows")).filter((name) => /\.ya?ml$/i.test(name));
  const securityFiles = ["SECURITY.md", ".gitignore", ".env.example", "CODEOWNERS", ".github/dependabot.yml"].filter((name) => existsSync(join(root, name)));

  if (!existsSync(join(root, ".gitignore"))) findings.push("Missing .gitignore.");
  if (!existsSync(join(root, "SECURITY.md"))) findings.push("Missing SECURITY.md.");
  if (workflows.length === 0) findings.push("No GitHub Actions workflows detected.");

  return { root, packageManager, scripts: scripts.sort(), workflows: workflows.sort(), securityFiles: securityFiles.sort(), findings };
}
