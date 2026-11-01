#!/usr/bin/env node

import { Command } from "commander";
import { runInit } from "./commands/init.js";
import type { MiseEnvironment, RepoProfile } from "./schema/mise-schema.js";

const PROFILES = ["service", "library", "infra", "data", "docs"] as const;
const ENVIRONMENTS = ["github", "gitlab", "bitbucket", "local"] as const;

const program = new Command();

program
  .name("mise-orchestra")
  .description("Mise DevOps Orchestra — Everything in its place, before it hits production.")
  .version("0.1.0", "-v, --version");

program
  .command("init")
  .description(
    "Scaffold Mise DevOps Orchestra config into the current repository.\n" +
      "Writes mise.yaml and (when on GitHub) a GitHub Actions advisory workflow.\n" +
      "Never overwrites existing files unless --force is supplied.",
  )
  .option(
    "--profile <profile>",
    `Repo profile (${PROFILES.join(" | ")}). Auto-detected when omitted.`,
  )
  .option(
    "--environment <environment>",
    `Target CI environment (${ENVIRONMENTS.join(" | ")}). Auto-detected from .git/config when omitted.`,
  )
  .option("--force", "Overwrite files that already exist.", false)
  .option(
    "--dry-run",
    "Preview what would be written without touching the filesystem.",
    false,
  )
  .option(
    "--with-docs",
    "Also write docs/mise-orchestra.md — a human-readable orientation guide.",
    false,
  )
  .action(
    async (opts: {
      profile?: string;
      environment?: string;
      force: boolean;
      dryRun: boolean;
      withDocs: boolean;
    }) => {
      // Validate explicit flags before handing off to the command.
      if (opts.profile !== undefined && !(PROFILES as readonly string[]).includes(opts.profile)) {
        console.error(`Error: --profile must be one of: ${PROFILES.join(", ")}`);
        process.exit(1);
      }
      if (
        opts.environment !== undefined &&
        !(ENVIRONMENTS as readonly string[]).includes(opts.environment)
      ) {
        console.error(`Error: --environment must be one of: ${ENVIRONMENTS.join(", ")}`);
        process.exit(1);
      }

      await runInit({
        ...(opts.profile !== undefined && { profile: opts.profile as RepoProfile }),
        ...(opts.environment !== undefined && { environment: opts.environment as MiseEnvironment }),
        force: opts.force,
        dryRun: opts.dryRun,
        withDocs: opts.withDocs,
      });
    },
  );

program.parse(process.argv);
