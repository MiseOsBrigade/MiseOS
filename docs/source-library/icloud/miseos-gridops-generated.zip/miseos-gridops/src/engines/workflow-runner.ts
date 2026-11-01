import type { AgentRecord, TaskRecord, WorkflowRecord, EvidenceRecord } from "../types.js";
import { canAgentRunTask, scoreTaskRisk } from "./risk-engine.js";
import { routeModelForTask, estimateModelCostClass } from "./model-router.js";
import { createEvidence } from "./evidence-engine.js";

export interface WorkflowRunResult {
  taskId: string;
  agentId: string;
  workflowId: string;
  allowed: boolean;
  risk: string;
  modelId: string;
  costClass: string;
  steps: string[];
  evidence: EvidenceRecord;
}

export function runWorkflowSimulation(params: {
  task: TaskRecord;
  agent: AgentRecord;
  workflow: WorkflowRecord;
}): WorkflowRunResult {
  const { task, agent, workflow } = params;
  const decision = canAgentRunTask(agent, task);
  const modelId = routeModelForTask(task);
  const costClass = estimateModelCostClass(modelId);
  const risk = scoreTaskRisk(task);

  const evidence = createEvidence({
    taskId: task.id,
    repoId: task.repoId,
    sourceType: "human_review",
    sourcePath: "simulation",
    claim: decision.allowed
      ? `Workflow ${workflow.name} can be simulated under bounded autonomy.`
      : `Workflow ${workflow.name} is blocked before execution.`,
    certainty: decision.certainty,
    observedOutput: decision.reason,
    validator: "workflow-runner"
  });

  return {
    taskId: task.id,
    agentId: agent.id,
    workflowId: workflow.id,
    allowed: decision.allowed,
    risk,
    modelId,
    costClass,
    steps: workflow.steps,
    evidence
  };
}
