import { describe, expect, it } from "vitest";
import { canAutoMerge } from "./evidence.js";
import type { ValidationEvidence } from "./types.js";

function result(
  name: string,
  observedAt: string,
  exitCode: number,
  certainty: ValidationEvidence["certainty"] = "CONFIRMED"
): ValidationEvidence {
  return { name, observedAt, exitCode, certainty, summary: "test fixture" };
}

const base = [
  result("lint", "2026-07-22T00:00:00Z", 0),
  result("typecheck", "2026-07-22T00:00:00Z", 0),
  result("test", "2026-07-22T00:00:00Z", 0),
  result("build", "2026-07-22T00:00:00Z", 0),
  result("secret-scan", "2026-07-22T00:00:00Z", 0)
];

describe("canAutoMerge", () => {
  it("accepts confirmed successful latest results", () => {
    expect(canAutoMerge(base)).toBe(true);
  });

  it("rejects a newer failed rerun", () => {
    expect(
      canAutoMerge([
        ...base,
        result("test", "2026-07-22T00:01:00Z", 1)
      ])
    ).toBe(false);
  });

  it("rejects inferred evidence", () => {
    expect(
      canAutoMerge([
        ...base.filter((item) => item.name !== "build"),
        result("build", "2026-07-22T00:01:00Z", 0, "INFERRED")
      ])
    ).toBe(false);
  });
});
