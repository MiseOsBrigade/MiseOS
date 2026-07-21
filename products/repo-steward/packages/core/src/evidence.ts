import type { ValidationEvidence } from "./types.js";

export function canAutoMerge(items: ValidationEvidence[]): boolean {
  const required = new Set(["lint", "typecheck", "test", "build", "secret-scan"]);
  const confirmed = new Set(
    items
      .filter((item) => item.certainty === "CONFIRMED" && item.exitCode === 0)
      .map((item) => item.name)
  );
  return [...required].every((name) => confirmed.has(name));
}
