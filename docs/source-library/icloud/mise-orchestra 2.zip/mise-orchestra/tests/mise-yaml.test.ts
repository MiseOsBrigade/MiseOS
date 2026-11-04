import { describe, it, expect } from "vitest";
import { buildMiseConfig, renderMiseYaml } from "../src/templates/mise-yaml.js";
import { MiseFileSchema } from "../src/schema/mise-schema.js";
import { parse as parseYaml } from "yaml";

describe("buildMiseConfig", () => {
  it("returns a schema-valid config for every profile × environment combination", () => {
    const profiles = ["service", "library", "infra", "data", "docs"] as const;
    const environments = ["github", "gitlab", "bitbucket", "local"] as const;

    for (const profile of profiles) {
      for (const env of environments) {
        const config = buildMiseConfig(profile, env);
        expect(config.version).toBe(1);
        expect(config.mode).toBe("advisory");
        expect(config.repo_profile).toBe(profile);
        expect(config.environment).toBe(env);
      }
    }
  });

  it("always sets mode to advisory on init", () => {
    const config = buildMiseConfig("service", "github");
    expect(config.mode).toBe("advisory");
  });

  it("sets gpu module to false by default", () => {
    const config = buildMiseConfig("service", "github");
    expect(config.modules.gpu).toBe(false);
  });

  it("applies tighter max_changed_files for infra repos", () => {
    const service = buildMiseConfig("service", "github");
    const infra = buildMiseConfig("infra", "github");
    expect(infra.policies.pr.max_changed_files).toBeLessThan(
      service.policies.pr.max_changed_files,
    );
  });
});

describe("renderMiseYaml", () => {
  it("produces valid YAML that round-trips through the schema", () => {
    const config = buildMiseConfig("service", "github");
    const yaml = renderMiseYaml(config);
    const parsed = parseYaml(yaml) as unknown;
    // Should not throw
    const validated = MiseFileSchema.parse(parsed);
    expect(validated.mise.version).toBe(1);
    expect(validated.mise.mode).toBe("advisory");
    expect(validated.mise.repo_profile).toBe("service");
  });

  it("includes a header comment explaining advisory mode", () => {
    const config = buildMiseConfig("library", "github");
    const yaml = renderMiseYaml(config);
    expect(yaml).toContain("advisory");
    expect(yaml).toContain("never overwrite");
  });

  it("renders empty arrays as []", () => {
    const config = buildMiseConfig("docs", "github");
    const yaml = renderMiseYaml(config);
    // docs profile has no require_tests paths
    expect(yaml).toContain("require_tests_when_paths_match: []");
  });

  it("renders non-empty arrays as block sequences", () => {
    const config = buildMiseConfig("service", "github");
    const yaml = renderMiseYaml(config);
    expect(yaml).toContain("- \"src/**\"");
  });

  it("sets the repo_profile correctly for each profile", () => {
    const profiles = ["service", "library", "infra", "data", "docs"] as const;
    for (const p of profiles) {
      const yaml = renderMiseYaml(buildMiseConfig(p, "github"));
      expect(yaml).toContain(`repo_profile: ${p}`);
    }
  });
});
