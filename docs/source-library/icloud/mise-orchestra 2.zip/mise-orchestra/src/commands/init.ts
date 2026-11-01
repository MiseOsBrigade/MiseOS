import { resolve } from "node:path";

import { detectRepoProfile } from "../detect/profile.js";
import { detectEnvironment } from "../detect/environment.js";
import { buildMiseConfig } from "../templates/mise-yaml.js";
import { renderMiseYaml } from "../templates/mise-yaml.js";
import { renderWorkflow } from "../templates/workflow.js";
import { renderExplainer } from "../templates/explainer.js";
import { safeWrite, type WriteResult } from "../utils/safe-write.js";
import { warnIfUncommittedChanges } from "../utils/git.js";
import type { MiseEnvironment, RepoProfile } from "../schema/mise-schema.js";

export interface InitOptions {
  /** Explicit repo_profile override; undefined → auto-detect. */
  profile?: RepoProfile;
  /** Explicit environment override; undefined → auto-detect. */
  environment?: MiseEnvironment;
  /** Overwrite files that already exist. Default false. */
  force: boolean;
  /** Preview without writing anything. Default false. */
  dryRun: boolean;
  /** Also write docs/mise-orchestra.md. Default false. */
  withDocs: boolean;
  /** Directory to initialise. Default process.cwd(). */
  cwd?: string;
}

/**
 * Core logic for `mise-orchestra init`.
 *
 * Separated from the Commander CLI entry so it can be called
 * programmatically in tests without spawning a child process.
 */
export async function runInit(opts: InitOptions): Promise<void> {
  const rootDir = resolve(opts.cwd ?? process.cwd());

  console.log("\n🎼  Mise DevOps Orchestra — init\n");

  // Non-blocking advisory warning only; never blocks init.
  warnIfUncommittedChanges(rootDir);

  // Resolve profile and environment — use explicit flags when provided.
  const profile: RepoProfile = opts.profile ?? detectRepoProfile(rootDir);
  const environment: MiseEnvironment = opts.environment ?? detectEnvironment(rootDir);

  console.log(`  repo_profile  → ${profile}${opts.profile ? " (explicit)" : " (auto-detected)"}`);
  console.log(`  environment   → ${environment}${opts.environment ? " (explicit)" : " (auto-detected)"}\n`);

  const config = buildMiseConfig(profile, environment);

  const writeOpts = { dryRun: opts.dryRun, force: opts.force };
  const results: WriteResult[] = [];

  // ── 1. mise.yaml ─────────────────────────────────────────────────────────
  results.push(safeWrite(`${rootDir}/mise.yaml`, renderMiseYaml(config), writeOpts));

  // ── 2. GitHub Actions workflow ─────────────────────────────────────────
  // Only emit the workflow when the target forge is GitHub.
  // For other environments the user will need to wire up the equivalent
  // themselves — we print a nudge instead of guessing.
  if (environment === "github") {
    results.push(
      safeWrite(
        `${rootDir}/.github/workflows/mise-orchestra.yml`,
        renderWorkflow(),
        writeOpts,
      ),
    );
  } else {
    console.log(
      `  [skip]    GitHub Actions workflow (environment is "${environment}" — add CI integration manually)`,
    );
  }

  // ── 3. Optional docs page ────────────────────────────────────────────────
  if (opts.withDocs) {
    results.push(
      safeWrite(`${rootDir}/docs/mise-orchestra.md`, renderExplainer(config), writeOpts),
    );
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const written = results.filter((r) => r.outcome === "written").length;
  const skipped = results.filter((r) => r.outcome === "skipped").length;
  const dryRun = results.filter((r) => r.outcome === "dry-run").length;

  console.log(`\n${opts.dryRun ? "🔍" : "✅"}  Done.`);

  if (opts.dryRun) {
    console.log(
      `   ${dryRun} file(s) would be written. Re-run without --dry-run to apply.\n`,
    );
    return;
  }

  if (written > 0) {
    console.log(`   ${written} file(s) written.`);
  }
  if (skipped > 0) {
    console.log(`   ${skipped} file(s) skipped (already exist — use --force to overwrite).`);
  }

  if (written > 0) {
    console.log(
      "\n   Next: commit the Mise files, open a PR, and watch the advisory\n" +
        "   workflow run. When you trust the signal, flip mode to \"enforced\"\n" +
        "   in mise.yaml.\n",
    );
  }
}
