# MiseOS FileOps Payment Setup

This repository stores a provider-neutral payment catalog for the FileOps Console and package line.

## Catalog

```txt
payments/miseos-fileops-products.json
```

## Validate

```bash
npm run fileops:payments:check
```

## Provider Mapping

Keep real provider IDs in deployment secrets or private config, not Git.

```json
{
  "miseos.fileops.starter": {
    "stripe_price_id": "price_...",
    "polar_product_id": "...",
    "lemonsqueezy_variant_id": "..."
  }
}
```

## Required Production Secrets

```txt
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
POLAR_ACCESS_TOKEN
LEMONSQUEEZY_API_KEY
PAYMENT_PROVIDER
```
