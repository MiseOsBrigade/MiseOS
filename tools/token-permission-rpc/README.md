# MiseOS TOKEN NFT — Execution Permission RPC

Experimental, audit-first reference implementation for a MiseOS wallet permission request flow.

This package implements a **safe scaffold** around:

- `wallet_requestExecutionPermissions`
- `wallet_revokeExecutionPermission`
- `wallet_getSupportedExecutionPermissions`
- `wallet_getGrantedExecutionPermissions`

The goal is not to bypass wallet approval. The goal is to define a user-readable, revocable, scoped, auditable permission object that a wallet can choose to grant, adjust, or reject.

## Important non-claims

- This does not deploy a live token.
- This does not custody assets.
- This does not sign user transactions.
- This does not replace wallet-side enforcement.
- This is not financial advice or an investment product.
- This must be audited before production use.

## Architecture

```text
DApp
  -> wallet_getSupportedExecutionPermissions
  -> wallet_requestExecutionPermissions
Wallet
  -> domain/reputation check
  -> matrix risk score
  -> human approval if risk exceeds threshold
  -> returns PermissionResponse with opaque context
DApp
  -> stores context
  -> may later redeem only through the wallet-supported delegation path
Wallet/User
  -> wallet_revokeExecutionPermission at any time
```

## MiseOS permission profile

Profile ID:

```txt
miseos-token-nft-execution-permission/v1
```

Permission types:

- `miseos-native-token-allowance`
- `miseos-erc20-token-allowance`
- `miseos-erc721-token-action`
- `miseos-nft-mint-window`
- `miseos-season-drop-mint`

Rule types:

- `expiry`
- `max-call-count`
- `max-native-value`
- `allowed-targets`
- `allowed-functions`
- `season-whitelist`
- `human-approval-required`
- `domain-verdict`
- `matrix-risk-threshold`

## Files

- `src/types.ts` — JSON-RPC type definitions.
- `src/miseMatrixMetric.ts` — TypeScript risk metric mirror.
- `src/rpcHandler.ts` — wallet-side in-memory reference handler.
- `src/dappClient.ts` — DApp helper for EIP-1193 providers.
- `native/mise_permission_metric.cpp` — personalized C++ matrix metric engine.
- `contracts/MiseOSPermissionInterfaces.sol` — Solidity interfaces and reference NFT skeleton.
- `schemas/miseos-execution-permission.schema.json` — JSON schema.
- `docs/security-model.md` — threat model and audit rules.

## Why this matches MiseOS

The design follows MiseOS / Aletheia / PhaseForm patterns:

- provenance-aware contexts
- signed or hash-derived manifests
- explicit human approval for high-risk actions
- revocation-first lifecycle
- conservative local risk scoring
- append-only audit events
