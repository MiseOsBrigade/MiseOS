import fs from "node:fs";

const path = ".miseos/security-policy.json";
const policy = JSON.parse(fs.readFileSync(path, "utf8"));

const required = [
  [policy.schema === "miseos.security-policy/v1", "schema"],
  [policy.status === "candidate", "status"],
  [policy.verification?.indeterminateIsNotAllow === true, "indeterminateIsNotAllow"],
  [Array.isArray(policy.verification?.requiredDomains), "requiredDomains"],
  [policy.trustAnchors?.artifactSuppliedKeysAreTrusted === false, "artifactSuppliedKeysAreTrusted"],
  [policy.trustAnchors?.externalKeyRegistryRequired === true, "externalKeyRegistryRequired"],
  [policy.trustAnchors?.unknownRegistryStatus === "indeterminate", "unknownRegistryStatus"],
  [policy.replay?.requireNonce === true, "requireNonce"],
  [policy.replay?.requireActionId === true, "requireActionId"],
  [policy.replay?.requireAudience === true, "requireAudience"],
  [policy.temporal?.requireStrictInstantParsing === true, "requireStrictInstantParsing"],
  [policy.provenance?.selfAssertedClaimsRemainUnverified === true, "selfAssertedClaimsRemainUnverified"],
  [policy.provenance?.semanticCorrectnessImpliedByIntegrity === false, "semanticCorrectnessImpliedByIntegrity"],
];

const failures = required.filter(([ok]) => !ok).map(([, name]) => name);
if (failures.length) {
  console.error(`Security policy validation failed: ${failures.join(", ")}`);
  process.exit(1);
}

console.log("Security policy validation passed.");
