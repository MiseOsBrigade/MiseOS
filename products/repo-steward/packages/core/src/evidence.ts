import type { ValidationEvidence } from "./types.js";

const REQUIRED_CHECKS = ["lint", "typecheck", "test", "build", "secret-scan"] as const;

function timestamp(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
}

export function canAutoMerge(items: ValidationEvidence[]): boolean {
  const latest = new Map<string, ValidationEvidence>();

  for (const item of items) {
    const current = latest.get(item.name);
    if (!current || timestamp(item.observedAt) >= timestamp(current.observedAt)) {
      latest.set(item.name, item);
    }
  }

  return REQUIRED_CHECKS.every((name) => {
    const item = latest.get(name);
    return item?.certainty === "CONFIRMED" && item.exitCode === 0;
  });
}
