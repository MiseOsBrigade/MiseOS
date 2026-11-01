# Mise-OS

> The Git-native operating system for coordinated development, repo stewardship, automation, and ethical AI workflows.

**Everything in its place before it ships.**

MiseOS turns AI chaos into coordinated service: specialized agents, registry packages, repo-safe workflows, security gates, observability, and marketplace-ready DevOps tools working as one precise system.

## Correct Ecosystem Count

| Layer | Count | Meaning |
|---|---:|---|
| Character cards | 112 | Collectible brigade operators with roles, rarity, lore, departments, and workflows |
| Registry manifests | 23 | SDKs, packages, containers, schemas, policy tools, agents, workflows, analytics, and themes |
| Total ecosystem items | 135 | Full MiseOS ecosystem model |

Registry manifests are **not** character cards. They are the product/package layer of the MiseOS ecosystem.

## System Layers

```text
Mise-OS/
├── agents/              # 112 character/operator cards and self-contained agent tools
├── registry/            # 23 product/package manifests
├── workflows/           # repo-safe DevOps shift flows
├── tools/               # CLI, linter, policy engine, release engine, SBOM, trust graph
├── mcp/                 # GitHub, filesystem, Docker, Kubernetes, vector, runtime connectors
├── webhooks/            # GitHub, Stripe, Fal, Catalyst, YepCode, Quicknode events
├── services/            # SaaS API, auth, billing, licensing, usage metering, telemetry
├── docs/                # architecture, marketing, licensing, account setup, runbooks
└── cards/               # images, ERC-721 metadata, previews, minting assets
```

## Registry Catalog

See [`output/manifests/REGISTRY_CATALOG.md`](output/manifests/REGISTRY_CATALOG.md) for the canonical 23-item registry table.

## Build Commands

```bash
python miseos_art_factory_v2_single.py prepare --backend local
python miseos_art_factory_v2_single.py cards
python miseos_art_factory_v2_single.py preview
```

`prepare` now writes the character roster and registry catalog separately:

```text
output/merged_roster.json                         # character/agent roster only
output/manifests/registry_catalog_manifest.json   # registry/package manifests only
output/manifests/REGISTRY_CATALOG.md              # human-readable registry table
```

## Commercial Model

MiseOS is designed as open-core infrastructure:

- Free/community: docs, gallery, starter CLI, basic registry, demo workflows
- Pro: hosted dashboard, repo manager, workflow linter, release risk reports
- Team: GitHub App, MCP connectors, policy packs, audit logs, team shifts
- Enterprise: self-hosted runtime, SSO, compliance, private deployment, custom agents

## Signature

MiseOS / Mise Orchestra — Git-native, repo-safe automation for builders who ship with evidence.
