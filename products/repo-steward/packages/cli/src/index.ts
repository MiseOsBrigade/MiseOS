#!/usr/bin/env node
import {
  aiTaxonomy,
  evaluateAction,
  inspectRepository,
  type RiskLevel
} from "@miseos/steward-core";

const RISK_LEVELS = new Set<RiskLevel>(["low", "medium", "high", "critical"]);

function flag(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseRisk(value: string | undefined): RiskLevel {
  const candidate = value ?? "low";
  if (!RISK_LEVELS.has(candidate as RiskLevel)) {
    throw new Error(`Invalid --risk value: ${candidate}. Expected low, medium, high, or critical.`);
  }
  return candidate as RiskLevel;
}

function print(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

try {
  const command = process.argv[2];
  switch (command) {
    case "inspect":
      print(inspectRepository(flag("--repo") ?? "."));
      break;
    case "evaluate":
      print(evaluateAction({ action: flag("--action") ?? "repository.read", risk: parseRisk(flag("--risk")), target: flag("--target") }));
      break;
    case "taxonomy":
      print(aiTaxonomy);
      break;
    case "plan": {
      const inspection = inspectRepository(flag("--repo") ?? ".");
      print({ dryRun: process.argv.includes("--dry-run"), inspection, proposedActions: inspection.findings.map((finding) => ({ finding, disposition: "pull-request" })) });
      break;
    }
    default:
      process.stderr.write("Usage: miseos-steward <inspect|evaluate|plan|taxonomy> [options]\n");
      process.exitCode = 1;
  }
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown CLI failure";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
