import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { MiseEnvironment } from "../schema/mise-schema.js";

/**
 * Guesses which forge a repo lives on by reading .git/config directly
 * (no git binary required). Falls back to "local" when there is no git
 * repo at all, and to "github" when a repo exists but the remote can't
 * be classified — github is the only forge with a real workflow
 * template in v1, so that default keeps init() honest.
 */
export function detectEnvironment(rootDir: string): MiseEnvironment {
  const gitConfigPath = join(rootDir, ".git", "config");
  if (!existsSync(gitConfigPath)) {
    return "local";
  }

  let configText = "";
  try {
    configText = readFileSync(gitConfigPath, "utf8");
  } catch {
    return "github";
  }

  if (/github\.com/i.test(configText)) return "github";
  if (/gitlab\.com/i.test(configText)) return "gitlab";
  if (/bitbucket\.org/i.test(configText)) return "bitbucket";

  return "github";
}

/** True when a `.git` directory is present at rootDir. */
export function isGitRepo(rootDir: string): boolean {
  return existsSync(join(rootDir, ".git"));
}
