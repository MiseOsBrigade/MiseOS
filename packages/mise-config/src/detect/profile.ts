import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { RepoProfile } from "../schema/mise-schema.js";

/**
 * Best-guess repo_profile detection. This only ever feeds a *default*
 * into mise.yaml — the file is advisory and human-editable, so a wrong
 * guess here costs nothing. We deliberately keep this to cheap,
 * top-level marker-file checks rather than deep source scanning.
 */

type ProfileScores = Record<RepoProfile, number>;

function fileExists(root: string, name: string): boolean {
  return existsSync(join(root, name));
}

function anyFileExists(root: string, names: string[]): boolean {
  return names.some((name) => fileExists(root, name));
}

function topLevelEntries(root: string): string[] {
  try {
    return readdirSync(root);
  } catch {
    return [];
  }
}

function hasExtension(entries: string[], extensions: string[]): boolean {
  return entries.some((entry) => extensions.some((ext) => entry.endsWith(ext)));
}

function readPackageJsonSafe(root: string): Record<string, unknown> | null {
  const pkgPath = join(root, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    return JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function detectRepoProfile(rootDir: string): RepoProfile {
  const scores: ProfileScores = {
    service: 0,
    library: 0,
    infra: 0,
    data: 0,
    docs: 0,
  };

  const entries = topLevelEntries(rootDir);
  const pkg = readPackageJsonSafe(rootDir);

  // --- service signals ---
  if (anyFileExists(rootDir, ["Dockerfile", "docker-compose.yml", "docker-compose.yaml", "Procfile"])) {
    scores.service += 3;
  }
  if (pkg) {
    const scripts = (pkg["scripts"] as Record<string, string> | undefined) ?? {};
    if (typeof scripts["start"] === "string" || typeof scripts["serve"] === "string") {
      scores.service += 1;
    }
    if (typeof pkg["private"] === "boolean" && pkg["private"] === true && !pkg["bin"]) {
      scores.service += 1;
    }
  }

  // --- library signals ---
  if (pkg) {
    const looksPublishable =
      typeof pkg["main"] === "string" ||
      typeof pkg["module"] === "string" ||
      typeof pkg["types"] === "string" ||
      typeof pkg["exports"] === "object";
    if (looksPublishable && pkg["private"] !== true) {
      scores.library += 2;
    }
    if (typeof pkg["name"] === "string" && (pkg["name"] as string).startsWith("@")) {
      scores.library += 1;
    }
  }
  if (anyFileExists(rootDir, ["tsup.config.ts", "rollup.config.js", "rollup.config.mjs"])) {
    scores.library += 1;
  }

  // --- infra signals ---
  if (hasExtension(entries, [".tf"]) || anyFileExists(rootDir, ["terraform", "Pulumi.yaml", "Pulumi.yml"])) {
    scores.infra += 3;
  }
  if (anyFileExists(rootDir, ["Chart.yaml", "kustomization.yaml", "kustomization.yml"])) {
    scores.infra += 2;
  }
  if (entries.includes("ansible") || anyFileExists(rootDir, ["ansible.cfg"])) {
    scores.infra += 2;
  }

  // --- data signals ---
  if (hasExtension(entries, [".ipynb"])) {
    scores.data += 2;
  }
  if (anyFileExists(rootDir, ["dbt_project.yml"])) {
    scores.data += 3;
  }
  if (entries.includes("dags") || entries.includes("notebooks")) {
    scores.data += 2;
  }

  // --- docs signals ---
  if (anyFileExists(rootDir, ["mkdocs.yml", "mkdocs.yaml", "_config.yml"])) {
    scores.docs += 3;
  }
  if (anyFileExists(rootDir, ["docusaurus.config.js", "docusaurus.config.ts"])) {
    scores.docs += 3;
  }

  const ranked = (Object.entries(scores) as [RepoProfile, number][]).sort((a, b) => b[1] - a[1]);
  const top = ranked[0];

  if (!top || top[1] === 0) {
    return "service";
  }
  return top[0];
}
