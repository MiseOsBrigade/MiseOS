import { describe, expect, it } from "vitest";
import { health } from "../src/index.js";

describe("health", () => {
  it("returns a bootstrapped health object", () => {
    expect(health()).toEqual({
      ok: true,
      service: "self-unzip-expanded-app",
      bootstrapped: true
    });
  });
});
