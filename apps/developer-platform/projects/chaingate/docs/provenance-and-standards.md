# Provenance and standards

ChainGate uses standards in layers; no single standard provides identity, authorization, provenance, and governance.

| Standard | Role |
|---|---|
| RFC 9562 | UUIDv7 identifiers |
| RFC 8949 | Compact CBOR serialization |
| RFC 9052 / 9053 | Current COSE structures and algorithms |
| RFC 8152 | Historical COSE reference |
| X.509 profiles | Organizational/service credentials |
| C2PA | Media Content Credentials |
| CAIP-2 | Chain identifiers |
| CAIP account IDs | Chain-qualified accounts |
| CAIP-25 | Multichain session model |
| EIP-1193 | Provider request/event boundary |
| EIP-6963 | Injected-wallet discovery |

## Artifact pipeline

```text
Artifact
→ SHA-256
→ object storage
→ provenance manifest
→ deterministic CBOR
→ COSE signature
→ optional C2PA embedding
→ on-chain digest
→ receipt verification
```

## COSE profile

Use current COSE RFCs for new work. Use `COSE_Sign1` for one signer and `COSE_Sign` when a release requires multiple signers. Security-relevant values belong in protected headers. A key ID is only a lookup hint.

## C2PA profile

Use C2PA for supported media when edit history and AI-use disclosure matter. Record creators, tools, actions, ingredient assets, asset role, and registry links. Do not publish private prompts, secrets, personal data, or internal policies in public credentials.

## On-chain boundary

Store hashes, issuer accounts, timestamps, and stable references on-chain. Keep source files and rich/private evidence off-chain.

Cryptographic provenance proves that a signer made claims and that protected bytes were not changed. It does not prove every claim is true, lawful, ethical, or authorized.
