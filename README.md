# MiseOS

> A developer workflow platform that installs branded, governed automation into repositories, runs it safely, and records evidence for every execution.

This repository is the canonical implementation of the MiseOS developer release. The first production workflow is **Pull Request Guardian**.

## Release 0 scope

- PostgreSQL system of record
- Fastify API
- MiseOS CLI
- Registry and immutable versions
- Five launch actions
- Pull Request Guardian workflow
- GitHub App integration boundary
- GridOps developer dashboard
- Evidence, policy, and audit records

## Launch agents

| Agent | Operational responsibility |
|---|---|
| Repo Steward | Repository health and structure |
| Workflow Linter | Workflow validation and unsafe automation detection |
| Policy Engine | Permissions, branch rules, and approval policy |
| SBOM Indexer | Dependency inventory and software bill of materials |
| Release Sentinel | Release readiness and evidence completeness |

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm db:up
pnpm dev

# In another terminal
pnpm miseos init
pnpm miseos add workflow pull-request-guardian
```

## First workflow

```text
GitHub pull request event
  -> Developer API
  -> Pull Request Guardian
  -> Repo Steward
  -> Workflow Linter
  -> Policy Engine
  -> Evidence gate
  -> GitHub Check + GridOps
```

## Security boundary

MiseOS never stores wallet seed phrases or private keys. AI and workflow agents may prepare typed operations, but signing remains inside the user's wallet or an approved secret manager. Runtime secrets are referenced by name and injected by GitHub, Vercel, DigitalOcean, or another approved deployment platform.

See [`SECURITY.md`](SECURITY.md), [`.gitignore`](.gitignore), and [`.env.example`](.env.example) before configuring integrations.

## Repository structure

```text
apps/
  api/          Fastify developer API
  gridops/      Developer dashboard
  docs/         Documentation site
packages/
  database/     PostgreSQL schema and migrations
  registry/     Registry model and launch records
  workflow-engine/
  policy-engine/
  evidence/
  github/
  cli/
actions/
  repository-health-scan/
  workflow-lint/
  pull-request-policy/
  sbom-index/
  release-readiness/
workflows/
  pull-request-guardian/
registry/
  agents/
  actions/
  workflows/
```

## Product boundary

Release 0 deliberately excludes NFT minting, a public marketplace, token economics, the 3D GridOps world, autonomous wallet signing, and the full 300-agent expansion. Those remain frozen until an outside developer can install Pull Request Guardian and receive a reliable evidence-backed result from a real pull request.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Security](SECURITY.md)
- [Frozen roadmap](FROZEN_ROADMAP.md)
- [Implementation status](docs/IMPLEMENTATION_STATUS.md)

## License

Copyright MiseOS. Licensing terms will be finalized before the first public package release.
