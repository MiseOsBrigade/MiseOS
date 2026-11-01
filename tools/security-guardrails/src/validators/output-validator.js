/**
 * Post-generation validator.
 * Runs after every model generation to catch policy leaks, unsafe actions,
 * or attempts by generated content to override system instructions.
 *
 * This is deliberately simple and explicit — it is NOT a substitute for
 * schema validation (see schemas/agent-output.schema.json) or for
 * least-privilege tool access. It is one layer in a layered defense.
 */

const BLOCKED_PATTERNS = [
  /ignore (all|previous|the) instructions/i,
  /reveal (the )?(system prompt|hidden prompt|instructions)/i,
  /disregard (your|the) (rules|guidelines|policy)/i,
  /act as (dan|jailbreak|unrestricted)/i,
  /(api key|password|credential|secret)\s*[:=]/i,
];

function validateOutput(output) {
  const findings = [];

  const text = typeof output === "string" ? output : JSON.stringify(output);

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      findings.push({ rule: pattern.source, severity: "high" });
    }
  }

  return {
    passed: findings.length === 0,
    findings,
  };
}

module.exports = { validateOutput, BLOCKED_PATTERNS };
