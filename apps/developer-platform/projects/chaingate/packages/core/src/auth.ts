import { createHash, randomBytes } from "node:crypto";

export type AuthChallenge = { domain:string; statement:string; uri:string; version:"1"; chainScope:string; nonce:string; issuedAt:string; expirationTime:string; resources:string[] };

export function createChallenge(input: Omit<AuthChallenge,"nonce"|"issuedAt"|"expirationTime">, ttlMs=300_000): AuthChallenge {
  const now = new Date();
  return { ...input, nonce: randomBytes(24).toString("hex"), issuedAt: now.toISOString(), expirationTime: new Date(now.getTime()+ttlMs).toISOString() };
}
export function hashChallenge(challenge: AuthChallenge): string {
  return createHash("sha256").update(JSON.stringify(challenge)).digest("hex");
}
