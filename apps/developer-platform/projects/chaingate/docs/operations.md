# Operations guide

## Observability

Record structured events for intent creation, simulation, policy decision, approval presentation, signature request, broadcast, confirmation, provenance registration, entitlement change, and denial. Redact secrets and sensitive payloads.

## Service-level indicators

- wallet connection success rate
- simulation latency and failure rate
- policy denial reasons
- signature rejection rate
- broadcast and confirmation latency
- indexer lag
- webhook verification failures
- provenance-hash mismatches

## Incident response

1. Identify affected environment, chain, contract, key, package, and version.
2. Disable the affected capability or contract allowlist entry.
3. Preserve logs, receipts, manifests, and deployment evidence.
4. Rotate compromised service credentials.
5. Notify affected users when their security or data is implicated.
6. Patch, test, and release through the emergency process.
7. Publish a security advisory and post-incident review when appropriate.

## Backups

- PostgreSQL: encrypted daily backups with restore tests
- Object storage: versioning and retention policy
- Contract deployments: source, bytecode, ABI, chain ID, deployer, tx hash
- Release evidence: checksums, SBOM, provenance, signed tags

## Production readiness gate

Mainnet remains prohibited until contract testing, independent review, key management, monitoring, rate limiting, rollback strategy, privacy review, and incident ownership are documented and approved.
