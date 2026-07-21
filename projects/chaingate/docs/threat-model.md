# Threat model

## Assets

- wallet authority and user consent
- authentication sessions and nonces
- transaction intent integrity
- contract and chain allowlists
- artifact and metadata hashes
- settlement and entitlement evidence
- operational logs and provenance records

## Adversaries

- malicious websites or injected scripts
- compromised or impersonating wallet providers
- prompt injection and malicious model output
- compromised dependencies or CI workflows
- replay attackers
- malicious contracts and token approvals
- dishonest webhooks or explorer responses
- compromised application operators

## Primary threats and controls

| Threat | Control |
|---|---|
| Model produces harmful calldata | Typed tools, allowlisted deterministic encoders |
| Wrong chain/account signs | Bind preview to scope/account; invalidate on change |
| Replay of authentication | Random one-time nonce, expiry, domain binding |
| Replay across chains | Include chain scope, intent ID, nonce, environment |
| Malicious wallet metadata | Treat EIP-6963 metadata as self-asserted |
| Unlimited token approval | Privileged-method policy and explicit denial by default |
| Stale simulation | Short validity window and state/fee revalidation |
| Fake settlement webhook | Verify signature and retrieve authoritative state when needed |
| Explorer inconsistency | Verify against RPC or multiple evidence sources |
| Dependency compromise | Lockfile, dependency review, CodeQL, provenance, pinned Actions |
| Secret leakage | Managed secrets, redaction, least privilege, push protection |
| Artifact substitution | SHA-256 content addressing and signed/anchored manifest |

## Fail-closed requirements

The system denies execution when it cannot resolve the chain, account, contract, ABI, method, simulation, policy version, or approval state. Availability failures must not silently weaken authorization.

## Residual risks

- A user may knowingly approve a harmful transaction.
- Simulations can differ from final execution because chain state changes.
- A valid signature proves key control, not legal identity or truth.
- On-chain immutability can preserve inaccurate or privacy-sensitive claims.
- External intelligence may be incomplete, stale, or biased.

Review this document for every new chain, signing mode, smart-account feature, bridge, custody model, or privileged contract method.
