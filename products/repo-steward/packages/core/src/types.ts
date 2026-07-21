export type RiskLevel = "low" | "medium" | "high" | "critical";
export type AuthorizationTier = 1 | 2 | 3;
export type Certainty = "CONFIRMED" | "INFERRED" | "UNKNOWN";

export interface StewardAction {
  action: string;
  target?: string;
  risk: RiskLevel;
  destructive?: boolean;
  production?: boolean;
  changesPermissions?: boolean;
  rewritesHistory?: boolean;
}

export interface PolicyDecision {
  tier: AuthorizationTier;
  disposition: "execute" | "pull-request" | "human-approval";
  reasons: string[];
}

export interface ValidationEvidence {
  name: string;
  certainty: Certainty;
  command?: string;
  exitCode?: number;
  observedAt: string;
  summary: string;
}

export interface RepositoryInspection {
  root: string;
  packageManager: "pnpm" | "npm" | "yarn" | "unknown";
  scripts: string[];
  workflows: string[];
  securityFiles: string[];
  findings: string[];
}
