# Import the complete ChainGate package

The release archive in this directory contains the complete validated ChainGate repository ecosystem: 102 manifested files, 36 Markdown documents, packages, contracts, examples, schemas, database setup, CI workflows, release automation, and security documentation.

## Verify

```bash
sha256sum -c SHA256SUMS
```

Expected SHA-256:

```text
cffdabe0ed82bdc01806a8c3dce96f68275f1d8f44a15f243ca472dcba3f2a0e
```

## Extract as a standalone repository

```bash
unzip miseos-chaingate-documentation-complete.zip
cd miseos-chaingate-doc-complete
corepack enable
pnpm install
pnpm validate
pnpm docs:check
pnpm contracts:check
```

The archive preserves the authoritative ChainGate source snapshot prepared on 2026-07-21. It is stored as a release artifact inside the canonical MiseOS repository because no standalone ChainGate repository is connected to the current GitHub installation.
