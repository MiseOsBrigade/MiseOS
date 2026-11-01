# Data model

ChainGate separates identity, intent, execution evidence, provenance, and entitlement records so no identifier or record is overloaded.

## Core entities

| Entity | Purpose | Identifier |
|---|---|---|
| Wallet identity | Binds an application subject to a chain account | UUID + CAIP account ID |
| Wallet session | Records approved scopes and lifecycle | Session ID |
| Authentication nonce | Prevents login replay | Random nonce hash |
| Transaction intent | Immutable proposed action | UUIDv7 preferred |
| Simulation result | Predicted execution outcome | Intent ID + version |
| Policy decision | Authorization result and risk tier | Intent ID + policy version |
| Provenance manifest | Describes an off-chain artifact | Artifact UUID |
| Chain receipt | Confirms broadcast outcome | Scope + transaction hash |
| Settlement evidence | Normalizes Stripe or on-chain settlement | Source + reference |
| Audit event | Append-only operational evidence | UUIDv7 preferred |

## Identifier policy

Use UUIDv7 for time-ordered records and canonical text IDs for readable stable names.

```json
{
  "id": "0190bbf2-69f8-7480-a2c2-988e932cf221",
  "canonicalId": "miseos.artifact.aeon-sentinel.v1-2"
}
```

A UUID identifies; it is not a secret or authorization token.

## Transaction intent

The external schema is `schemas/transaction-intent.schema.json`; runtime validation is `TransactionIntentSchema` in `packages/core/src/index.ts`.

An intent includes the actor, project, scope, target, operation, nonce, expiry, value, and mandatory human approval. Once previewed, changing account, chain, calldata, value, or policy inputs invalidates the preview.

## Provenance manifest

```json
{
  "schema": "miseos.provenance.v1",
  "artifactId": "0190...",
  "artifactSha256": "...",
  "metadataSha256": "...",
  "storageUri": "s3://bucket/artifacts/...",
  "issuerAccount": "eip155:8453:0x...",
  "issuedAt": "2026-07-21T12:00:00Z",
  "externalIds": {
    "github": "release:v0.1.0",
    "zenodo": "deposit:123456"
  }
}
```

PostgreSQL is the source of truth for application state. Redis is restricted to ephemeral nonces, rate limits, and session state. Object storage holds large artifacts. Chains store compact proofs and transaction state.

## Retention

- Consume and delete authentication nonces after use or expiration.
- Retain intents, decisions, receipts, and audit evidence according to incident and compliance policy.
- Avoid retaining raw prompts containing sensitive data.
- Treat public chain data as effectively permanent.
