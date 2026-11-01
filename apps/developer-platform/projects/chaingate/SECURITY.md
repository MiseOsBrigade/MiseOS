# Security policy

## Supported versions

| Version | Supported |
|---|---:|
| `main` / unreleased alpha | Yes, best effort |
| Older snapshots | No |

ChainGate is pre-audit alpha software. Do not use it to custody keys or authorize production-value transactions.

## Reporting a vulnerability

Do not open a public issue. Use GitHub private vulnerability reporting for this repository. Include:

- affected package, contract, endpoint, or workflow
- reproduction steps or proof of concept
- impact and plausible abuse path
- affected chain, environment, and account type
- suggested mitigation when available

The maintainers will acknowledge a complete report, assess severity, coordinate remediation, and publish an advisory when appropriate. Timelines depend on severity and reproducibility; no fixed SLA is promised during alpha.

## Security boundaries

The project must never:

- request seed phrases or raw private keys
- log signatures, secrets, tokens, or full sensitive payloads
- let an AI model broadcast transactions directly
- rely on `kid`, wallet metadata, UUIDs, or explorer data as authorization
- treat unconfirmed transactions as settlement
- reuse authentication nonces
- allow a chain/account change without rebuilding the preview

## Dependency and supply-chain policy

- Lock dependencies with `pnpm-lock.yaml`.
- Review dependency changes in pull requests.
- Pin third-party GitHub Actions to immutable commit SHAs before production use.
- Enable Dependabot, CodeQL, secret scanning, and push protection.
- Generate provenance and SBOM artifacts for releases.

## Smart-contract policy

Before mainnet deployment:

- add unit, fuzz, and invariant tests
- run Slither and compiler warnings as errors
- verify source code on the target explorer
- document admin and upgrade powers
- complete independent security review
- prepare pause, rollback, and incident procedures where applicable

See [docs/threat-model.md](docs/threat-model.md).
