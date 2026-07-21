# Deployment

This is the reference deployment topology, not a substitute for an independent security review.

## Environment isolation

Development, staging, and production require separate databases, Redis, buckets, RPC keys, Stripe endpoints, contracts, and signing credentials. Never reuse production secrets in previews.

## Reference topology

```text
Web client
→ API services
→ PostgreSQL
→ Redis
→ DigitalOcean Spaces
→ RPC providers / Blockscout
→ Stripe / OpenAI
```

Recommended DigitalOcean services are App Platform or Kubernetes, Managed PostgreSQL, a hardened Redis-compatible service, and private Spaces buckets.

## Database

1. Require TLS.
2. Create a least-privilege application role.
3. Apply versioned migrations derived from `database/schema.sql`.
4. Enable backups and point-in-time recovery.
5. Test restoration before launch.

## Object storage

Use private buckets by default. Deliver files with short-lived signed URLs or a controlled gateway. Use keys shaped as:

```text
artifacts/{artifactId}/{sha256}
```

## Contract deployment

```bash
pnpm contracts:check
```

Then deploy to testnet, verify source, record chain/address/deployer/compiler/commit/bytecode hash, run end-to-end tests, and add the address to the environment allowlist. Mainnet requires external review.

## Secrets

Use platform secret stores with rotation, ownership, access logging, and least privilege. Never store wallet private keys in application secrets.

## Health checks

Separate liveness from readiness. Readiness fails when critical dependencies or configuration are unavailable. Advisory integrations may degrade without authorizing risky actions.

## Rollback

Application releases need tested rollback. Database migrations must be backward compatible or reversible. Smart-contract deployments are treated as irreversible; publish a new contract and update policy rather than relying on hidden upgrade authority.
