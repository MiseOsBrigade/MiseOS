# Configuration reference

Configuration must be validated once at process startup. Production services should obtain secrets from a managed secret store rather than checked-in files.

## Environments

- `development`: local services and test networks
- `staging`: production-like infrastructure and test networks
- `production`: audited releases and explicit mainnet allowlists

## Required groups

### Core

- `NODE_ENV`
- `DATABASE_URL`
- `REDIS_URL`
- `APP_ORIGIN`
- `SESSION_SECRET`

### Wallet and chain

- `METAMASK_INFURA_API_KEY`
- `DEFAULT_EVM_SCOPE`
- `BLOCKSCOUT_API_URL`
- `PROOF_REGISTRY_ADDRESS`

### Object storage

- `SPACES_ENDPOINT`
- `SPACES_REGION`
- `SPACES_BUCKET`
- `SPACES_ACCESS_KEY_ID`
- `SPACES_SECRET_ACCESS_KEY`

### External services

- `OPENAI_API_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `AIRBYTE_WEBHOOK_URL`

## Production rules

- Separate credentials by environment.
- Rotate secrets and document ownership.
- Restrict RPC and object-store keys by origin, network, and permission where supported.
- Do not expose server secrets to browser bundles.
- Fail closed when a required allowlist, contract address, or chain setting is absent.
