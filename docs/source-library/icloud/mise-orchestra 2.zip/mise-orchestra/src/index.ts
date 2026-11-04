/**
 * @goodshyt/mise-orchestra — programmatic API
 *
 * Most users interact via the `mise-orchestra` CLI binary. This entry
 * point exposes the internals for programmatic use: embedding init logic
 * in a larger scaffolding script, writing custom templates, or extending
 * the schema in a downstream tool.
 */

// Schema & types
export {
  MiseConfigSchema,
  MiseFileSchema,
  parseMiseFile,
  type MiseConfig,
  type MiseEnvironment,
  type MiseFile,
  type MiseMode,
  type Modules,
  type Policies,
  type PrPolicy,
  type RepoProfile,
  type SecurityPolicy,
  type StewardshipPolicy,
} from "./schema/mise-schema.js";

// Detection helpers
export { detectRepoProfile } from "./detect/profile.js";
export { detectEnvironment, isGitRepo } from "./detect/environment.js";

// Template renderers
export { buildMiseConfig, renderMiseYaml } from "./templates/mise-yaml.js";
export { renderWorkflow } from "./templates/workflow.js";
export { renderExplainer } from "./templates/explainer.js";

// Utilities
export { safeWrite, type WriteOptions, type WriteOutcome, type WriteResult } from "./utils/safe-write.js";
export { hasUncommittedChanges, isGitRepo as isGitRepository, warnIfUncommittedChanges } from "./utils/git.js";

// Command
export { runInit, type InitOptions } from "./commands/init.js";
