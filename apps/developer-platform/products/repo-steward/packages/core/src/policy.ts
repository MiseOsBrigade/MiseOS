import type { PolicyDecision, StewardAction } from "./types.js";

const TIER_1_ACTIONS = new Set([
  "repository.read",
  "repository.inspect",
  "repository.branch.create",
  "repository.pull_request.create",
  "repository.file.update",
  "validation.execute",
  "format.apply",
  "lint.fix",
  "imports.fix",
  "gitignore.update",
  "environment.example.create",
  "dependency.patch.update",
  "dependency.minor.update"
]);

const TIER_2_ACTIONS = new Set([
  "architecture.change",
  "dependency.major.update",
  "repository.cross_module_refactor"
]);

const TIER_3_ACTIONS = new Set([
  "production.deploy",
  "database.destructive",
  "credentials.rotate",
  "permissions.escalate",
  "git.history.rewrite"
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

  if (!TIER_1_ACTIONS.has(action.action) && !TIER_2_ACTIONS.has(action.action)) {
    return {
      tier: 3,
      disposition: "human-approval",
      reasons: ["Unrecognized actions fail closed and require explicit human approval."]
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
    reasons: ["Action is explicitly allowlisted, low-risk, and reversible."]
  };
}
