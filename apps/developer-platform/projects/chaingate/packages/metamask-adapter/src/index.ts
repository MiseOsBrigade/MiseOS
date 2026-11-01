import type { AccountId, ChainScope, MultichainWalletClient } from "@miseos/chaingate-core";

export type MetaMaskSdkLike = {
  connect(args: unknown): Promise<unknown>;
  invokeMethod(args: unknown): Promise<unknown>;
  disconnect(): Promise<void>;
};

export class MetaMaskMultichainAdapter implements MultichainWalletClient {
  constructor(private readonly sdk: MetaMaskSdkLike) {}
  async connect(scopes: readonly ChainScope[]) {
    const raw = await this.sdk.connect({ scopes: Object.fromEntries(scopes.map(scope => [scope, {}])) }) as any;
    const accounts = extractAccounts(raw);
    return { accounts, scopes:[...scopes], sessionId:String(raw?.sessionId ?? raw?.id ?? crypto.randomUUID()) };
  }
  async invoke<T>(scope: ChainScope, method: string, params: readonly unknown[] = []): Promise<T> {
    return this.sdk.invokeMethod({ scope, request:{ method, params } }) as Promise<T>;
  }
  disconnect() { return this.sdk.disconnect(); }
}

function extractAccounts(raw:any): AccountId[] {
  const values = raw?.accounts ?? raw?.session?.accounts ?? [];
  return Array.isArray(values) ? values.filter((v):v is AccountId => typeof v === "string" && v.split(":").length >= 3) : [];
}
