import type { TaskRecord } from "../types.js";

export function routeModelForTask(task: TaskRecord): string {
  switch (task.taskType) {
    case "ci":
      return "model_reasoning_premium";
    case "security":
      return "model_classifier";
    case "package":
      return "model_reasoning_premium";
    case "docs":
      return "model_coding_standard";
    case "release":
      return "model_reasoning_premium";
    case "memory":
      return "model_embedding";
    default:
      return "model_slm_triage";
  }
}

export function estimateModelCostClass(modelId: string): "cheap" | "standard" | "premium" {
  if (modelId.includes("premium") || modelId.includes("vision")) return "premium";
  if (modelId.includes("slm") || modelId.includes("embedding") || modelId.includes("classifier")) return "cheap";
  return "standard";
}
