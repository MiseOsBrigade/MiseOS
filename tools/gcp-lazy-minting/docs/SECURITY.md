# Security Model

## Secrets

The voucher signer private key belongs in Secret Manager. It must never appear in:

- Git history
- Cloud Storage
- browser code
- Vite variables
- build arguments
- Terraform state
- CI logs

Use a dedicated signer wallet. The contract should support signer rotation and voucher nonce invalidation.

## API authorization

Keep the voucher endpoint private by default. A public mint application should call a controlled backend that applies:

- authenticated user or wallet challenge
- allowlist or payment entitlement checks
- per-wallet and per-IP rate limits
- nonce replay protection
- maximum voucher lifetime
- contract, chain, token, price, and recipient validation

## Google identities

Use a different service account for the metadata worker, voucher API, and GitHub deployer. Use GitHub OIDC Workload Identity Federation instead of a downloaded JSON key.

## Storage

- Source bucket: private, public-access prevention enforced.
- Audit bucket: private, versioned, retention policy enabled.
- Public bucket: publish only finalized derivative images and metadata.
- Do not use object custom metadata for confidential information because it may be exposed with object headers.

## Smart-contract requirements

The contract must verify:

- EIP-712 domain
- approved signer
- token ID
- recipient
- URI
- price
- nonce
- expiry
- chain ID
- single use of the voucher

The API and contract voucher structs must match exactly.
