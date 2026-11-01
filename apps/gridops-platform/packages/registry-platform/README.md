# MiseOS Registry Platform

A runnable control plane for the **23 MiseOS product-infrastructure registry manifests**.

> **112 character agents + 23 registry manifests = 135 MiseOS ecosystem items.**
>
> The ecosystem must never be described as 135 characters.

## What is implemented

- Canonical JSON catalog and 23 individual manifests
- JSON Schema validation and hard ecosystem-count invariants
- Executable TypeScript handler for every registry item
- Fastify REST API with security headers, rate limiting, health, catalog, lookup, and execution routes
- `miseos` CLI for list, validation, diagnostics, and capability execution
- Workspace-scoped file generation with traversal protection
- Policy, release, repository-health, workflow, SBOM, graph, analytics, attestation, theme, and package-adapter capabilities
- Unit/integration tests, Docker image, Compose, GitHub Actions CI, and GHCR publishing workflow

## Start locally

```bash
corepack enable
pnpm install
pnpm verify
pnpm dev
```

API: `http://localhost:8787`

```bash
curl http://localhost:8787/health
curl http://localhost:8787/v1/catalog
curl -X POST http://localhost:8787/v1/execute/miseos.analytics-engine \
  -H 'content-type: application/json' \
  -d '{"values":[4,8,15,16,23,42]}'
```

## CLI

```bash
pnpm miseos catalog list
pnpm miseos catalog validate
pnpm miseos doctor
pnpm miseos run miseos.repo-reliability-kit --input '{"signals":{"tests":true,"branchProtection":true}}'
```

## Architecture

```text
registry/registry-catalog.manifest.json   canonical source
registry/manifests/*.manifest.json        distributable records
packages/core                             schemas, catalog loader, runtime, 23 handlers
apps/api                                  REST control plane
apps/cli                                  operator CLI
```

The runtime maps each manifest's `runtime.handler` to a bounded implementation. It does not execute arbitrary shell commands. Generated files are confined to the selected workspace.

## Production extension points

The included capabilities are complete local implementations. Real marketplace publication, npm/NuGet/Maven/Ruby releases, GitHub repository mutation, signing-key custody, billing, and remote artifact storage require environment-specific adapters and credentials. Add those behind interfaces rather than placing secrets in manifests.

See [`docs/OPERATIONS.md`](docs/OPERATIONS.md) and [`docs/REGISTRY-CAPABILITIES.md`](docs/REGISTRY-CAPABILITIES.md).
