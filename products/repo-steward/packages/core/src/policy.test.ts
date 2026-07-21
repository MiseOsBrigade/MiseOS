import { describe, expect, it } from "vitest";
import { evaluateAction } from "./policy.js";

describe("evaluateAction", () => {
  it("permits low-risk actions", () => {
    expect(evaluateAction({ action: "repository.read", risk: "low" }).tier).toBe(1);
  });

  it("routes medium risk to PR", () => {
    expect(evaluateAction({ action: "repository.file.update", risk: "medium" }).tier).toBe(2);
  });

  it("requires approval for history rewrite", () => {
    expect(evaluateAction({ action: "git.history.rewrite", risk: "high", rewritesHistory: true }).tier).toBe(3);
  });
});
