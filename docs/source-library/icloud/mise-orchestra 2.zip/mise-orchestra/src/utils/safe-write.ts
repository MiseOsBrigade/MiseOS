import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export interface WriteOptions {
  /** When true, log what *would* happen but touch nothing on disk. */
  dryRun: boolean;
  /** When true, allow overwriting files that already exist. */
  force: boolean;
}

export type WriteOutcome = "written" | "skipped" | "dry-run";

export interface WriteResult {
  path: string;
  outcome: WriteOutcome;
  /** Human-readable reason when outcome is "skipped". */
  reason?: string;
}

/**
 * Writes `content` to `filePath` respecting the advisory-first safety
 * contract of `mise-orchestra init`:
 *
 *   - If `dryRun` is true: log to stdout and return without touching disk.
 *   - If the file already exists and `force` is false: skip it.
 *   - Otherwise: create parent directories if needed, then write atomically.
 *
 * All writes are synchronous — init is a CLI that touches a handful of
 * small files, not a server loop; sync keeps error paths simple.
 */
export function safeWrite(filePath: string, content: string, opts: WriteOptions): WriteResult {
  if (opts.dryRun) {
    console.log(`  [dry-run] would write → ${filePath}`);
    return { path: filePath, outcome: "dry-run" };
  }

  if (existsSync(filePath) && !opts.force) {
    console.log(`  [skip]    already exists → ${filePath}  (use --force to overwrite)`);
    return {
      path: filePath,
      outcome: "skipped",
      reason: "file already exists",
    };
  }

  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(filePath, content, { encoding: "utf8" });
  console.log(`  [write]   ${filePath}`);
  return { path: filePath, outcome: "written" };
}
