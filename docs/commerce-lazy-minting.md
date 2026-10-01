# Commerce and lazy-minting architecture

## Trust boundaries

| Layer | Responsibility | Must not hold |
|---|---|---|
| Stripe App | Dashboard UI, payment/entitlement operations | wallet keys, lazy-mint signer |
| Payment backend | verify Stripe webhook signatures; create idempotent fulfillment jobs | frontend secrets |
| Google Cloud | image storage, metadata generation, metadata API, voucher service | Stripe UI state as authorization |
| Secret Manager | lazy-mint signing material | public metadata |
| NFT contract | verify voucher and mint | Stripe credentials |

## Fulfillment state machine

`payment pending -> payment verified -> fulfillment queued -> voucher issued -> mint submitted -> confirmed`

Every transition must be idempotent and auditable. A Stripe event ID may be processed once; a voucher nonce may be redeemed once. Payment success does not itself prove an on-chain mint succeeded.

## Metadata layout

Use separate private source, public derivative/metadata, and private audit buckets. NFT metadata is a separate JSON document; Cloud Storage object metadata is operational catalog data and is not a substitute for ERC-721/1155 metadata.

## Production gates

Production remains blocked until Stripe test installation, webhook verification, GCP deployment, contract deployment, signer provisioning, end-to-end test minting, and observed CI checks all succeed.
