import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { parse as parseYaml } from "yaml";
import { runInit } from "../src/commands/init.js";
import { MiseFileSchema } from "../src/schema/mise-schema.js";

function tmp(): string {
  return mkdtempSync(join(tmpdir(), "mise-init-"));
}

describe("runInit", () => {
  let dir: string;

  beforeEach(() => {
    dir = tmp();
    // Suppress console output during tests
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it("writes mise.yaml into the target directory", async () => {
    await runInit({ force: false, dryRun: false, withDocs: false, cwd: dir });
    expect(existsSync(join(dir, "mise.yaml"))).toBe(true);
  });

  it("produces schema-valid YAML", async () => {
    await runInit({
      profile: "service",
      environment: "github",
      force: false,
      dryRun: false,
      withDocs: false,
      cwd: dir,
    });
    const raw = readFileSync(join(dir, "mise.yaml"), "utf8");
    const parsed = parseYaml(raw) as unknown;
    const validated = MiseFileSchema.parse(parsed);
    expect(validated.mise.mode).toBe("advisory");
    expect(validated.mise.repo_profile).toBe("service");
    expect(validated.mise.environment).toBe("github");
  });

  it("writes the GitHub Actions workflow when environment is github", async () => {
    await runInit({
      profile: "service",
      environment: "github",
      force: false,
      dryRun: false,
      withDocs: false,
      cwd: dir,
    });
    const wfPath = join(dir, ".github", "workflows", "mise-orchestra.yml");
    expect(existsSync(wfPath)).toBe(true);
    const content = readFileSync(wfPath, "utf8");
    expect(content).toContain("actions/checkout@v6");
    expect(content).toContain("advisory");
  });

  it("skips GitHub Actions workflow for non-github environments", async () => {
    await runInit({
      profile: "service",
      environment: "gitlab",
      force: false,
      dryRun: false,
      withDocs: false,
      cwd: dir,
    });
    const wfPath = join(dir, ".github", "workflows", "mise-orchestra.yml");
    expect(existsSync(wfPath)).toBe(false);
  });

  it("writes docs/mise-orchestra.md when --with-docs is set", async () => {
    await runInit({
      profile: "service",
      environment: "github",
      force: false,
      dryRun: false,
      withDocs: true,
      cwd: dir,
    });
    const docsPath = join(dir, "docs", "mise-orchestra.md");
    expect(existsSync(docsPath)).toBe(true);
    const content = readFileSync(docsPath, "utf8");
    expect(content).toContain("Mise DevOps Orchestra");
    expect(content).toContain("advisory");
  });

  it("does not write docs/mise-orchestra.md by default", async () => {
    await runInit({
      force: false,
      dryRun: false,
      withDocs: false,
      cwd: dir,
    });
    expect(existsSync(join(dir, "docs", "mise-orchestra.md"))).toBe(false);
  });

  it("dry-run writes nothing to disk", async () => {
    await runInit({
      profile: "service",
      environment: "github",
      force: false,
      dryRun: true,
      withDocs: true,
      cwd: dir,
    });
    expect(existsSync(join(dir, "mise.yaml"))).toBe(false);
    expect(existsSync(join(dir, ".github", "workflows", "mise-orchestra.yml"))).toBe(false);
    expect(existsSync(join(dir, "docs", "mise-orchestra.md"))).toBe(false);
  });

  it("skips existing files without --force", async () => {
    // First init
    await runInit({
      profile: "service",
      environment: "github",
      force: false,
      dryRun: false,
      withDocs: false,
      cwd: dir,
    });
    const yaml1 = readFileSync(join(dir, "mise.yaml"), "utf8");

    // Second init with a different profile — should not overwrite
    await runInit({
      profile: "library",
      environment: "github",
      force: false,
      dryRun: false,
      withDocs: false,
      cwd: dir,
    });
    const yaml2 = readFileSync(join(dir, "mise.yaml"), "utf8");
    expect(yaml1).toBe(yaml2);
  });

  it("overwrites existing files when --force is set", async () => {
    await runInit({
      profile: "service",
      environment: "github",
      force: false,
      dryRun: false,
      withDocs: false,
      cwd: dir,
    });
    const yaml1 = readFileSync(join(dir, "mise.yaml"), "utf8");

    await runInit({
      profile: "library",
      environment: "github",
      force: true,
      dryRun: false,
      withDocs: false,
      cwd: dir,
    });
    const yaml2 = readFileSync(join(dir, "mise.yaml"), "utf8");
    expect(yaml2).toContain("repo_profile: library");
    expect(yaml1).not.toBe(yaml2);
  });

  it("accepts explicit profile and environment flags", async () => {
    await runInit({
      profile: "infra",
      environment: "github",
      force: false,
      dryRun: false,
      withDocs: false,
      cwd: dir,
    });
    const yaml = readFileSync(join(dir, "mise.yaml"), "utf8");
    expect(yaml).toContain("repo_profile: infra");
  });
});
