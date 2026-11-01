import agents from "../data/agents.registry.json" assert { type: "json" };
import workflows from "../data/workflows.registry.json" assert { type: "json" };
import seed from "../data/demo.seed.json" assert { type: "json" };
import { runWorkflowSimulation } from "../engines/workflow-runner.js";
import { formatEvidenceCard } from "../engines/evidence-engine.js";
import type { AgentRecord, TaskRecord, WorkflowRecord } from "../types.js";

const task = seed.tasks[0] as TaskRecord;
const agent = (agents as AgentRecord[]).find((entry) => entry.id === task.assignedAgentId);
const workflow = (workflows as WorkflowRecord[]).find((entry) => entry.id === "workflow_ci_repair");

if (!agent || !workflow) {
  throw new Error("Demo setup failed: missing agent or workflow");
}

const result = runWorkflowSimulation({ task, agent, workflow });

console.log("");
console.log("MiseOS GridOps Demo Run");
console.log("=======================");
console.log(`Task: ${task.title}`);
console.log(`Agent: ${agent.name}`);
console.log(`Workflow: ${workflow.name}`);
console.log(`Allowed: ${result.allowed}`);
console.log(`Risk: ${result.risk}`);
console.log(`Model Route: ${result.modelId} (${result.costClass})`);
console.log("");
console.log("Steps:");
for (const [index, step] of result.steps.entries()) {
  console.log(`${index + 1}. ${step}`);
}
console.log("");
console.log(formatEvidenceCard(result.evidence));
console.log("");
