import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { safeWrite } from "../src/utils/safe-write.js";

function tmp(): string {
  return mkdtempSync(join(tmpdir(), "mise-write-"));
}

describe("safeWrite", () => {
  let dir: string;

  beforeEach(() => {
    dir = tmp();
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it("writes a new file and returns outcome 'written'", () => {
    const target = join(dir, "mise.yaml");
    const result = safeWrite(target, "content: true\n", { dryRun: false, force: false });
    expect(result.outcome).toBe("written");
    expect(existsSync(target)).toBe(true);
    expect(readFileSync(target, "utf8")).toBe("content: true\n");
  });

  it("creates intermediate directories if needed", () => {
    const target = join(dir, ".github", "workflows", "mise.yml");
    const result = safeWrite(target, "name: test\n", { dryRun: false, force: false });
    expect(result.outcome).toBe("written");
    expect(existsSync(target)).toBe(true);
  });

  it("skips an existing file when force is false", () => {
    const target = join(dir, "existing.yaml");
    writeFileSync(target, "original: true\n");
    const result = safeWrite(target, "new content\n", { dryRun: false, force: false });
    expect(result.outcome).toBe("skipped");
    // Original should be unchanged
    expect(readFileSync(target, "utf8")).toBe("original: true\n");
  });

  it("overwrites an existing file when force is true", () => {
    const target = join(dir, "existing.yaml");
    writeFileSync(target, "original: true\n");
    const result = safeWrite(target, "replaced: true\n", { dryRun: false, force: true });
    expect(result.outcome).toBe("written");
    expect(readFileSync(target, "utf8")).toBe("replaced: true\n");
  });

  it("returns 'dry-run' without writing when dryRun is true", () => {
    const target = join(dir, "would-be.yaml");
    const result = safeWrite(target, "content\n", { dryRun: true, force: false });
    expect(result.outcome).toBe("dry-run");
    expect(existsSync(target)).toBe(false);
  });

  it("dry-run takes precedence over force", () => {
    const target = join(dir, "existing.yaml");
    writeFileSync(target, "original\n");
    const result = safeWrite(target, "replacement\n", { dryRun: true, force: true });
    expect(result.outcome).toBe("dry-run");
    expect(readFileSync(target, "utf8")).toBe("original\n");
  });

  it("returns the correct path in every outcome", () => {
    const target = join(dir, "test.yaml");
    const r1 = safeWrite(target, "a", { dryRun: false, force: false });
    expect(r1.path).toBe(target);
    const r2 = safeWrite(target, "b", { dryRun: false, force: false });
    expect(r2.path).toBe(target);
    const r3 = safeWrite(join(dir, "dry.yaml"), "c", { dryRun: true, force: false });
    expect(r3.path).toBe(join(dir, "dry.yaml"));
  });
});
