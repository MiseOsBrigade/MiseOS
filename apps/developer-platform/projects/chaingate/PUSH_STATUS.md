# ChainGate push status

The complete MiseOS ChainGate ecosystem was imported into the canonical `MiseOsBrigade/MiseOS` repository on 2026-07-21.

## GitHub location

```text
MiseOsBrigade/MiseOS
└── projects/
    └── chaingate/
```

The subtree contains the application workflow, packages, Solidity contract and tests, schemas, database model, examples, scripts, governance files, documentation, and reference automation.

## Active repository workflows

Monorepo-aware ChainGate workflows are active at the repository root:

- `.github/workflows/chaingate-ci.yml`
- `.github/workflows/chaingate-contracts.yml`
- `.github/workflows/chaingate-security.yml`
- `.github/workflows/chaingate-release.yml`

They use `projects/chaingate/**` path filters and execute from the ChainGate subtree. Release tags use the `chaingate-v*` pattern.

## Source snapshot

- Source commit: `933e489 docs: complete production documentation ecosystem`
- Source archive SHA-256: `cffdabe0ed82bdc01806a8c3dce96f68275f1d8f44a15f243ca472dcba3f2a0e`
- Source package files: 102
- Markdown documents validated in the source package: 36
- Unresolved TODO/FIXME/TBD markers in the source package: 0
- Import manifest: [`FILE_MANIFEST.json`](FILE_MANIFEST.json)

## Integration decision

No standalone `miseos-chaingate` repository was available in the connected GitHub installation. ChainGate remains isolated under `projects/chaingate/`, preserving the existing MiseOS product code and history.

## Remaining external gates

- Generate and commit `pnpm-lock.yaml` in a network-enabled development environment.
- Run the complete pnpm and Foundry validation suite.
- Pin the production MetaMask Connect SDK version.
- Complete an independent security review before mainnet use.
