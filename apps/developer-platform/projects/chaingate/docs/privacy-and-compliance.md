# Privacy and compliance

Deployments remain responsible for legal and regulatory analysis.

## Never publish on-chain

- seed phrases, keys, or tokens
- private prompts
- identity documents
- confidential manuscripts
- payment-card data
- health or employment records
- unredacted internal audit evidence

Store only the minimum hash and reference data needed for verification.

## Wallet addresses

A wallet address may become personal data when linked to a person. Restrict wallet-to-user mappings by role and purpose.

## Public permanence

The UI must disclose which fields become public before signature. Avoid mutable names, contact information, and revocable personal data on-chain.

## Stripe boundary

Stripe handles card and bank-payment data. ChainGate stores normalized settlement evidence, not raw card details.

## AI boundary

Remove secrets and unnecessary personal data before model calls. Use typed tools, define retention, and record model/policy versions used for proposals.

## Deletion

Deleting off-chain data does not erase public blockchain records. User policy must state this clearly.

## Review triggers

Obtain specialist review before adding custody, money transmission, token sales, swaps, yield, securities-like instruments, automated treasury management, or regulated identity verification.
