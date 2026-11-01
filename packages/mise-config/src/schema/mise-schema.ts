import { z } from "zod";

/**
 * Schema for mise.yaml — the single config file a repo gets when it joins
 * the Mise DevOps Orchestra. Every field has a safe default so a freshly
 * generated file validates and behaves predictably even if a human edits
 * it by hand afterward.
 */

export const MiseMode = z.enum(["advisory", "enforced"]);
export type MiseMode = z.infer<typeof MiseMode>;

export const MiseEnvironment = z.enum(["github", "gitlab", "bitbucket", "local"]);
export type MiseEnvironment = z.infer<typeof MiseEnvironment>;

export const RepoProfile = z.enum(["service", "library", "infra", "data", "docs"]);
export type RepoProfile = z.infer<typeof RepoProfile>;

const PrPolicySchema = z
  .object({
    enabled: z.boolean().default(true),
    max_changed_files: z.number().int().positive().default(50),
    max_lines_changed: z.number().int().positive().default(800),
    require_tests_when_paths_match: z.array(z.string()).default([]),
    risky_paths: z.array(z.string()).default([]),
  })
  .strict();

const StewardshipPolicySchema = z
  .object({
    enabled: z.boolean().default(true),
    stale_branch_days: z.number().int().positive().default(30),
    auto_cleanup: z.boolean().default(false),
    require_reviewers: z.number().int().nonnegative().default(1),
  })
  .strict();

const SecurityPolicySchema = z
  .object({
    enabled: z.boolean().default(true),
    require_signed_commits: z.boolean().default(false),
    block_force_push_to_default: z.boolean().default(true),
  })
  .strict();

export const PoliciesSchema = z
  .object({
    pr: PrPolicySchema,
    stewardship: StewardshipPolicySchema,
    security: SecurityPolicySchema,
  })
  .strict();

export const ModulesSchema = z
  .object({
    pr: z.boolean().default(true),
    brigade: z.boolean().default(true),
    salt_shakers: z.boolean().default(true),
    locker: z.boolean().default(true),
    gpu: z.boolean().default(false),
  })
  .strict();

export const MiseConfigSchema = z
  .object({
    version: z.literal(1).default(1),
    /**
     * `init` always writes "advisory". There is intentionally no CLI flag
     * to set this to "enforced" — that is a deliberate, separate, manual
     * edit a team makes once they trust the signal.
     */
    mode: MiseMode.default("advisory"),
    environment: MiseEnvironment.default("github"),
    repo_profile: RepoProfile.default("service"),
    policies: PoliciesSchema,
    modules: ModulesSchema,
  })
  .strict();

export const MiseFileSchema = z
  .object({
    mise: MiseConfigSchema,
  })
  .strict();

export type PrPolicy = z.infer<typeof PrPolicySchema>;
export type StewardshipPolicy = z.infer<typeof StewardshipPolicySchema>;
export type SecurityPolicy = z.infer<typeof SecurityPolicySchema>;
export type Policies = z.infer<typeof PoliciesSchema>;
export type Modules = z.infer<typeof ModulesSchema>;
export type MiseConfig = z.infer<typeof MiseConfigSchema>;
export type MiseFile = z.infer<typeof MiseFileSchema>;

/** Parses and validates an already-loaded plain object against the schema. */
export function parseMiseFile(data: unknown): MiseFile {
  return MiseFileSchema.parse(data);
}
