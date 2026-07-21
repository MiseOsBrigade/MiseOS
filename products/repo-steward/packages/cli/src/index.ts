#!/usr/bin/env node
import { aiTaxonomy, evaluateAction, inspectRepository, type RiskLevel } from "@miseos/steward-core";

function flag(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const command = process.argv[2];
const print = (value: unknown): void => process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);

switch (command) {
  case "inspect": print(inspectRepository(flag("--repo") ?? ".")); break;
  case "evaluate": print(evaluateAction({ action: flag("--action") ?? "repository.read", risk: (flag("--risk") ?? "low") as RiskLevel, target: flag("--target") })); break;
  case "taxonomy": print(aiTaxonomy); break;
  case "plan": {
    const inspection = inspectRepository(flag("--repo") ?? ".");
    print({ dryRun: process.argv.includes("--dry-run"), inspection, proposedActions: inspection.findings.map((finding) => ({ finding, disposition: "pull-request" })) });
    break;
  }
  default:
    process.stderr.write("Usage: miseos-steward <inspect|evaluate|plan|taxonomy> [options]\n");
    process.exitCode = 1;
}
