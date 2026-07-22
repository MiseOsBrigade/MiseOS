import { describe, expect, it } from "vitest";
import { evaluateAction } from "./policy.js";

describe("evaluateAction", () => {
  it("permits explicitly allowlisted low-risk actions", () => {
    expect(evaluateAction({ action: "repository.read", risk: "low" })).toMatchObject({
      tier: 1,
      disposition: "execute"
    });
  });

  it("routes medium risk to a pull request", () => {
    expect(
      evaluateAction({ action: "repository.file.update", risk: "medium" })
    ).toMatchObject({ tier: 2, disposition: "pull-request" });
  });

  it("requires approval for history rewriting", () => {
    expect(
      evaluateAction({
        action: "git.history.rewrite",
        risk: "high",
        rewritesHistory: true
      })
    ).toMatchObject({ tier: 3, disposition: "human-approval" });
  });

  it("fails closed for unknown action names", () => {
    expect(evaluateAction({ action: "database.drop", risk: "low" })).toMatchObject({
      tier: 3,
      disposition: "human-approval"
    });
  });
});
