import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

/**
 * Returns true when a `.git` directory (or file, for worktrees) exists at
 * rootDir. Does NOT require git to be installed.
 */
export function isGitRepo(rootDir: string): boolean {
  return existsSync(join(rootDir, ".git"));
}

/**
 * Returns true when git reports uncommitted changes in the working tree.
 * Non-blocking: any error (git not installed, not a repo) is caught and
 * treated as "unknown" → we return false so callers never crash.
 */
export function hasUncommittedChanges(rootDir: string): boolean {
  try {
    const result = execSync("git status --porcelain", {
      cwd: rootDir,
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 5_000,
    })
      .toString()
      .trim();
    return result.length > 0;
  } catch {
    return false;
  }
}

/**
 * Emits a non-fatal advisory warning when there are uncommitted changes.
 * We don't block or error — the files `init` writes are additions, not
 * mutations of existing content (unless --force is used), so working-tree
 * state is the user's call to manage.
 */
export function warnIfUncommittedChanges(rootDir: string): void {
  if (!isGitRepo(rootDir)) return;
  if (hasUncommittedChanges(rootDir)) {
    console.warn(
      "\n⚠  Uncommitted changes detected in the working tree.\n" +
        "   Consider committing or stashing before running init so that\n" +
        "   the Mise files appear as a clean, isolated commit.\n",
    );
  }
}
