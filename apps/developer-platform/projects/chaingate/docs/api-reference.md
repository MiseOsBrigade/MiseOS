# Package and API boundaries

## `@miseos/chaingate-core`

Provider-neutral types and logic for transaction intents, policy evaluation, authentication challenges, and provenance manifests. It must not import wallet SDKs or external service clients.

## `@miseos/metamask-adapter`

Implements wallet discovery and the internal multichain client interface. SDK-specific session types stay inside this package.

## `@miseos/agent-tools`

Exposes typed model tools that return structured proposals. It cannot sign or broadcast.

## `@miseos/blockscout`

Normalizes explorer transaction data into ChainGate receipt evidence. Explorer results are verification evidence, not authorization.

## `@miseos/entitlements`

Combines verified Stripe and on-chain settlement evidence into product access decisions.

## `@miseos/integrations`

Adapters for OpenAI, Stripe, DigitalOcean Spaces, Airbyte, and advisory intelligence sources.

## `@miseos/observability`

Defines structured audit events and redaction-safe logging contracts.

## Schemas

External boundaries use the versioned JSON Schemas in `schemas/`. Breaking schema changes require a new schema identifier and migration notes.
