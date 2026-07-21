# Getting started

This guide takes a contributor from clone to a validated local workspace.

## Prerequisites

- Node.js 22+
- Corepack
- Git
- Docker with Compose
- Optional: Foundry for Solidity checks

```bash
node --version
corepack --version
docker compose version
```

## Install

```bash
git clone https://github.com/GoodShyt-Group/miseos-chaingate.git
cd miseos-chaingate
corepack enable
pnpm install
cp .env.example .env
docker compose up -d
```

Install dependencies only from the repository root. The pnpm workspace links internal packages.

## Validate

```bash
pnpm docs:check
pnpm typecheck
pnpm test
pnpm build
pnpm contracts:check
```

Before a pull request, run:

```bash
pnpm validate
```

## Execution invariant

Every state-changing workflow must preserve:

```text
Model proposal
→ schema validation
→ deterministic builder
→ simulation
→ policy decision
→ human-readable preview
→ wallet approval
→ broadcast
→ independent verification
```

No package may bypass this sequence.

## Reading order

1. [Architecture](architecture.md)
2. [End-to-end example](example-end-to-end.md)
3. [Wallet integration](wallet-integration.md)
4. [API reference](api-reference.md)
5. [Testing](testing.md)
6. [Threat model](threat-model.md)

The executable reference workflow is `apps/proof-registry/src/workflow.ts`.
