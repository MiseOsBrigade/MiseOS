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
# Spinor Spinners

> Interactive geometry for spinors, quaternions, topology, and the strange fact that some rotational systems need **720°**—not 360°—to return to their original state.

[![CI](https://github.com/OWNER/spinor-spinners/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/spinor-spinners/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/OWNER/spinor-spinners?display_name=tag)](https://github.com/OWNER/spinor-spinners/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-2ea44f.svg)](LICENSE)
[![Node 20+](https://img.shields.io/badge/Node-20%2B-339933?logo=node.js&logoColor=white)](package.json)

<!-- Replace OWNER after publishing. Add public/assets/hero.png when final artwork is available. -->

## Contents

- [Overview](#overview)
- [What the visualization shows](#what-the-visualization-shows)
- [Quick start](#quick-start)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Testing](#testing)
- [Project status](#project-status)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Overview

Spinor Spinners turns difficult mathematical ideas into a manipulable WebGL scene. The project begins with a compact generative-particle formula and expands it into a structured educational visualization containing:

- a three-dimensional particle manifold;
- three visible quaternion rotation planes;
- half-angle spinor belts that close over a `4π` cycle;
- Hopf-like linked rings as a topology metaphor;
- real-time orbit, zoom, density, depth, and trail controls.

The visualization is explanatory rather than a formal proof or physics simulator. See [docs/MATHEMATICAL_MODEL.md](docs/MATHEMATICAL_MODEL.md) for the precise scope.

## What the visualization shows

| Layer             | Visual role                  | Mathematical connection                            |
| ----------------- | ---------------------------- | -------------------------------------------------- |
| Particle manifold | Animated point cloud         | Original parametric field lifted into 3D           |
| Quaternion frame  | Three intersecting rings     | Rotation planes and orientation composition        |
| Spinor belts      | Twisted double-cycle ribbons | Half-angle behavior and the 720° return            |
| Hopf links        | Interlocked rings            | Linking, continuity, and topological relationships |

## Quick start

Requirements: Node.js 20 or newer and npm 10 or newer.

```bash
git clone https://github.com/OWNER/spinor-spinners.git
cd spinor-spinners
npm install
npm run dev
```

Open `http://localhost:5173`.

### Production build

```bash
npm run validate
npm run build
npm run preview
```

## Architecture

```text
Browser
  ├─ UI controls ───────────────┐
  └─ p5.js WebGL renderer       │
          │                     │
          ├─ particle manifold  │
          ├─ quaternion frame   ├─ shared mutable visualization config
          ├─ spinor belts       │
          └─ Hopf links ────────┘
                    │
             pure math core
        sampleParticle / spinorPoint
```

The math functions are isolated from p5.js so rotational closure and numerical stability can be tested without a browser.

- [`src/core`](src/core): pure types, defaults, and mathematical functions.
- [`src/renderers`](src/renderers): p5.js/WebGL drawing code.
- [`src/ui`](src/ui): accessible DOM controls.
- [`tests`](tests): numerical invariants and regression tests.
- [`docs`](docs): scope, architecture, math, accessibility, and release guidance.

## Configuration

Defaults live in [`src/core/config.ts`](src/core/config.ts).

```ts
export const DEFAULT_CONFIG = {
  particleCount: 9500,
  speed: Math.PI / 260,
  fieldDepth: 70,
  beltRadius: 188,
  beltWidth: 32,
  trails: true,
};
```

High particle counts can reduce frame rate on mobile hardware. Start near 4,000–8,000 points for broad device compatibility.

## Testing

```bash
npm run test          # numerical unit tests
npm run lint          # TypeScript and style rules
npm run format:check  # formatting validation
npm run build         # type-check and production bundle
npm run validate      # complete local CI sequence
```

The critical acceptance checks verify that:

1. particle coordinates remain finite near the original formula's reciprocal singularity;
2. the spinor belt returns after `4π`;
3. the same belt remains displaced after only `2π`;
4. the production bundle compiles without TypeScript errors.

## Project status

Current release line: **0.x experimental**.

The implementation is ready for public iteration, but the educational narrative, screenshot set, and optional shader renderer remain roadmap work. See [ROADMAP.md](ROADMAP.md).

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md), open an issue, and submit focused pull requests. Mathematical changes should include a written rationale and tests for the invariant being changed.

## Security

This is a client-side visualization with no account system or server component. Report dependency, build-chain, or browser security issues through the process in [SECURITY.md](SECURITY.md).

## License

Code is available under the [MIT License](LICENSE). Visual exports created with the software may be licensed separately by their creator.

## License

Copyright MiseOS. Licensing terms will be finalized before the first public package release.
