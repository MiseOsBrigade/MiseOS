import { PermissionRequest, BaseRule } from "./types";

export interface MatrixMetricInput {
  permissionBreadth: number;       // 0..1
  valueExposure: number;           // 0..1
  timeExposure: number;            // 0..1
  targetTrust: number;             // 0..1, higher is safer
  domainReputation: number;        // 0..1, higher is safer
  userFamiliarity: number;         // 0..1, higher is safer
  humanApprovalRequired: boolean;
}

export interface MatrixMetricResult {
  score: number;                   // 0..1, higher is riskier
  band: "low" | "medium" | "high" | "critical";
  requiresHumanApproval: boolean;
  reasons: string[];
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function hasRule(rules: BaseRule[] | undefined, type: string): boolean {
  return Boolean(rules?.some((rule) => rule.type === type));
}

function expiryTimeRisk(rules: BaseRule[] | undefined): number {
  const expiry = rules?.find((rule) => rule.type === "expiry");
  const timestamp = Number(expiry?.data?.timestamp ?? 0);
  if (!timestamp) return 1.0;
  const seconds = timestamp - Math.floor(Date.now() / 1000);
  if (seconds <= 0) return 1.0;
  if (seconds <= 3600) return 0.15;
  if (seconds <= 86400) return 0.35;
  if (seconds <= 604800) return 0.65;
  return 0.9;
}

function domainScore(verdict?: string): number {
  switch (verdict) {
    case "safe": return 1.0;
    case "unknown": return 0.6;
    case "suspicious": return 0.2;
    case "malicious": return 0.0;
    default: return 0.5;
  }
}

export function deriveMetricInput(request: PermissionRequest): MatrixMetricInput {
  const rules = request.rules ?? [];
  const permissionType = request.permission.type;

  const broadPermission =
    permissionType.includes("allowance") && !hasRule(rules, "allowed-targets")
      ? 0.9
      : permissionType.includes("season-drop")
        ? 0.35
        : 0.55;

  const valueExposure = permissionType.includes("native") || permissionType.includes("erc20")
    ? 0.75
    : 0.45;

  return {
    permissionBreadth: broadPermission,
    valueExposure,
    timeExposure: expiryTimeRisk(rules),
    targetTrust: hasRule(rules, "allowed-targets") ? 0.85 : 0.45,
    domainReputation: domainScore(request.dapp?.domainVerdict),
    userFamiliarity: 0.5,
    humanApprovalRequired: hasRule(rules, "human-approval-required"),
  };
}

/**
 * Personalized matrix metric:
 *
 * risk = W · x, where x contains exposure values and inverted trust values.
 * This is intentionally conservative. High trust lowers risk. Missing expiry,
 * broad target scope, and non-safe domain verdict raise risk.
 */
export function scoreMatrixMetric(input: MatrixMetricInput): MatrixMetricResult {
  const x = [
    clamp01(input.permissionBreadth),
    clamp01(input.valueExposure),
    clamp01(input.timeExposure),
    1 - clamp01(input.targetTrust),
    1 - clamp01(input.domainReputation),
    1 - clamp01(input.userFamiliarity),
  ];

  const weights = [0.24, 0.22, 0.18, 0.14, 0.14, 0.08];
  const score = clamp01(x.reduce((sum, value, i) => sum + value * weights[i], 0));

  const reasons: string[] = [];
  if (input.permissionBreadth > 0.7) reasons.push("permission is broad");
  if (input.valueExposure > 0.7) reasons.push("value exposure is material");
  if (input.timeExposure > 0.7) reasons.push("expiry window is long or missing");
  if (input.domainReputation < 0.5) reasons.push("domain reputation is weak");
  if (input.humanApprovalRequired) reasons.push("rule explicitly requires human approval");

  const band =
    score >= 0.82 ? "critical" :
    score >= 0.62 ? "high" :
    score >= 0.36 ? "medium" :
    "low";

  return {
    score,
    band,
    requiresHumanApproval: input.humanApprovalRequired || score >= 0.62,
    reasons,
  };
}

export function scorePermissionRequest(request: PermissionRequest): MatrixMetricResult {
  return scoreMatrixMetric(deriveMetricInput(request));
}
