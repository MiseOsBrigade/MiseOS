# MiseOS Conversation Build Brief

This document converts the durable product requirements developed across the MiseOS project conversations into an implementation brief. It is a synthesis, not a raw chat transcript; private messages, credentials, unrelated personal information, and repetitive instructions are intentionally excluded.

## Product identity

MiseOS is a Git-native, proof-first operating system for coordinated repository operations, ethical automation, collectible character agents, visual workflow management, evidence capture, and commercial developer tooling.

Core phrase: **Everything in its place before it hits production.**

## Non-negotiable operating rule

No change is considered complete merely because code was written or pushed.

```text
Inspect -> Plan -> Execute -> Validate -> Report -> Archive Evidence
```

A merge, deployment, package release, payment activation, media publish, or token mint must have an observed working proof and a rollback path.

## Ecosystem model

- 112 canonical character cards.
- 23 registry manifests representing products, packages, SDKs, containers, workflows, schemas, analytics, policy tools, and themes.
- 135 total ecosystem objects.
- Registry products are separate from character cards.
- The current interactive character page may demonstrate a subset until the canonical roster is fully wired.

## Character card requirements

Each approved character should have:

- stable ID and slug;
- name, class, division, station, rarity, element, and lore;
- specialty, workflow responsibilities, permissions, and boundaries;
- signature move and proof gate;
- stats and traits;
- image, animation, 3D, audio, and AR media slots;
- license/rights note;
- operational agent definition;
- ERC-721-compatible metadata where minting is intended.

Character art and metadata must be generated and published separately, with previews approved before paid batch generation or minting.

## GridOps requirements

The GridOps experience should function as a multidimensional repository control board using rows, columns, tabs, layers, cards, timelines, and spatial views to represent:

- repositories and branches;
- workflows, tasks, tools, and agents;
- packages and registries;
- incidents, checks, evidence, and readiness;
- model routing and bounded autonomous execution;
- costs, permissions, risk, trust, and human approvals;
- persistent local or server-backed state;
- JSON/CSV export and import;
- an interactive visual playground suitable for GitHub Pages.

## Trust and governance

MiseOS should encode human-centered constraints including ECTI, CSM, STL, and KAQ. Agents operate under least privilege, produce evidence, expose uncertainty, and require approval for high-impact actions.

Blocked or gated actions include:

- force pushes to protected branches;
- disabling checks to obtain a green status;
- exposing secrets;
- rewriting history without approval;
- unreviewed production or billing changes;
- claiming tests or deployments succeeded without observation;
- publishing unlicensed media or placeholder token metadata.

## Repository architecture direction

```text
agents/       character and operational agent definitions
registry/     product and package manifests
workflows/    repository-safe automation flows
tools/        CLI, policy, validation, release, SBOM, trust graph
mcp/          connector definitions
webhooks/     signed event handlers
services/     auth, billing, licensing, metering, telemetry
docs/         architecture, operations, commerce, runbooks
cards/        card previews and presentation assets
metadata/     token/card metadata
media/        images, animation, 3D, audio, AR
```

## Commercial model

MiseOS is open-core:

- Community: docs, gallery, starter CLI, basic registry, demo workflows.
- Pro: hosted dashboard, repo manager, workflow linter, release-risk reports.
- Team: GitHub App, MCP connectors, policy packs, audit logs, team shifts.
- Enterprise: self-hosted runtime, SSO, compliance controls, private deployment, custom agents.

Billing must use stable internal product keys, signed webhooks, idempotent entitlement updates, environment-held secrets, sandbox testing, and explicit owner activation.

## Package and integration direction

Target adapters include Claude Code, GitHub Copilot, Cursor, Codex, OpenCode, Gemini CLI, MCP-compatible systems, Shimeji-style desktop characters, NFT metadata tooling, DigitalOcean Spaces or equivalent object storage, GitHub Apps, Cloudflare Workers, and provider-neutral billing.

## Proof-first release sequence

1. Prepare local manifests.
2. Run a small proof batch.
3. Inspect generated artifacts.
4. Validate schemas, links, paths, rights, and secrets.
5. Open a focused pull request.
6. Observe automated checks.
7. Obtain human approval.
8. Merge.
9. Deploy or publish through bounded automation.
10. Verify the live result and archive evidence.

## Immediate implementation priorities

1. Keep the README visually aligned with the trading-card brigade identity.
2. Make repository validation deterministic and dependency-light.
3. Preserve one Pages deployment workflow and validate its static artifact.
4. Wire the canonical roster into the interactive UI without conflating registry products.
5. Add schema-driven card and product catalogs.
6. Build sandbox payment and entitlement adapters before enabling live billing.
7. Add trusted package release workflows only after package manifests are finalized.
8. Store media and metadata with versioning, checksums, rights notes, and immutable release references.
