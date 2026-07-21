import { createHash, randomUUID } from "node:crypto";
import { evaluateIntent } from "@miseos/chaingate-core";

const artifact = Buffer.from("AEON Sentinel v1.2 example");
const artifactHash = createHash("sha256").update(artifact).digest("hex");

const intent = {
  intentId: randomUUID(),
  projectId: "proof-registry",
  initiator: "mise-registry-curator",
  requestedBy: "user-example",
  scope: "eip155:84532",
  operation: "contract_write" as const,
  target: "0x0000000000000000000000000000000000000001",
  method: "registerArtifact",
  args: [`0x${artifactHash}`, "https://example.invalid/manifests/aeon.json"],
  valueWei: "0",
  nonce: randomUUID(),
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
  requiresHumanApproval: true,
  metadata: {},
};

const decision = evaluateIntent(
  intent,
  { ok: true, warnings: [] },
  {
    allowedScopes: new Set(["eip155:84532"]),
    allowedTargets: new Set([intent.target.toLowerCase()]),
    privilegedMethods: new Set(["approve", "setApprovalForAll", "upgradeTo"]),
    maxValueWei: 0n,
  },
);

console.log({ intent, decision });
