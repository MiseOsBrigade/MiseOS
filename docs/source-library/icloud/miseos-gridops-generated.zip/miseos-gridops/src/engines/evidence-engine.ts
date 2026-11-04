import type { Certainty, EvidenceRecord } from "../types.js";

export function createEvidence(input: Omit<EvidenceRecord, "id">): EvidenceRecord {
  return {
    id: `evidence_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    ...input
  };
}

export function certaintyFromObservedOutput(output: string | undefined): Certainty {
  if (!output || output.trim().length === 0) return "UNKNOWN";
  if (/exit code 0|passed|success|succeeded|completed/i.test(output)) return "CONFIRMED";
  if (/appears|likely|probably|inferred/i.test(output)) return "INFERRED";
  return "CONFIRMED";
}

export function formatEvidenceCard(evidence: EvidenceRecord): string {
  return [
    "Evidence Card",
    "-------------",
    `Claim: ${evidence.claim}`,
    `Certainty: ${evidence.certainty}`,
    `Source: ${evidence.sourceType} :: ${evidence.sourcePath ?? "n/a"}`,
    `Validator: ${evidence.validator}`,
    `Observed Output: ${evidence.observedOutput ?? "UNKNOWN — no observed output attached"}`
  ].join("\n");
}
