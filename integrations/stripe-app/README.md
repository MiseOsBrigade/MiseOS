# MiseOS Stripe App

Dashboard-side integration for MiseOS commerce operations.

## Boundary

Stripe handles payment and entitlement events. Google Cloud handles NFT image/metadata processing and lazy-mint API infrastructure. The blockchain contract performs the mint. The Stripe UI never receives a wallet private key or lazy-mint signer.

## Upload and install

1. Install and authenticate the Stripe CLI.
2. From this directory, run `npm install`.
3. Run `npm run stripe:validate` and resolve every manifest validation error.
4. Run `npm run stripe:upload`.
5. Install the validated version in test mode from the Stripe Dashboard.
6. Exercise test payments/webhooks and verify the backend.
7. Only after those checks pass, select **Private to MiseOS** and install the chosen version in live mode from the Dashboard.

Upload is not evidence of installation or production readiness.

## Configuration

Copy `.env.example` to a local ignored environment file. Public UI configuration may contain service URLs and chain identifiers. Stripe secret keys, webhook signing secrets, wallet private keys, recovery phrases, and lazy-mint signing keys must never be committed or exposed to the UI.

The exact Stripe App manifest schema is intentionally not fabricated here. Initialize/validate the manifest with the currently installed Stripe CLI before upload.
