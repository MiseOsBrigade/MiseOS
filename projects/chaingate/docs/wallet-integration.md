# Wallet integration

Application code depends on `MultichainWalletClient`, not directly on a wallet vendor SDK.

```ts
interface MultichainWalletClient {
  connect(scopes: readonly ChainScope[]): Promise<{
    accounts: AccountId[];
    scopes: ChainScope[];
    sessionId: string;
  }>;
  invoke<T>(scope: ChainScope, method: string, params?: readonly unknown[]): Promise<T>;
  disconnect(): Promise<void>;
}
```

The MetaMask implementation is isolated in `packages/metamask-adapter`.

## Connection policy

Request only the scopes required by the current workflow.

```ts
await wallet.connect(["eip155:8453"]);
```

Do not request every supported chain during onboarding.

## Invalidation rules

Discard a prepared preview when:

- account changes
- chain changes
- wallet disconnects
- session expires
- requested method is outside the approved scope
- simulation or policy inputs change

A stale preview must never be signed.

## EIP-6963 discovery

Use `discoverInjectedWallets` for multiple injected wallets. Provider metadata is self-asserted and only suitable for display and selection. Render icons with an image element using `safeWalletIconProps`; never inject provider-supplied SVG markup.

## Authentication

Authentication and transaction authorization are separate. A challenge binds domain, URI, scope, nonce, issue time, expiry, and requested resources. The server verifies the signature and consumes the nonce once. Login does not authorize later transactions.

## Signing checklist

1. Revalidate the intent.
2. Re-run simulation when chain state may be stale.
3. Evaluate the current policy version.
4. Confirm connected account and scope.
5. Generate the preview from deterministic values.
6. Require explicit confirmation.

## Error normalization

| Condition | Expected outcome |
|---|---|
| User rejected | No transaction sent; do not auto-retry |
| Unauthorized | Reconnect with the required scope |
| Unsupported method | Offer a supported flow |
| Disconnected chain | Pause and require reconnection |
| Account changed | Discard preview and rebuild |
| Expired session | Reauthenticate and reconnect |
