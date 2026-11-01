import { env } from "./config.js";

export type GovernanceScore = {
  ecti: number;
  csm: number;
  stl: number;
  kaq: number;
  passed: boolean;
  summary: string;
};

export function evaluateGovernance(params: {
  task: string;
  changedPaths: string[];
}): GovernanceScore {
  // Deterministic placeholder evaluator.
  // Replace this with an LLM- or policy-backed evaluator when ready.
  const task = params.task.toLowerCase();

  const score: GovernanceScore = {
    ecti: task.includes("delete") || task.includes("secret") ? 0.62 : 0.86,
    csm: task.includes("exploit") ? 0.55 : 0.82,
    stl: task.includes("direct push") ? 0.4 : 0.15,
    kaq: params.changedPaths.some((path) => path.includes("docs/")) ? 0.86 : 0.72,
    passed: false,
    summary: "",
  };

  score.passed =
    score.ecti >= env.ECTI_MIN_SCORE &&
    score.csm >= env.CSM_MIN_SCORE &&
    score.stl <= env.STL_MAX_SCORE &&
    score.kaq >= env.KAQ_MIN_SCORE;

  score.summary = score.passed
    ? "Governance gate passed."
    : "Governance gate failed. Human review required before execution.";

  return score;
}
