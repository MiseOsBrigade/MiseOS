# ChainGate push status

The complete MiseOS ChainGate ecosystem was imported into the canonical `MiseOsBrigade/MiseOS` repository on 2026-07-21.

## GitHub location

```text
MiseOsBrigade/MiseOS
└── projects/
    └── chaingate/
```

The subtree now contains the application workflow, packages, Solidity contract and tests, schemas, database model, examples, scripts, governance files, documentation, and reference GitHub automation.

## Source snapshot

- Source commit: `933e489 docs: complete production documentation ecosystem`
- Source archive SHA-256: `cffdabe0ed82bdc01806a8c3dce96f68275f1d8f44a15f243ca472dcba3f2a0e`
- Source package files: 102
- Markdown documents validated in the source package: 36
- Unresolved TODO/FIXME/TBD markers in the source package: 0
- Import manifest: [`FILE_MANIFEST.json`](FILE_MANIFEST.json)

## Integration decision

No standalone `miseos-chaingate` repository was available in the connected GitHub installation. ChainGate is therefore isolated under `projects/chaingate/`, preserving the existing MiseOS product code and history.

The workflow files under `projects/chaingate/.github/workflows/` are reference workflows. GitHub runs workflow files only from the repository-root `.github/workflows/` directory. Promote or adapt them at the repository root before relying on them for CI or releases.

## Remaining external gates

- Generate and commit `pnpm-lock.yaml` in a network-enabled development environment.
- Run the complete pnpm and Foundry validation suite.
- Pin the production MetaMask Connect SDK version.
- Configure repository-root CI for the ChainGate subtree.
- Complete an independent security review before mainnet use.
