export type Certainty = "CONFIRMED" | "INFERRED" | "UNKNOWN";
export type RiskLevel = "low" | "medium" | "high" | "blocked" | "unknown";
export type PermissionTier = "view_only" | "suggest_only" | "pr_only" | "safe_write" | "release_assist" | "blocked_admin";

export interface RepoRecord {
  id: string;
  owner: string;
  name: string;
  url: string;
  primaryLanguage?: string;
  framework?: string;
  packageManager?: string;
  ciProvider?: string;
  healthScore: number;
  riskLevel: RiskLevel;
  status: "active" | "paused" | "archived" | "broken";
}

export interface AgentRecord {
  id: string;
  name: string;
  role: string;
  modelType: string;
  permissionTier: PermissionTier;
  memoryScope: "repo" | "workspace" | "global";
  costClass: "cheap" | "standard" | "premium";
  allowedTools: string[];
  blockedActions: string[];
  status: "available" | "idle" | "running" | "waiting" | "blocked" | "disabled";
}

export interface ToolRecord {
  id: string;
  name: string;
  category: string;
  authType: string;
  readAllowed: boolean;
  writeAllowed: boolean;
  riskLevel: RiskLevel;
  safeActions: string[];
  blockedActions: string[];
}

export interface WorkflowRecord {
  id: string;
  name: string;
  trigger: string[];
  assignedAgent: string;
  riskTier: string;
  approvalRequired: boolean;
  steps: string[];
  outputs: string[];
}

export interface TaskRecord {
  id: string;
  repoId: string;
  title: string;
  taskType: "ci" | "docs" | "security" | "package" | "refactor" | "release" | "memory";
  priority: "P0" | "P1" | "P2" | "P3";
  status: "backlog" | "ready" | "running" | "blocked" | "done";
  assignedAgentId: string;
  approvalRequired: boolean;
  validationRequired: string[];
}

export interface EvidenceRecord {
  id: string;
  taskId: string;
  repoId: string;
  sourceType: "command" | "file" | "test" | "build" | "log" | "api" | "human_review";
  sourcePath?: string;
  claim: string;
  certainty: Certainty;
  observedOutput?: string;
  validator: string;
}

export interface ModelRoute {
  taskType: string;
  preferredModelType: string;
  fallbackModelType?: string;
  maxCost?: number;
  maxLatencyMs?: number;
  requiresCitation: boolean;
  requiresHumanApproval: boolean;
}

export interface AgentDecision {
  allowed: boolean;
  reason: string;
  requiredApproval: boolean;
  certainty: Certainty;
}
