import { describe, expect, it } from "vitest";
import { evaluateIntent } from "../src/policy.js";

const intent = { intentId:"9f0f01cf-694b-462b-b604-ab2ccf23d667", projectId:"proof-registry", initiator:"mise-registry-curator", requestedBy:"user-1", scope:"eip155:84532", operation:"contract_write" as const, target:"0xabc", method:"registerArtifact", args:[], valueWei:"0", nonce:"1234567890abcdef", createdAt:new Date().toISOString(), expiresAt:new Date(Date.now()+60000).toISOString(), requiresHumanApproval:true as const, metadata:{} };
it("allows a safe simulated registry write with confirmation",()=>{
 const result=evaluateIntent(intent,{ok:true,warnings:[]},{allowedScopes:new Set([intent.scope]),allowedTargets:new Set([intent.target]),maxValueWei:0n,privilegedMethods:new Set()});
 expect(result.decision).toBe("allow-with-confirmation");
});
