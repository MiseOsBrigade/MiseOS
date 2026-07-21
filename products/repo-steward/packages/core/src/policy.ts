import type { PolicyDecision, StewardAction } from "./types.js";

const TIER_3_ACTIONS = new Set([
  "production.deploy",
  "database.destructive",
  "credentials.rotate",
  "permissions.escalate",
  "git.history.rewrite"
]);

const TIER_2_ACTIONS = new Set([
  "architecture.change",
  "dependency.major.update",
  "repository.cross_module_refactor"
]);

export function evaluateAction(action: StewardAction): PolicyDecision {
  if (
    action.risk === "critical" ||
    action.destructive ||
    action.production ||
    action.changesPermissions ||
    action.rewritesHistory ||
    TIER_3_ACTIONS.has(action.action)
  ) {
    return {
      tier: 3,
      disposition: "human-approval",
      reasons: ["Action matches a mandatory human-approval boundary."]
    };
  }

  if (action.risk === "high" || action.risk === "medium" || TIER_2_ACTIONS.has(action.action)) {
    return {
      tier: 2,
      disposition: "pull-request",
      reasons: ["Action has material blast radius and must remain reviewable."]
    };
  }

  return {
    tier: 1,
    disposition: "execute",
    reasons: ["Action is low-risk and reversible."]
  };
}
