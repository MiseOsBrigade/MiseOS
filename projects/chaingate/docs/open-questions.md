# Assumptions and open questions

## Confirm before public release

1. **Repository owner and URL:** documentation assumes `GoodShyt-Group/miseos-chaingate`. Update badges, CODEOWNERS, links, and package metadata if the final owner differs.
2. **License:** Apache-2.0 is the recommended implementation assumption. GoodShyt Group Inc. should confirm it before publication.
3. **Package publication:** packages are configured as private/restricted alpha components. Decide which packages should eventually publish to npm.
4. **MetaMask API pin:** install the current `@metamask/connect-multichain` version and adapt only `packages/metamask-adapter`.
5. **Lockfile:** generate and commit `pnpm-lock.yaml` in a network-enabled environment, then switch CI back to `pnpm install --frozen-lockfile`.
6. **Production chains:** Base Sepolia is the reference environment. Mainnet chain and contract allowlists remain intentionally unset.
7. **Security contacts:** configure GitHub private vulnerability reporting and an internal escalation owner.
