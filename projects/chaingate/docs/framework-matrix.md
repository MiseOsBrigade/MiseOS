# Framework matrix

| Framework | Implementation | Production extension |
|---|---|---|
| MetaMask multichain | Vendor adapter interface | Install SDK and map current response types |
| CAIP scopes/accounts | Core validators | Add explicit CAIP-2/10 parser package |
| Wallet discovery | EIP-6963 helper | Add curated wallet metadata verification |
| Authentication | Nonce challenge generator | Add EIP-4361/Solana verification adapters |
| Agent safety | Schema-only preparation tool | OpenAI Responses tool registration |
| Policy | Allowlist/value/expiry/risk checks | GMI evaluators, multisig thresholds |
| Simulation | Boundary and result type | Tenderly/eth_call/Solana simulation |
| Provenance | SHA-256 manifest functions | COSE/CBOR signatures and Zenodo sync |
| Contract | Immutable proof registry | Roles, upgrade policy only if justified |
| Indexing | Blockscout normalizer | Retry queue and reorg reconciliation |
| Payments | Settlement evidence abstraction | Stripe webhook and chain finality workers |
| Storage | Spaces environment model | Signed URLs, retention and malware scan |
| Analytics | SQL-ready event tables | Airbyte destinations and scoped views |
| CI/CD | GitHub Actions validation | Foundry tests, Slither and protected deploys |
