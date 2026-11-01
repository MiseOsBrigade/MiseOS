import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL_PRIMARY: z.string().default("gpt-5.5-thinking"),

  PORT: z.coerce.number().default(8787),
  INTERNAL_API_SECRET: z.string().min(20),

  GITHUB_APP_ID: z.coerce.number(),
  GITHUB_APP_INSTALLATION_ID: z.coerce.number(),
  GITHUB_APP_PRIVATE_KEY_B64: z.string().min(1),
  GITHUB_WEBHOOK_SECRET: z.string().min(20),

  GITHUB_OWNER: z.string().min(1),
  GITHUB_REPO: z.string().min(1),
  GITHUB_DEFAULT_BRANCH: z.string().default("main"),

  AGENT_MODE: z.enum(["advisory", "assisted", "autonomous", "locked"]).default("advisory"),
  CREATE_PR_BY_DEFAULT: z.coerce.boolean().default(true),
  ALLOW_DIRECT_PUSH: z.coerce.boolean().default(false),
  REQUIRE_HUMAN_APPROVAL: z.coerce.boolean().default(true),
  DRY_RUN: z.coerce.boolean().default(true),

  AGENT_BRANCH_PREFIX: z.string().default("agent/"),
  AGENT_COMMIT_AUTHOR_NAME: z.string().default("MiseOS Agent"),
  AGENT_COMMIT_AUTHOR_EMAIL: z.string().email().default("agent@miseos.dev"),

  MAX_FILES_PER_RUN: z.coerce.number().default(25),
  MAX_LINES_CHANGED_PER_RUN: z.coerce.number().default(3000),

  SAFE_PATH_ALLOWLIST: z.string().default("README.md,docs/**,src/**"),
  SAFE_PATH_BLOCKLIST: z.string().default(".env,*.pem,*.key,node_modules/**,dist/**"),

  MORAL_GOVERNANCE_ENABLED: z.coerce.boolean().default(true),
  ECTI_MIN_SCORE: z.coerce.number().default(0.75),
  CSM_MIN_SCORE: z.coerce.number().default(0.7),
  STL_MAX_SCORE: z.coerce.number().default(0.25),
  KAQ_MIN_SCORE: z.coerce.number().default(0.7),

  AGENT_SIGNATURE_LINE: z.string().default(
    "Every agent has a role. Every role has purpose. Every repo deserves stewardship."
  ),
});

export const env = EnvSchema.parse(process.env);

export function getGithubPrivateKey(): string {
  return Buffer.from(env.GITHUB_APP_PRIVATE_KEY_B64, "base64").toString("utf8");
}

export function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
