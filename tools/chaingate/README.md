# MiseOS ChainGate

A security-first multichain authorization and provenance framework for MiseOS.

## Included frameworks

- Chain-agnostic wallet/session interfaces using CAIP-style scopes and account IDs.
- MetaMask Connect adapter boundary.
- EIP-6963 injected-wallet discovery helper.
- Typed transaction intents and deterministic builders.
- Policy engine with risk tiers, allowlists, expiry, value limits and human approval.
- Simulation boundary.
- Nonce-based wallet authentication.
- Artifact hashing and signed provenance manifests.
- Solidity proof registry contract.
- Blockscout receipt normalizer.
- Stripe/on-chain entitlement abstraction.
- Agent tool schema that cannot sign or broadcast.
- PostgreSQL schema, Docker services and GitHub Actions.

## Security invariant

```text
AI proposal -> schema validation -> deterministic builder -> simulation
-> policy decision -> explicit wallet approval -> signature -> broadcast
```

No server route or AI tool accepts seed phrases or private keys.

## Quick start

```bash
cp .env.example .env
pnpm install
docker compose up -d
pnpm typecheck
pnpm test
pnpm build
```

## MetaMask SDK integration

`packages/metamask-adapter` deliberately wraps the SDK behind `MultichainWalletClient`. The exact MetaMask package initialization should be updated against the installed `@metamask/connect-multichain` version. All application code depends on the stable adapter interface, not vendor-specific method signatures.

## Recommended first deployment

Use Base Sepolia, deploy `ProofRegistry.sol`, configure Blockscout, and run the Proof Registry example before enabling asset transfers.
