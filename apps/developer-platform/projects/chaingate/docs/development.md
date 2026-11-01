# Development guide

## Prerequisites

- Node.js 22+
- Corepack and pnpm
- Docker Compose
- Optional: Foundry (`forge`) and Slither

## Setup

```bash
corepack enable
pnpm install
cp .env.example .env
docker compose up -d
pnpm validate
```

## Workspace conventions

- `packages/core` must remain provider-neutral.
- Vendor-specific SDK code belongs in an adapter package.
- External boundaries use Zod and JSON Schema.
- All security decisions return machine-readable reason codes.
- Never place authorization logic in presentation components.
- Never log credentials, signed raw payloads, or unnecessary wallet history.

## Adding an integration

1. Define an internal interface.
2. Implement the vendor adapter in `packages/integrations` or a dedicated package.
3. Add mocked success, failure, timeout, malformed-response, and retry tests.
4. Document environment variables and data retention.
5. Add an audit event for state-changing operations.

## Adding a blockchain action

1. Add a typed tool schema.
2. Add an allowlisted deterministic encoder.
3. Add simulation support.
4. Add policy rules and denial reasons.
5. Add a human-readable preview formatter.
6. Add positive and negative tests.
7. Update the threat model if authority or value changes.

## Definition of done

A change is complete when code, tests, schemas, documentation, observability, failure handling, and migration impact agree.
