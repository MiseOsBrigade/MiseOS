import { env, splitCsv } from "./config.js";

export type GuardResult = {
  ok: boolean;
  reasons: string[];
};

function globToRegex(glob: string): RegExp {
  const escaped = glob
    .replaceAll(".", "\\.")
    .replaceAll("**", "__DOUBLE_STAR__")
    .replaceAll("*", "[^/]*")
    .replaceAll("__DOUBLE_STAR__", ".*");
  return new RegExp(`^${escaped}$`);
}

function matchesAny(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => globToRegex(pattern).test(path));
}

export function validateFilePaths(paths: string[]): GuardResult {
  const allowlist = splitCsv(env.SAFE_PATH_ALLOWLIST);
  const blocklist = splitCsv(env.SAFE_PATH_BLOCKLIST);
  const reasons: string[] = [];

  for (const path of paths) {
    if (matchesAny(path, blocklist)) {
      reasons.push(`Blocked path: ${path}`);
    }

    if (allowlist.length > 0 && !matchesAny(path, allowlist)) {
      reasons.push(`Path not in allowlist: ${path}`);
    }
  }

  return {
    ok: reasons.length === 0,
    reasons,
  };
}

export function validateAgentMode(): GuardResult {
  const reasons: string[] = [];

  if (env.AGENT_MODE === "locked") {
    reasons.push("AGENT_MODE=locked prevents agent writes.");
  }

  if (env.ALLOW_DIRECT_PUSH) {
    reasons.push("Direct push is enabled. Production posture should keep ALLOW_DIRECT_PUSH=false.");
  }

  return {
    ok: reasons.length === 0,
    reasons,
  };
}
