# MiseOS Google Cloud Lazy-Minting Infrastructure

Production-oriented infrastructure and automation for managing MiseOS NFT images, metadata, reveal state, and EIP-712 lazy-mint vouchers on Google Cloud.

## What this package does

- Stores source artwork, normalized images, generated metadata, manifests, and audit records in Cloud Storage.
- Generates ERC-721-compatible metadata whenever an image is uploaded.
- Optionally enriches metadata using Cloud Vision label detection.
- Serves metadata through a controlled Cloud Run API.
- Creates signed EIP-712 vouchers for a compatible lazy-mint smart contract.
- Preserves immutable release snapshots and SHA-256 integrity records.
- Uses separate service accounts with least-privilege IAM.
- Avoids long-lived Google service-account keys in GitHub by using Workload Identity Federation.

## Important boundary

Google Cloud manages off-chain files and voucher issuance. A compatible smart contract still performs the actual on-chain mint. The included API signs vouchers only when a signer private key is supplied through Secret Manager. Never place that key in source code, GitHub, frontend environment variables, or Cloud Storage.

## Recommended flow

```text
curator uploads image
        ↓
Cloud Storage incoming/images/
        ↓
Eventarc-triggered Cloud Run function
        ↓
image validation + optional Vision labels
        ↓
ERC-721 metadata JSON + SHA-256 manifest
        ↓
published/metadata/{token_id}.json
        ↓
buyer requests voucher from private/public API
        ↓
API validates inventory, price, chain, recipient, nonce
        ↓
API signs EIP-712 voucher
        ↓
buyer submits voucher to lazy-mint contract
        ↓
contract mints token on Base Sepolia or Base
```

## Bucket design

The Terraform module creates three buckets by default:

```text
miseos-<env>-source/
  incoming/images/
  incoming/metadata-overrides/
  incoming/batch-manifests/
  quarantine/
  processed/

miseos-<env>-public/
  images/v1/<token-id>-<slug>.<ext>
  metadata/v1/<token-id>.json
  collection/collection.json
  manifests/v1/catalog.json
  manifests/v1/checksums.sha256

miseos-<env>-audit/
  events/YYYY/MM/DD/
  releases/<version>/
  vouchers/YYYY/MM/DD/
  failures/YYYY/MM/DD/
```

The source and audit buckets remain private. The public bucket can be exposed through a load balancer/CDN or made object-public only when your organization policy permits it. The safer default is public metadata delivery through Cloud Run.

## Repository layout

```text
infra/terraform/                 Google Cloud infrastructure
services/metadata-worker/       Event-driven metadata generator
services/metadata-api/          Metadata and voucher API
schemas/                         JSON Schemas
config/                          Collection and chain configuration
scripts/                         Catalog import and checksum tools
examples/                        Sample image sidecar and generated metadata
tests/                           Unit tests
.github/workflows/               Validation and deployment workflows
docs/                            Operations and security guidance
```

## Quick start

### 1. Prerequisites

- Google Cloud project with billing enabled
- `gcloud`
- Terraform 1.6+
- Python 3.12
- A deployed lazy-mint contract compatible with the voucher schema
- A dedicated voucher-signing wallet funded only as operationally required

### 2. Configure Terraform

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
# edit terraform.tfvars
terraform init
terraform plan
terraform apply
```

### 3. Create the signer secret

```bash
printf '%s' "$LAZY_MINT_SIGNER_PRIVATE_KEY" | \
  gcloud secrets versions add miseos-lazy-mint-signer --data-file=-
```

Do not echo the key, commit it, or put it in a frontend.

### 4. Upload an image

```bash
gcloud storage cp examples/tariq-notesmith.png \
  gs://miseos-dev-source/incoming/images/001-tariq-notesmith.png
```

Optional sidecar override:

```bash
gcloud storage cp examples/001-tariq-notesmith.metadata.json \
  gs://miseos-dev-source/incoming/metadata-overrides/001-tariq-notesmith.json
```

### 5. Read generated metadata

```bash
curl "$METADATA_API_URL/metadata/1"
```

### 6. Request a voucher

```bash
curl -X POST "$METADATA_API_URL/v1/vouchers" \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 1,
    "recipient": "0x000000000000000000000000000000000000dEaD",
    "priceWei": "0",
    "expiresAt": 1798761600
  }'
```

## Metadata policy

Generated metadata follows an ERC-721-style structure:

```json
{
  "name": "Tariq Notesmith",
  "description": "MiseOS character agent",
  "image": "https://cdn.example.com/images/v1/001-tariq-notesmith.png",
  "external_url": "https://miseos.example/characters/tariq-notesmith",
  "attributes": [
    {"trait_type": "Department", "value": "Documentation"},
    {"trait_type": "Role", "value": "Knowledge Capture"},
    {"trait_type": "Rarity", "value": "Genesis"}
  ],
  "properties": {
    "schema": "miseos.nft.metadata.v1",
    "token_id": 1,
    "slug": "tariq-notesmith",
    "sha256": "..."
  }
}
```

Cloud Storage custom object metadata is also applied for internal cataloging, but marketplaces read the JSON document, not those object metadata fields.

## Cache policy

- Versioned image assets: `public, max-age=31536000, immutable`
- Unrevealed or mutable metadata: `no-store`
- Final revealed metadata: `public, max-age=3600, must-revalidate`
- Release manifests: `public, max-age=300`

Do not overwrite immutable image paths. Publish a new version path instead.

## Validation

```bash
python -m pip install -r requirements-dev.txt
pytest
python scripts/validate_catalog.py config/collection.json
python scripts/checksums.py examples
```

## Deployment status

This package is generated and locally structured, but no Google Cloud resources, contract, secret, bucket, function, or Cloud Run service have been deployed by this process.
