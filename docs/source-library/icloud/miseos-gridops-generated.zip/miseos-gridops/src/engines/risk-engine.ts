import type { AgentRecord, TaskRecord, AgentDecision } from "../types.js";

const tier3Keywords = [
  "force push",
  "rewrite history",
  "delete repo",
  "rotate credential",
  "disable ci",
  "production deploy",
  "billing"
];

export function scoreTaskRisk(task: TaskRecord): "low" | "medium" | "high" | "blocked" {
  const text = `${task.title} ${task.taskType}`.toLowerCase();
  if (tier3Keywords.some((keyword) => text.includes(keyword))) return "blocked";
  if (task.taskType === "security" || task.taskType === "release") return "high";
  if (task.taskType === "ci" || task.taskType === "package") return "medium";
  return "low";
}

export function canAgentRunTask(agent: AgentRecord, task: TaskRecord): AgentDecision {
  const risk = scoreTaskRisk(task);

  if (risk === "blocked") {
    return {
      allowed: false,
      reason: "Task appears to require Tier 3 approval or a destructive action.",
      requiredApproval: true,
      certainty: "CONFIRMED"
    };
  }

  if (task.approvalRequired && agent.permissionTier !== "view_only") {
    return {
      allowed: true,
      reason: "Agent may prepare or open a PR, but human approval is required before risky execution.",
      requiredApproval: true,
      certainty: "CONFIRMED"
    };
  }

  return {
    allowed: true,
    reason: "Task is within bounded autonomy rules.",
    requiredApproval: false,
    certainty: "CONFIRMED"
  };
}
