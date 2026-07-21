import { z } from "zod";

export const ChainScope = z.string().regex(/^[a-z0-9]+:[A-Za-z0-9_-]+$/);
export const AccountId = z.string().regex(/^[a-z0-9]+:[A-Za-z0-9_-]+:.+$/);
export type ChainScope = z.infer<typeof ChainScope>;
export type AccountId = z.infer<typeof AccountId>;

export const TransactionIntentSchema = z.object({
  intentId: z.string().uuid(),
  projectId: z.string().min(1),
  initiator: z.string().min(1),
  requestedBy: z.string().min(1),
  scope: ChainScope,
  operation: z.enum(["contract_write", "native_transfer", "token_transfer", "message_signature"]),
  target: z.string().min(1),
  method: z.string().optional(),
  args: z.array(z.unknown()).default([]),
  valueWei: z.string().regex(/^\d+$/).default("0"),
  nonce: z.string().min(16),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  requiresHumanApproval: z.literal(true),
  metadata: z.record(z.unknown()).default({})
});
export type TransactionIntent = z.infer<typeof TransactionIntentSchema>;

export type SimulationResult = { ok: boolean; gasEstimate?: bigint; warnings: string[]; revertReason?: string };
export type PolicyDecision = { decision: "allow"|"allow-with-confirmation"|"deny"; riskTier: 0|1|2|3|4|5; reasons: string[] };
export type PreparedRequest = { scope: ChainScope; method: string; params: readonly unknown[]; summary: string; digest: string };

export interface MultichainWalletClient {
  connect(scopes: readonly ChainScope[]): Promise<{ accounts: AccountId[]; scopes: ChainScope[]; sessionId: string }>;
  invoke<T>(scope: ChainScope, method: string, params?: readonly unknown[]): Promise<T>;
  disconnect(): Promise<void>;
}

export * from "./policy.js";
export * from "./auth.js";
export * from "./provenance.js";
