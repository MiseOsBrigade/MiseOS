# Security policy

## Secrets

Never commit API keys, GitHub App private keys, wallet files, seed phrases, mnemonics, keystores, service-account credentials, or production environment files.

Use GitHub Actions secrets, Vercel environment variables, DigitalOcean secret storage, or an approved external secret manager. Workflow manifests reference secret names only.

## Wallet boundary

MiseOS must not accept or persist private keys or seed phrases. Blockchain operations follow this invariant:

```text
AI proposal -> schema validation -> deterministic builder -> simulation
-> policy decision -> explicit wallet approval -> signature -> broadcast
```

Signing occurs inside the wallet. Server and agent APIs may prepare typed transactions but may not sign or broadcast without explicit approved authorization.

## GitHub webhooks

Production webhook processing must verify `X-Hub-Signature-256`, enforce delivery-id idempotency, restrict supported event types, and store an audit event before executing a workflow.

## Action execution

Every action requires:

- immutable version reference
- timeout
- resource boundary
- least-privilege permissions
- structured output
- evidence record
- checksum

## Reporting

Do not open a public issue for a suspected vulnerability. Use GitHub's private vulnerability reporting feature when enabled.
