# MiseOS Packages and Payments

## Status

The repository contains a **catalog-only commercial configuration**. It defines stable product keys and entitlements without claiming that live checkout, subscriptions, taxes, refunds, or fulfillment are active.

Source of truth: [`config/commerce.catalog.json`](../config/commerce.catalog.json).

## Product tiers

| Product key | Tier | Billing model | Activation state |
|---|---|---|---|
| `miseos_community` | Community | Free | Available as public/open-core materials |
| `miseos_pro_monthly` | Pro | Monthly subscription | Catalog only |
| `miseos_team_monthly` | Team | Monthly subscription | Catalog only |
| `miseos_enterprise` | Enterprise | Contact sales | Catalog only |

Prices are intentionally `null` until the merchant selects pricing and creates matching products in the billing provider.

## Secrets and environment variables

Never commit provider keys, webhook secrets, live price IDs, customer data, or settlement information.

Required production environment names:

```text
BILLING_PROVIDER_SECRET_KEY
BILLING_WEBHOOK_SECRET
MISEOS_PRO_MONTHLY_PRICE_ID
MISEOS_TEAM_MONTHLY_PRICE_ID
```

Use GitHub environment secrets or the deployment platform's encrypted secret store. Use separate sandbox and production environments.

## Required checkout flow

```text
Authenticated user
  -> server creates provider checkout session
  -> provider-hosted checkout
  -> signed webhook received by server
  -> signature verified
  -> event deduplicated by provider event ID
  -> entitlement written transactionally
  -> audit event recorded
  -> user receives confirmation
```

The browser must never grant entitlements solely because it reached a success URL.

## Proof gates before live billing

1. Sandbox products and prices exist.
2. Checkout creates a valid sandbox session.
3. Success and cancellation redirects work.
4. Webhook signatures are verified with the raw request body.
5. Duplicate webhook delivery does not duplicate entitlements.
6. Failed payments, cancellations, upgrades, downgrades, and refunds are handled.
7. Product keys map deterministically to entitlements.
8. Customer support and refund terms are published.
9. Tax, merchant-of-record, privacy, and record-retention responsibilities are reviewed.
10. Production secrets and price IDs are set only after all proof gates pass.

## Package publishing

Each publishable package should include:

- a stable package name and version;
- license and ownership information;
- README with install, use, test, and uninstall steps;
- changelog;
- integrity/provenance information;
- automated tests;
- release workflow using trusted publishing where supported;
- no long-lived registry token committed to the repository.

Recommended release path:

```text
feature branch
  -> local proof
  -> pull request validation
  -> human approval
  -> tagged release
  -> trusted registry publish
  -> provenance/SBOM artifact
  -> release verification
```

## Provider adapter boundary

Application code should depend on an internal billing interface rather than provider-specific objects:

```text
createCheckout(productKey, customerContext)
verifyWebhook(rawBody, signature)
applyBillingEvent(event)
getEntitlements(subjectId)
cancelSubscription(subjectId)
```

This keeps Stripe, Paddle, Lemon Squeezy, Polar, or another provider replaceable without rewriting product policy.

## Current limitation

This repository cannot activate a merchant account, accept legal terms, establish tax settings, create settlement accounts, or generate production secrets on the owner's behalf. Those actions require the account owner inside the chosen billing provider. The repository is ready for those values without exposing them in Git.
