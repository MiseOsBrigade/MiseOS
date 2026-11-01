# Architecture

## Trust boundaries

1. **Agent plane:** proposes typed operations only.
2. **Builder plane:** deterministically encodes allowlisted operations.
3. **Simulation plane:** predicts execution and produces warnings.
4. **Policy plane:** checks chain, target, value, method, expiry and risk.
5. **Approval plane:** presents a human-readable preview and requires consent.
6. **Wallet plane:** signs inside MetaMask; private keys never enter MiseOS.
7. **Verification plane:** confirms receipts independently through RPC/indexers.
8. **Provenance plane:** stores hashes, manifests, signatures and receipts.

## Example: research release

```text
Upload manuscript
-> SHA-256 artifact and metadata
-> store binary in DigitalOcean Spaces
-> build manifest
-> AI may explain, but cannot sign
-> deterministic registerArtifact calldata
-> simulate on Base Sepolia
-> policy allow-with-confirmation
-> user signs with MetaMask
-> broadcast
-> verify through Blockscout
-> link GitHub release, ORCID and Zenodo IDs
```
