import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, rmSync, mkdtempSync } from "node:fs";
import { join, sep } from "node:path";
import { tmpdir } from "node:os";
import { detectRepoProfile } from "../src/detect/profile.js";

function tmp(): string {
  return mkdtempSync(join(tmpdir(), "mise-profile-"));
}

function touch(dir: string, ...parts: string[]): void {
  const full = join(dir, ...parts);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, "");
}

describe("detectRepoProfile", () => {
  let dir: string;

  beforeEach(() => {
    dir = tmp();
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("returns 'service' when Dockerfile is present", () => {
    touch(dir, "Dockerfile");
    expect(detectRepoProfile(dir)).toBe("service");
  });

  it("returns 'service' when docker-compose.yml is present", () => {
    touch(dir, "docker-compose.yml");
    expect(detectRepoProfile(dir)).toBe("service");
  });

  it("returns 'library' for a publishable scoped package", () => {
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ name: "@goodshyt/tool", main: "./dist/index.js" }),
    );
    expect(detectRepoProfile(dir)).toBe("library");
  });

  it("returns 'service' for a private package with a start script", () => {
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ private: true, scripts: { start: "node dist/server.js" } }),
    );
    expect(detectRepoProfile(dir)).toBe("service");
  });

  it("returns 'infra' when a .tf file is present", () => {
    touch(dir, "main.tf");
    expect(detectRepoProfile(dir)).toBe("infra");
  });

  it("returns 'infra' when Chart.yaml is present", () => {
    touch(dir, "Chart.yaml");
    expect(detectRepoProfile(dir)).toBe("infra");
  });

  it("returns 'data' when a .ipynb file is present", () => {
    touch(dir, "analysis.ipynb");
    expect(detectRepoProfile(dir)).toBe("data");
  });

  it("returns 'data' when dbt_project.yml is present", () => {
    touch(dir, "dbt_project.yml");
    expect(detectRepoProfile(dir)).toBe("data");
  });

  it("returns 'docs' when mkdocs.yml is present", () => {
    touch(dir, "mkdocs.yml");
    expect(detectRepoProfile(dir)).toBe("docs");
  });

  it("returns 'docs' when docusaurus.config.js is present", () => {
    touch(dir, "docusaurus.config.js");
    expect(detectRepoProfile(dir)).toBe("docs");
  });

  it("falls back to 'service' on an empty directory", () => {
    expect(detectRepoProfile(dir)).toBe("service");
  });

  it("falls back to 'service' on a completely unknown repo", () => {
    touch(dir, "README.md");
    touch(dir, "some-random-file.txt");
    expect(detectRepoProfile(dir)).toBe("service");
  });
});
