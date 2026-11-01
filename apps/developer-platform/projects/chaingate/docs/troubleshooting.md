# Troubleshooting

## Installation fails

```bash
node --version
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm --version
```

Install from the repository root. Do not use `npm install` inside packages.

## Workspace package cannot resolve

Confirm the package is listed by `pnpm-workspace.yaml`, then rerun `pnpm install` from root.

## Documentation links fail

```bash
pnpm docs:check
```

File-name casing matters on GitHub Actions.

## Contract checks are skipped

Install Foundry and confirm `forge` is on `PATH`. Release validation must not claim contract success when Foundry is unavailable.

## Wallet returns no accounts

Confirm scope support, user approval, and the pinned SDK response shape used by the adapter.

## Policy always denies

Check expiry, exact scope, lowercase allowlist target, maximum value, simulation result, and privileged-method policy.

## Blockscout returns 404

The transaction may not be indexed, the API base may be wrong, or endpoint shape may differ. Query RPC before declaring failure.

## Stripe verification fails

The handler must use the exact raw request body; parsed and reserialized JSON does not match the signed bytes.

## Digests differ

Confirm identical artifact bytes and deterministic metadata serialization. Production signed manifests should use deterministic CBOR rather than ordinary JSON serialization.
