# End-to-end example: AEON Sentinel release

1. Upload `aeon-sentinel-v1.2.pdf`.
2. Compute SHA-256 locally.
3. Store the binary at `s3://miseos-provenance/artifacts/...`.
4. Produce a signed manifest containing GitHub, ORCID and Zenodo identifiers.
5. Ask the AI tool to propose `registerArtifact`; it returns structured arguments only.
6. Deterministically encode the `ProofRegistry.registerArtifact` call.
7. Run `eth_call` and gas estimation against Base Sepolia.
8. Evaluate policy: approved chain, approved registry, zero value, unexpired nonce.
9. Display the artifact name, hash, contract, chain, fee and permanence warning.
10. Invoke MetaMask for explicit approval.
11. Broadcast the signed transaction.
12. Verify it independently using Blockscout.
13. Emit an Airbyte analytics record and immutable audit event.
14. Grant the publishing entitlement only after confirmed settlement.

## Negative example

An agent proposes an unlimited token approval to an unknown contract. The target is not allowlisted and the method is privileged. ChainGate returns `deny`, never opens the wallet signature prompt, and writes a denied audit event.
