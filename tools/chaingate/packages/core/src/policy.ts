import type { PolicyDecision, SimulationResult, TransactionIntent } from "./index.js";

export type PolicyConfig = {
  allowedScopes: Set<string>;
  allowedTargets: Set<string>;
  maxValueWei: bigint;
  privilegedMethods: Set<string>;
};

export function evaluateIntent(intent: TransactionIntent, simulation: SimulationResult, config: PolicyConfig, now = new Date()): PolicyDecision {
  const reasons: string[] = [];
  if (new Date(intent.expiresAt) <= now) reasons.push("Intent expired");
  if (!config.allowedScopes.has(intent.scope)) reasons.push("Chain scope is not allowed");
  if (!config.allowedTargets.has(intent.target.toLowerCase())) reasons.push("Target is not allowlisted");
  if (BigInt(intent.valueWei) > config.maxValueWei) reasons.push("Value exceeds configured maximum");
  if (!simulation.ok) reasons.push(simulation.revertReason ?? "Simulation failed");
  if (reasons.length) return { decision: "deny", riskTier: 5, reasons };

  let riskTier: 0|1|2|3|4|5 = 2;
  if (intent.operation === "native_transfer" || intent.operation === "token_transfer") riskTier = 3;
  if (intent.method && config.privilegedMethods.has(intent.method)) riskTier = 4;
  return { decision: "allow-with-confirmation", riskTier, reasons: ["Simulation passed", "Explicit wallet approval required"] };
}
