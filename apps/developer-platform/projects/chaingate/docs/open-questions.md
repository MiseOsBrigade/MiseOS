# Assumptions and open questions

## Current integration

ChainGate is currently maintained as the isolated `projects/chaingate/` subtree of `MiseOsBrigade/MiseOS`. A dedicated standalone repository may be created later, but it is not required for local development.

## Confirm before public production release

1. **Long-term repository model:** decide whether ChainGate remains a MiseOS subtree or becomes a dedicated repository. Update badges, root workflows, issue links, and package metadata when that decision changes.
2. **License ownership:** the subtree uses Apache-2.0 with GoodShyt Group Inc. copyright language. Confirm final legal ownership and contributor terms before external package publication.
3. **Package publication:** packages are configured as private/restricted alpha components. Decide which packages should eventually publish to npm.
4. **MetaMask API pin:** install the current `@metamask/connect-multichain` version and adapt only `packages/metamask-adapter`.
5. **Lockfile:** generate and commit `pnpm-lock.yaml` in a network-enabled environment, then use `pnpm install --frozen-lockfile` in active CI.
6. **Repository-root CI:** promote the reference workflows from `projects/chaingate/.github/workflows/` into the MiseOS root workflow directory with `projects/chaingate/**` path filters.
7. **Production chains:** Base Sepolia is the reference environment. Mainnet chain and contract allowlists remain intentionally unset.
8. **Security contacts:** configure GitHub private vulnerability reporting and an internal escalation owner.
