<div align="center">

<img src="./assets/header.svg" alt="MiseOS Universe" width="100%" />

# MiseOS Universe

**112 character agents • 300 player cards • 6 operational kitchens • 23 registry manifests • one repository**

</div>

MiseOS models software delivery as a kitchen brigade. Every character is a player card with an identity, a profile, machine-readable metadata, an operational workflow and a proof gate. This repository is the MiseOS Universe: the character registry, every player card, and the apps, tools and packages that run the brigade, in one place.

> No merge, deployment, publication, billing action, or mint without evidence.

## Contents

- [Universe map](#universe-map)
- [Player cards](#player-cards)
- [Characters](#characters)
- [Getting started](#getting-started)
- [Runtime trust model](#runtime-trust-model)
- [Repository structure](#repository-structure)

## Universe map

### Apps

| Component | Path | What it does |
|---|---|---|
| **[Brigade Gallery](./apps/brigade-gallery)** | `apps/brigade-gallery` | React gallery for the Master Roster (75) and Brigade (68) player cards with copyable `mise card run` commands. |
| **[Registry Atrium](./apps/registry-atrium)** | `apps/registry-atrium` | Interactive Three.js exhibition of the 23-card Mise Orchestra Season 1 roster with ERC-721 metadata. |
| **[Character Studio](./apps/character-studio)** | `apps/character-studio` | Clickable-character runtime and sprite-pack studio with signed manifests. |
| **[Voxel World](./apps/voxel-world)** | `apps/voxel-world` | Browser-playable 3D voxel world populated from the 135-item MiseOS ecosystem. |
| **[4D Playground](./apps/4d-playground)** | `apps/4d-playground` | React Three Fiber visualisation of the Mise-en-place Knowledge SheetGrid. |
| **[MCP Foundry](./apps/mcp-foundry)** | `apps/mcp-foundry` | Human-gated agent control plane: micro-agents, MCP tool binding, card memory and evidence receipts. |
| **[MCP Foundry (TS variant)](./apps/mcp-foundry-ts)** | `apps/mcp-foundry-ts` | TypeScript variant of the Foundry with `src/` runtime and verification lab. |
| **[Dev ID](./apps/dev-id)** | `apps/dev-id` | Developer identity and fail-closed authorization service. |
| **[Brigade Steward](./apps/brigade-steward)** | `apps/brigade-steward` | Mise Brigade de Repo — repository steward workflows and the brand kit. |
| **[Developer Platform](./apps/developer-platform)** | `apps/developer-platform` | Release 0 developer platform: API, CLI, registry, Pull Request Guardian, Shimeji Brigade sprites. |
| **[Registry Platform](./apps/registry-platform)** | `apps/registry-platform` | Runnable control plane for the 23 registry manifests (API, CLI, core). |
| **[Bootstrap Registry](./apps/bootstrap-registry)** | `apps/bootstrap-registry` | Bootstrap registry and card gallery for packages, containers, workflows and releases. |
| **[GridOps Platform](./apps/gridops-platform)** | `apps/gridops-platform` | GridOps playground foundation: metrics, dashboards, policies. |
| **[Metric Workflow](./apps/metric-workflow)** | `apps/metric-workflow` | Metric registry, signed manifests and workflow API with dashboard. |
| **[MiseOS Platform & Website](./apps/miseos-platform)** | `apps/miseos-platform` | Website, GridOps, Lineage Editor, FileOps console, contracts and registry card pages. |
| **[DevOps Orchestra](./apps/devops-orchestra)** | `apps/devops-orchestra` | Full-stack Mise Orchestra DevOps app (client + server). |
| **[Mint Playground](./apps/mint-playground)** | `apps/mint-playground` | Three.js mint experiences. |

### Tools

| Component | Path | What it does |
|---|---|---|
| **[Mise PR](./tools/mise-pr)** | `tools/mise-pr` | GitHub Action that checks review readiness before code review (Python). |
| **[Salt Shakers](./tools/salt-shakers)** | `tools/salt-shakers` | Universal, language-aware Actions workflow (Python). |
| **[Repo Pet](./tools/repo-pet)** | `tools/repo-pet` | Repository mascot that roams repos and containers. |
| **[Commis System](./tools/commis-system)** | `tools/commis-system` | Secure intake for zipped project bundles. |
| **[Mise-en-Preplist](./tools/preplist)** | `tools/preplist` | Branded repository template and prep-list kit. |
| **[GPU Pack-a-Punch](./tools/gpu-pack-a-punch)** | `tools/gpu-pack-a-punch` | Reusable Actions stack: risk gates, supply chain, optional GPU lanes. |
| **[DevOps Foundry](./tools/devops-foundry)** | `tools/devops-foundry` | Normalized CI/CD and DevOps toolkit. |
| **[ChainGate](./tools/chaingate)** | `tools/chaingate` | Multichain authorization and provenance framework. |
| **[Token Permission RPC](./tools/token-permission-rpc)** | `tools/token-permission-rpc` | Wallet execution-permission request reference flow. |
| **[GCP Lazy Minting](./tools/gcp-lazy-minting)** | `tools/gcp-lazy-minting` | Card image/metadata hosting and EIP-712 lazy-mint vouchers on Google Cloud. |
| **[Droplet Kit](./tools/droplet-kit)** | `tools/droplet-kit` | First-boot automation for the Character Intelligence Core on DigitalOcean. |
| **[GitHub Agent Kit](./tools/github-agent-kit)** | `tools/github-agent-kit` | Guarded GitHub automation agent environment. |
| **[Security Guardrails](./tools/security-guardrails)** | `tools/security-guardrails` | Hardening scaffold against prompt injection and untrusted content. |
| **[Repo Reliability Kit](./tools/repo-reliability-kit)** | `tools/repo-reliability-kit` | Drop-in CI and dependency-safety kit for six languages. |
| **[Art Factory](./tools/art-factory)** | `tools/art-factory` | Card, sprite-sheet and ERC-721 metadata renderer (Python). |
| **[MicroLink A2A](./tools/microlink-a2a)** | `tools/microlink-a2a` | Reference design for authenticated agent-to-agent chip links (Python). |
| **[Shimeji Mint](./tools/shimeji-mint)** | `tools/shimeji-mint` | Shimeji mint starter. |

### Packages

| Component | Path | What it does |
|---|---|---|
| **[card-schema](./packages/card-schema)** | `packages/card-schema` | Player/character card schema. |
| **[catalog](./packages/catalog)** | `packages/catalog` | Catalog utilities. |
| **[profile-generator](./packages/profile-generator)** | `packages/profile-generator` | Profile SVG generator. |
| **[mise-config](./packages/mise-config)** | `packages/mise-config` | `mise.yaml` schema, repo detection and renderer. |

### Registry, data and standards

| Path | Contents |
|---|---|
| [`characters/`](./characters) | 112 character profiles (`README.md` + `metadata.json`) |
| [`data/`](./data) | `characters.json`, `miseos-ecosystem-135.json`, `player-cards.json`, and roster imports in `data/imports/` (300-agent master inventory, Orchestra cards, metric registry) |
| [`integrations/stripe-app`](./integrations/stripe-app) | Commerce dashboard integration |
| [`standards/aid1`](./standards/aid1) | AID-1 standard |
| [`docs/`](./docs) | Commerce, Canon Bible v1.0, recipe knowledge sheet |

## Player cards

300 unique player cards across 8 collections. Each thumbnail opens the full card; cards matched to a registry character link to that character in [`data/player-cards.json`](./data/player-cards.json).

<details open>
<summary><b>Long Cards</b> — 43 cards (2 matched to characters)</summary>

<p>
<a href="./assets/player-cards/long-cards/plate-inspector.webp"><img src="./assets/player-cards/long-cards/thumbs/plate-inspector.webp" alt="Plate Inspector" title="Plate Inspector" width="120" /></a>
<a href="./assets/player-cards/long-cards/keeperofhistory-guardianofintegrity.webp"><img src="./assets/player-cards/long-cards/thumbs/keeperofhistory-guardianofintegrity.webp" alt="KEEPEROFHISTORY.GUARDIANOFINTEGRITY" title="KEEPEROFHISTORY.GUARDIANOFINTEGRITY" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseosreleasesentinel.webp"><img src="./assets/player-cards/long-cards/thumbs/miseosreleasesentinel.webp" alt="MISEOSRELEASESENTINEL" title="MISEOSRELEASESENTINEL" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-docs-builder.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-docs-builder.webp" alt="MiseOS Docs Builder" title="MiseOS Docs Builder" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-conductor-prime.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-conductor-prime.webp" alt="MiseOS Conductor Prime" title="MiseOS Conductor Prime" width="120" /></a>
<a href="./assets/player-cards/long-cards/cold-zero.webp"><img src="./assets/player-cards/long-cards/thumbs/cold-zero.webp" alt="Cold Zero" title="Cold Zero" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos.webp" alt="Miseos" title="Miseos" width="120" /></a>
<a href="./assets/player-cards/long-cards/resilience-ryu.webp"><img src="./assets/player-cards/long-cards/thumbs/resilience-ryu.webp" alt="Resilience Ryu" title="Resilience Ryu" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-maven-policy-adapter.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-maven-policy-adapter.webp" alt="MiseOS Maven Policy Adapter" title="MiseOS Maven Policy Adapter" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-repo-pet.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-repo-pet.webp" alt="MiseOS Repo Pet" title="MiseOS Repo Pet" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-attestation-gate.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-attestation-gate.webp" alt="MiseOS Attestation Gate" title="MiseOS Attestation Gate" width="120" /></a>
<a href="./assets/player-cards/long-cards/thunder-surge.webp"><img src="./assets/player-cards/long-cards/thumbs/thunder-surge.webp" alt="Thunder Surge" title="Thunder Surge" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseosnugetclient.webp"><img src="./assets/player-cards/long-cards/thumbs/miseosnugetclient.webp" alt="MiseOSNuGetClient" title="MiseOSNuGetClient" width="120" /></a>
<a href="./assets/player-cards/long-cards/ultra-mythic.webp"><img src="./assets/player-cards/long-cards/thumbs/ultra-mythic.webp" alt="ULTRA MYTHIC" title="ULTRA MYTHIC" width="120" /></a>
<a href="./assets/player-cards/long-cards/whisper.webp"><img src="./assets/player-cards/long-cards/thumbs/whisper.webp" alt="Whisper" title="Whisper" width="120" /></a>
<a href="./assets/player-cards/long-cards/sigstore.webp"><img src="./assets/player-cards/long-cards/thumbs/sigstore.webp" alt="SIGSTORE" title="SIGSTORE" width="120" /></a>
<a href="./assets/player-cards/long-cards/ultramythic.webp"><img src="./assets/player-cards/long-cards/thumbs/ultramythic.webp" alt="ULTRAMYTHIC" title="ULTRAMYTHIC" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-workflow-linter.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-workflow-linter.webp" alt="MISEOS WORKFLOW LINTER" title="MISEOS WORKFLOW LINTER" width="120" /></a>
<a href="./assets/player-cards/long-cards/mise-orchestra-theme.webp"><img src="./assets/player-cards/long-cards/thumbs/mise-orchestra-theme.webp" alt="Mise Orchestra Theme" title="Mise Orchestra Theme" width="120" /></a>
<a href="./assets/player-cards/long-cards/runner.webp"><img src="./assets/player-cards/long-cards/thumbs/runner.webp" alt="RUNNER" title="RUNNER" width="120" /></a>
<a href="./assets/player-cards/long-cards/15-80.webp"><img src="./assets/player-cards/long-cards/thumbs/15-80.webp" alt="15/80" title="15/80" width="120" /></a>
<a href="./assets/player-cards/long-cards/sauce-sage.webp"><img src="./assets/player-cards/long-cards/thumbs/sauce-sage.webp" alt="Sauce Sage" title="Sauce Sage" width="120" /></a>
<a href="./assets/player-cards/long-cards/agent-sdk.webp"><img src="./assets/player-cards/long-cards/thumbs/agent-sdk.webp" alt="Agent SDK" title="Agent SDK" width="120" /></a>
<a href="./assets/player-cards/long-cards/i-am-the-will-that-governs-all-action.webp"><img src="./assets/player-cards/long-cards/thumbs/i-am-the-will-that-governs-all-action.webp" alt="I AM THE WILL THAT GOVERNS ALL ACTION" title="I AM THE WILL THAT GOVERNS ALL ACTION" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-docs-hub-template.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-docs-hub-template.webp" alt="MiseOS Docs Hub Template" title="MiseOS Docs Hub Template" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-maven-policy-adapter-2.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-maven-policy-adapter-2.webp" alt="MiseOS Maven Policy Adapter" title="MiseOS Maven Policy Adapter" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-policy-checker.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-policy-checker.webp" alt="MiseOS Policy Checker" title="MiseOS Policy Checker" width="120" /></a>
<a href="./assets/player-cards/long-cards/pan-phantom.webp"><img src="./assets/player-cards/long-cards/thumbs/pan-phantom.webp" alt="Pan Phantom" title="Pan Phantom" width="120" /></a>
<a href="./assets/player-cards/long-cards/butcher-blade.webp"><img src="./assets/player-cards/long-cards/thumbs/butcher-blade.webp" alt="Butcher Blade" title="Butcher Blade" width="120" /></a>
<a href="./assets/player-cards/long-cards/packaged-for-infinity-built-for-synergy.webp"><img src="./assets/player-cards/long-cards/thumbs/packaged-for-infinity-built-for-synergy.webp" alt="Packaged for infinity.Built for synergy." title="Packaged for infinity.Built for synergy." width="120" /></a>
<a href="./assets/player-cards/long-cards/zen-plater.webp"><img src="./assets/player-cards/long-cards/thumbs/zen-plater.webp" alt="Zen Plater" title="Zen Plater" width="120" /></a>
<a href="./assets/player-cards/long-cards/keeperofhistory-guardian-ofintegrity.webp"><img src="./assets/player-cards/long-cards/thumbs/keeperofhistory-guardian-ofintegrity.webp" alt="KEEPEROFHISTORY.GUARDIAN OFINTEGRITY." title="KEEPEROFHISTORY.GUARDIAN OFINTEGRITY." width="120" /></a>
<a href="./assets/player-cards/long-cards/mise-orchestra-theme-2.webp"><img src="./assets/player-cards/long-cards/thumbs/mise-orchestra-theme-2.webp" alt="Mise Orchestra Theme" title="Mise Orchestra Theme" width="120" /></a>
<a href="./assets/player-cards/long-cards/spice-alchemist.webp"><img src="./assets/player-cards/long-cards/thumbs/spice-alchemist.webp" alt="Spice Alchemist" title="Spice Alchemist" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-release-sentinel.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-release-sentinel.webp" alt="MISEOS RELEASE SENTINEL" title="MISEOS RELEASE SENTINEL" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-gradle-plugin.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-gradle-plugin.webp" alt="MiseOS Gradle Plugin" title="MiseOS Gradle Plugin" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-repo-pet-2.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-repo-pet-2.webp" alt="MiseOS Repo Pet" title="MiseOS Repo Pet" width="120" /></a>
<a href="./assets/player-cards/long-cards/knead-guardian.webp"><img src="./assets/player-cards/long-cards/thumbs/knead-guardian.webp" alt="Knead Guardian" title="Knead Guardian" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-cli.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-cli.webp" alt="MiseOS CLI" title="MiseOS CLI" width="120" /></a>
<a href="./assets/player-cards/long-cards/byte.webp"><img src="./assets/player-cards/long-cards/thumbs/byte.webp" alt="Byte" title="Byte" width="120" /></a>
<a href="./assets/player-cards/long-cards/d446f048-3fbc-41b8-ada0-a36127e03f15.webp"><img src="./assets/player-cards/long-cards/thumbs/d446f048-3fbc-41b8-ada0-a36127e03f15.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/long-cards/char-coach.webp"><img src="./assets/player-cards/long-cards/thumbs/char-coach.webp" alt="Char Coach" title="Char Coach" width="120" /></a>
<a href="./assets/player-cards/long-cards/miseos-analytics-engine.webp"><img src="./assets/player-cards/long-cards/thumbs/miseos-analytics-engine.webp" alt="MiseOS Analytics Engine" title="MiseOS Analytics Engine" width="120" /></a>
</p>

</details>

<details open>
<summary><b>1×1 Chefs</b> — 113 cards (53 matched to characters)</summary>

<p>
<a href="./assets/player-cards/1by1-chefs/felix-rollback.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/felix-rollback.webp" alt="Felix Rollback" title="Felix Rollback" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/plating-poet.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/plating-poet.webp" alt="Plating Poet" title="Plating Poet" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/gatekeeper.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/gatekeeper.webp" alt="Gatekeeper" title="Gatekeeper" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/flavor-forager.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/flavor-forager.webp" alt="Flavor Forager" title="Flavor Forager" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/sre-chef.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/sre-chef.webp" alt="SRE Chef" title="SRE Chef" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/ladle-lumen.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/ladle-lumen.webp" alt="Ladle Lumen" title="Ladle Lumen" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/cost-kaito.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/cost-kaito.webp" alt="Cost Kaito" title="Cost Kaito" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/streama.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/streama.webp" alt="Streama" title="Streama" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/acore.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/acore.webp" alt="aCore" title="aCore" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/flash-riku.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/flash-riku.webp" alt="Flash Riku" title="Flash Riku" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/energy-keeper.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/energy-keeper.webp" alt="Energy Keeper" title="Energy Keeper" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/dispatcher.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/dispatcher.webp" alt="Dispatcher" title="Dispatcher" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/orderly-owl.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/orderly-owl.webp" alt="Orderly Owl" title="Orderly Owl" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/reviewer.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/reviewer.webp" alt="Reviewer" title="Reviewer" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/schema-sora.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/schema-sora.webp" alt="Schema Sora" title="Schema Sora" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/sanitation-star.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/sanitation-star.webp" alt="Sanitation Star" title="Sanitation Star" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/doc-writer.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/doc-writer.webp" alt="Doc Writer" title="Doc Writer" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/ledger-ladle.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/ledger-ladle.webp" alt="Ledger Ladle" title="Ledger Ladle" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/iron-hashi.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/iron-hashi.webp" alt="Iron Hashi" title="Iron Hashi" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/pickle-doc.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/pickle-doc.webp" alt="Pickle Doc" title="Pickle Doc" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/compliance.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/compliance.webp" alt="Compliance" title="Compliance" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/ticket-tactician.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/ticket-tactician.webp" alt="Ticket Tactician" title="Ticket Tactician" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/merge-sentinel.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/merge-sentinel.webp" alt="Merge Sentinel" title="Merge Sentinel" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/zest.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/zest.webp" alt="Zest" title="Zest" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/cacao-alchemist.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/cacao-alchemist.webp" alt="Cacao Alchemist" title="Cacao Alchemist" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/velvet-vesper.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/velvet-vesper.webp" alt="Velvet Vesper" title="Velvet Vesper" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/tariq-notesmith.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/tariq-notesmith.webp" alt="Tariq Notesmith" title="Tariq Notesmith" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/umami-seeker.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/umami-seeker.webp" alt="Umami Seeker" title="Umami Seeker" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/release-conductor.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/release-conductor.webp" alt="Release Conductor" title="Release Conductor" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/hugo-matrix.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/hugo-matrix.webp" alt="Hugo Matrix" title="Hugo Matrix" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/conductor.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/conductor.webp" alt="Conductor" title="Conductor" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/ux-chef.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/ux-chef.webp" alt="UX Chef" title="UX Chef" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/allergen-oracle.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/allergen-oracle.webp" alt="Allergen Oracle" title="Allergen Oracle" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/scorecard-shin.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/scorecard-shin.webp" alt="Scorecard Shin" title="Scorecard Shin" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/pantry-paladin.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/pantry-paladin.webp" alt="Pantry Paladin" title="Pantry Paladin" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/ashen-one.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/ashen-one.webp" alt="Ashen One" title="Ashen One" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/nudge-neko.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/nudge-neko.webp" alt="Nudge Neko" title="Nudge Neko" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/mizu.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/mizu.webp" alt="Mizu" title="Mizu" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/garnish-ghost.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/garnish-ghost.webp" alt="Garnish Ghost" title="Garnish Ghost" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/reserve.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/reserve.webp" alt="Reserve" title="Reserve" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/security-auditor.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/security-auditor.webp" alt="Security Auditor" title="Security Auditor" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/roast-commander.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/roast-commander.webp" alt="Roast Commander" title="Roast Commander" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/scale-oni.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/scale-oni.webp" alt="Scale Oni" title="Scale Oni" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/ivun-cache.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/ivun-cache.webp" alt="Ivun Cache" title="Ivun Cache" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/coder.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/coder.webp" alt="Coder" title="Coder" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/encryptor.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/encryptor.webp" alt="Encryptor" title="Encryptor" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/vesper.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/vesper.webp" alt="Vesper" title="Vesper" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/evidence-scribe.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/evidence-scribe.webp" alt="Evidence Scribe" title="Evidence Scribe" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/brine-baron.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/brine-baron.webp" alt="Brine Baron" title="Brine Baron" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/guardrail-goro.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/guardrail-goro.webp" alt="Guardrail Goro" title="Guardrail Goro" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/shift-sentinel.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/shift-sentinel.webp" alt="Shift Sentinel" title="Shift Sentinel" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/sweet-architect.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/sweet-architect.webp" alt="Sweet Architect." title="Sweet Architect." width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/umami-code.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/umami-code.webp" alt="Umami Code" title="Umami Code" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/yume.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/yume.webp" alt="Yume" title="Yume" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/kaji.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/kaji.webp" alt="Kaji" title="Kaji" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/crate-courier.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/crate-courier.webp" alt="Crate Courier" title="Crate Courier" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/broth-scholar.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/broth-scholar.webp" alt="Broth Scholar" title="Broth Scholar" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/preview.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/preview.webp" alt="Preview" title="Preview" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/swarmer.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/swarmer.webp" alt="Swarmer" title="Swarmer" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/anomaly-aki.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/anomaly-aki.webp" alt="Anomaly Aki" title="Anomaly Aki" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/legacy.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/legacy.webp" alt="Legacy" title="Legacy" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/dora-daichi.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/dora-daichi.webp" alt="DORA Daichi" title="DORA Daichi" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/tester.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/tester.webp" alt="Tester" title="Tester" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/miso-maven.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/miso-maven.webp" alt="Miso Maven" title="Miso Maven" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/slicer-swift.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/slicer-swift.webp" alt="Slicer Swift" title="Slicer Swift" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/sear-samurai.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/sear-samurai.webp" alt="Sear Samurai" title="Sear Samurai" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/pulse-captain.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/pulse-captain.webp" alt="Pulse Captain" title="Pulse Captain" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/queue.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/queue.webp" alt="Queue" title="Queue" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/devrel.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/devrel.webp" alt="DevRel" title="DevRel" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/runtime-riku.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/runtime-riku.webp" alt="Runtime Riku" title="Runtime Riku" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/incident-kitsune.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/incident-kitsune.webp" alt="Incident Kitsune" title="Incident Kitsune" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/grafana-mei.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/grafana-mei.webp" alt="Grafana Mei" title="Grafana Mei" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/human-liaison.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/human-liaison.webp" alt="Human Liaison" title="Human Liaison" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/scheduler.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/scheduler.webp" alt="Scheduler" title="Scheduler" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/garnish-ghost-2.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/garnish-ghost-2.webp" alt="Garnish Ghost" title="Garnish Ghost" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/glaze-whisperer.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/glaze-whisperer.webp" alt="Glaze Whisperer" title="Glaze Whisperer" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/recipe-ranger.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/recipe-ranger.webp" alt="Recipe Ranger" title="Recipe Ranger" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/portal-rei.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/portal-rei.webp" alt="Portal Rei" title="Portal Rei" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/pen-tester.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/pen-tester.webp" alt="Pen Tester" title="Pen Tester" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/no-waste-ninja.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/no-waste-ninja.webp" alt="No-Waste Ninja" title="No-Waste Ninja" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/kitchen-conductor.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/kitchen-conductor.webp" alt="Kitchen Conductor" title="Kitchen Conductor" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/build-kun.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/build-kun.webp" alt="Build-Kun" title="Build-Kun" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/architect.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/architect.webp" alt="Architect" title="Architect" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/harvest-hex.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/harvest-hex.webp" alt="Harvest Hex" title="Harvest Hex" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/stock-sage.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/stock-sage.webp" alt="Stock Sage" title="Stock Sage" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/oil-oracle.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/oil-oracle.webp" alt="Oil Oracle" title="Oil Oracle" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/nina-promoter.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/nina-promoter.webp" alt="Nina Promoter" title="Nina Promoter" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/token-toshi.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/token-toshi.webp" alt="Token Toshi" title="Token Toshi" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/kuro-guard.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/kuro-guard.webp" alt="Kuro Guard" title="Kuro Guard" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/shift-sentinel-2.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/shift-sentinel-2.webp" alt="Shift Sentinel" title="Shift Sentinel" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/temp-tamer.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/temp-tamer.webp" alt="Temp Tamer" title="Temp Tamer" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/cve-kumo.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/cve-kumo.webp" alt="CVE Kumo" title="CVE Kumo" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/scale-oni-2.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/scale-oni-2.webp" alt="Scale Oni" title="Scale Oni" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/prep-pulse.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/prep-pulse.webp" alt="Prep Pulse" title="Prep Pulse" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/herb-whisperer.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/herb-whisperer.webp" alt="Herb Whisperer" title="Herb Whisperer" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/kurogami-senpai.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/kurogami-senpai.webp" alt="Kurogami Senpai" title="Kurogami Senpai" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/fermenta.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/fermenta.webp" alt="Fermenta" title="Fermenta" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/crisp-master.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/crisp-master.webp" alt="Crisp Master" title="Crisp Master" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/beacon-broil.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/beacon-broil.webp" alt="Beacon Broil" title="Beacon Broil" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/timer-tactician.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/timer-tactician.webp" alt="Timer Tactician" title="Timer Tactician" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/plate-inspector.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/plate-inspector.webp" alt="Plate Inspector" title="Plate Inspector" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/sear-samurai-2.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/sear-samurai-2.webp" alt="Sear Samurai" title="Sear Samurai" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/grain-guardian.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/grain-guardian.webp" alt="Grain Guardian" title="Grain Guardian" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/flavor-scribe.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/flavor-scribe.webp" alt="Flavor Scribe" title="Flavor Scribe" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/menu-maestro.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/menu-maestro.webp" alt="Menu Maestro" title="Menu Maestro" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/null-chan.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/null-chan.webp" alt="Null-chan" title="Null-chan" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/firewall.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/firewall.webp" alt="Firewall" title="Firewall" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/smoke-monk.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/smoke-monk.webp" alt="Smoke Monk" title="Smoke Monk" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/supply-scout.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/supply-scout.webp" alt="Supply Scout" title="Supply Scout" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/seira.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/seira.webp" alt="Seira" title="Seira" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/kombu-keeper.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/kombu-keeper.webp" alt="Kombu Keeper" title="Kombu Keeper" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/virtuoso.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/virtuoso.webp" alt="Virtuoso" title="Virtuoso" width="120" /></a>
<a href="./assets/player-cards/1by1-chefs/portion-paladin.webp"><img src="./assets/player-cards/1by1-chefs/thumbs/portion-paladin.webp" alt="Portion Paladin" title="Portion Paladin" width="120" /></a>
</p>

</details>

<details>
<summary><b>Cartoon Chefs</b> — 75 cards (1 matched to characters)</summary>

<p>
<a href="./assets/player-cards/cartoon-chefs/img_5929.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5929.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5930.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5930.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5931.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5931.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5932.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5932.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5933.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5933.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5934.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5934.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5935.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5935.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5936.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5936.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5937.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5937.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5938.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5938.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5939.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5939.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/kaji.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/kaji.webp" alt="Kaji" title="Kaji" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5942.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5942.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5943.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5943.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5944-2.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5944-2.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5945.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5945.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5946.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5946.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5947.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5947.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5948.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5948.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5949.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5949.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5950.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5950.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5951.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5951.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5952.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5952.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5953.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5953.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5954.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5954.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5955.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5955.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5956.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5956.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5957.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5957.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5958.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5958.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5959.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5959.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5960.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5960.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5961.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5961.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5962.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5962.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5963.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5963.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5964.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5964.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5965.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5965.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5966.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5966.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5967.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5967.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5968.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5968.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5969.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5969.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5970.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5970.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5971.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5971.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5972.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5972.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5973.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5973.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5974.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5974.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5975.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5975.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5976.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5976.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5977.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5977.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5978.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5978.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5979.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5979.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5980.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5980.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5981.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5981.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5982.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5982.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5983.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5983.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5984.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5984.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5985.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5985.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5986.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5986.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5987.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5987.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5988.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5988.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5989.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5989.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5990.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5990.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5991.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5991.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5992.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5992.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5993.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5993.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5994.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5994.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5995.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5995.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5996.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5996.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5997.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5997.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5998.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5998.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_5999.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5999.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_6001.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_6001.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_6002.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_6002.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_6003.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_6003.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_6004.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_6004.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/cartoon-chefs/img_6005.webp"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_6005.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
</p>

</details>

<details>
<summary><b>Character Building Theme</b> — 18 cards (9 matched to characters)</summary>

<p>
<a href="./assets/player-cards/character-building/canary-taster.webp"><img src="./assets/player-cards/character-building/thumbs/canary-taster.webp" alt="Canary Taster" title="Canary Taster" width="120" /></a>
<a href="./assets/player-cards/character-building/build-kun.webp"><img src="./assets/player-cards/character-building/thumbs/build-kun.webp" alt="Build-Kun" title="Build-Kun" width="120" /></a>
<a href="./assets/player-cards/character-building/orchestra-core.webp"><img src="./assets/player-cards/character-building/thumbs/orchestra-core.webp" alt="Orchestra Core" title="Orchestra Core" width="120" /></a>
<a href="./assets/player-cards/character-building/seira.webp"><img src="./assets/player-cards/character-building/thumbs/seira.webp" alt="Seira" title="Seira" width="120" /></a>
<a href="./assets/player-cards/character-building/harmonyvs-entropy.webp"><img src="./assets/player-cards/character-building/thumbs/harmonyvs-entropy.webp" alt="Harmonyvs.Entropy" title="Harmonyvs.Entropy" width="120" /></a>
<a href="./assets/player-cards/character-building/miseos.webp"><img src="./assets/player-cards/character-building/thumbs/miseos.webp" alt="MiseOs" title="MiseOs" width="120" /></a>
<a href="./assets/player-cards/character-building/miseos-2.webp"><img src="./assets/player-cards/character-building/thumbs/miseos-2.webp" alt="MiseOs" title="MiseOs" width="120" /></a>
<a href="./assets/player-cards/character-building/italiay.webp"><img src="./assets/player-cards/character-building/thumbs/italiay.webp" alt="Italiay" title="Italiay" width="120" /></a>
<a href="./assets/player-cards/character-building/lattice.webp"><img src="./assets/player-cards/character-building/thumbs/lattice.webp" alt="Lattice" title="Lattice" width="120" /></a>
<a href="./assets/player-cards/character-building/mise.webp"><img src="./assets/player-cards/character-building/thumbs/mise.webp" alt="MISE" title="MISE" width="120" /></a>
<a href="./assets/player-cards/character-building/lattice-2.webp"><img src="./assets/player-cards/character-building/thumbs/lattice-2.webp" alt="Lattice" title="Lattice" width="120" /></a>
<a href="./assets/player-cards/character-building/specialist-tier.webp"><img src="./assets/player-cards/character-building/thumbs/specialist-tier.webp" alt="Specialist Tier" title="Specialist Tier" width="120" /></a>
<a href="./assets/player-cards/character-building/prepare.webp"><img src="./assets/player-cards/character-building/thumbs/prepare.webp" alt="Mizu" title="Mizu" width="120" /></a>
<a href="./assets/player-cards/character-building/img_4556.webp"><img src="./assets/player-cards/character-building/thumbs/img_4556.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/character-building/orchestra-core-2.webp"><img src="./assets/player-cards/character-building/thumbs/orchestra-core-2.webp" alt="Orchestra Core" title="Orchestra Core" width="120" /></a>
<a href="./assets/player-cards/character-building/data-lnsights.webp"><img src="./assets/player-cards/character-building/thumbs/data-lnsights.webp" alt="Data/lnsights" title="Data/lnsights" width="120" /></a>
<a href="./assets/player-cards/character-building/release-conductor.webp"><img src="./assets/player-cards/character-building/thumbs/release-conductor.webp" alt="Release Conductor" title="Release Conductor" width="120" /></a>
<a href="./assets/player-cards/character-building/focus.webp"><img src="./assets/player-cards/character-building/thumbs/focus.webp" alt="Focus:" title="Focus:" width="120" /></a>
</p>

</details>

<details>
<summary><b>Mise Orchestra Trading Cards (Season 1)</b> — 23 cards (23 matched to characters)</summary>

<p>
<a href="./assets/player-cards/orchestra-trading-cards/kurogami-senpai.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/kurogami-senpai.webp" alt="Kurogami Senpai" title="Kurogami Senpai" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/tensho.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/tensho.webp" alt="Tensho" title="Tensho" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/mizu.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/mizu.webp" alt="Mizu" title="Mizu" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/umami-code.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/umami-code.webp" alt="Umami Code" title="Umami Code" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/kaji.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/kaji.webp" alt="Kaji" title="Kaji" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/yume.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/yume.webp" alt="Yume" title="Yume" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/iron-hashi.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/iron-hashi.webp" alt="Iron Hashi" title="Iron Hashi" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/null-chan.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/null-chan.webp" alt="Null-chan" title="Null-chan" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/flash-riku.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/flash-riku.webp" alt="Flash Riku" title="Flash Riku" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/seira.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/seira.webp" alt="Seira" title="Seira" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/kuro-guard.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/kuro-guard.webp" alt="Kuro Guard" title="Kuro Guard" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/scale-oni.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/scale-oni.webp" alt="Scale Oni" title="Scale Oni" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/build-kun.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/build-kun.webp" alt="Build-Kun" title="Build-Kun" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/streama.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/streama.webp" alt="Streama" title="Streama" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/orchestra-core.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/orchestra-core.webp" alt="Orchestra Core" title="Orchestra Core" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/canary-taster.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/canary-taster.webp" alt="Canary Taster" title="Canary Taster" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/metrics-miko.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/metrics-miko.webp" alt="Metrics Miko" title="Metrics Miko" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/slo-sage.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/slo-sage.webp" alt="SLO Sage" title="SLO Sage" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/data-chan.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/data-chan.webp" alt="Data Chan" title="Data Chan" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/insight-sensei.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/insight-sensei.webp" alt="Insight Sensei" title="Insight Sensei" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/chaos-analyst.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/chaos-analyst.webp" alt="Chaos Analyst" title="Chaos Analyst" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/growth-guru.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/growth-guru.webp" alt="Growth Guru" title="Growth Guru" width="120" /></a>
<a href="./assets/player-cards/orchestra-trading-cards/culture-chef.webp"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/culture-chef.webp" alt="Culture Chef" title="Culture Chef" width="120" /></a>
</p>

</details>

<details>
<summary><b>Final Roster</b> — 1 cards (0 matched to characters)</summary>

<p>
<a href="./assets/player-cards/final-roster/flavor-hacker.webp"><img src="./assets/player-cards/final-roster/thumbs/flavor-hacker.webp" alt="Flavor Hacker" title="Flavor Hacker" width="120" /></a>
</p>

</details>

<details>
<summary><b>Registry Catalogue Pages</b> — 3 cards (2 matched to characters)</summary>

<p>
<a href="./assets/player-cards/registry-pages/allergen-oracle.webp"><img src="./assets/player-cards/registry-pages/thumbs/allergen-oracle.webp" alt="Allergen Oracle" title="Allergen Oracle" width="120" /></a>
<a href="./assets/player-cards/registry-pages/sear-samurai.webp"><img src="./assets/player-cards/registry-pages/thumbs/sear-samurai.webp" alt="Sear Samurai" title="Sear Samurai" width="120" /></a>
<a href="./assets/player-cards/registry-pages/nudge-neko.webp"><img src="./assets/player-cards/registry-pages/thumbs/nudge-neko.webp" alt="Nudge Neko" title="Nudge Neko" width="120" /></a>
</p>

</details>

<details>
<summary><b>Studio Art & Screens</b> — 24 cards (9 matched to characters)</summary>

<p>
<a href="./assets/player-cards/icloud-screens/tensho.webp"><img src="./assets/player-cards/icloud-screens/thumbs/tensho.webp" alt="Tensho" title="Tensho" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/fork-fable.webp"><img src="./assets/player-cards/icloud-screens/thumbs/fork-fable.webp" alt="Fork Fable" title="Fork Fable" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/iron-hashi.webp"><img src="./assets/player-cards/icloud-screens/thumbs/iron-hashi.webp" alt="Iron Hashi" title="Iron Hashi" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/mise.webp"><img src="./assets/player-cards/icloud-screens/thumbs/mise.webp" alt="MISE" title="MISE" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/8309bbe1-e173-43bc-9cbb-bb510b648f67.webp"><img src="./assets/player-cards/icloud-screens/thumbs/8309bbe1-e173-43bc-9cbb-bb510b648f67.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/miseos.webp"><img src="./assets/player-cards/icloud-screens/thumbs/miseos.webp" alt="@miseos" title="@miseos" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/kuro-guard.webp"><img src="./assets/player-cards/icloud-screens/thumbs/kuro-guard.webp" alt="Kuro Guard" title="Kuro Guard" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/miseorchestra.webp"><img src="./assets/player-cards/icloud-screens/thumbs/miseorchestra.webp" alt="MISEORCHESTRA" title="MISEORCHESTRA" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/v1-0-0.webp"><img src="./assets/player-cards/icloud-screens/thumbs/v1-0-0.webp" alt="v1.0.0" title="v1.0.0" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/token-taro.webp"><img src="./assets/player-cards/icloud-screens/thumbs/token-taro.webp" alt="Token Taro" title="Token Taro" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/kaji.webp"><img src="./assets/player-cards/icloud-screens/thumbs/kaji.webp" alt="Kaji" title="Kaji" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/frostbyte.webp"><img src="./assets/player-cards/icloud-screens/thumbs/frostbyte.webp" alt="Frostbyte" title="Frostbyte" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/kurogami-senpai.webp"><img src="./assets/player-cards/icloud-screens/thumbs/kurogami-senpai.webp" alt="Kurogami Senpai" title="Kurogami Senpai" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/one-kitchen-many-spirits.webp"><img src="./assets/player-cards/icloud-screens/thumbs/one-kitchen-many-spirits.webp" alt="One kitchen.Many spirits." title="One kitchen.Many spirits." width="120" /></a>
<a href="./assets/player-cards/icloud-screens/tensho-2.webp"><img src="./assets/player-cards/icloud-screens/thumbs/tensho-2.webp" alt="Tensho" title="Tensho" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/enter-the-kitohen-table.webp"><img src="./assets/player-cards/icloud-screens/thumbs/enter-the-kitohen-table.webp" alt="Enter The-Kitohen Table →" title="Enter The-Kitohen Table →" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/kuro-guard-2.webp"><img src="./assets/player-cards/icloud-screens/thumbs/kuro-guard-2.webp" alt="Kuro Guard" title="Kuro Guard" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/a10-layerdefensibilitymoatprotects-thegr.webp"><img src="./assets/player-cards/icloud-screens/thumbs/a10-layerdefensibilitymoatprotects-thegr.webp" alt="A10-layerdefensibilitymoatprotects theGreatKitchen." title="A10-layerdefensibilitymoatprotects theGreatKitchen." width="120" /></a>
<a href="./assets/player-cards/icloud-screens/pokeframe-019f3676-d05f-76c1-bcfb-a3851bb189e3.webp"><img src="./assets/player-cards/icloud-screens/thumbs/pokeframe-019f3676-d05f-76c1-bcfb-a3851bb189e3.webp" alt="黑神先辈" title="黑神先辈" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/create-image.webp"><img src="./assets/player-cards/icloud-screens/thumbs/create-image.webp" alt="Create Image" title="Create Image" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/orion-arkforge.webp"><img src="./assets/player-cards/icloud-screens/thumbs/orion-arkforge.webp" alt="Orion Arkforge" title="Orion Arkforge" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/v1-0-0-2.webp"><img src="./assets/player-cards/icloud-screens/thumbs/v1-0-0-2.webp" alt="v1.0.0" title="v1.0.0" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/null-chan.webp"><img src="./assets/player-cards/icloud-screens/thumbs/null-chan.webp" alt="Null-chan" title="Null-chan" width="120" /></a>
<a href="./assets/player-cards/icloud-screens/canary-taster.webp"><img src="./assets/player-cards/icloud-screens/thumbs/canary-taster.webp" alt="Canary Taster" title="Canary Taster" width="120" /></a>
</p>

</details>

## Characters

<a href="./characters/build-kun/README.md"><img src="./assets/characters/build-kun/profile.svg" alt="Build-Kun" width="120" /></a>
<a href="./characters/canary-judge/README.md"><img src="./assets/characters/canary-judge/profile.svg" alt="Canary Judge" width="120" /></a>
<a href="./characters/data-chan/README.md"><img src="./assets/characters/data-chan/profile.svg" alt="Data Chan" width="120" /></a>
<a href="./characters/flash-riku/README.md"><img src="./assets/characters/flash-riku/profile.svg" alt="Flash Riku" width="120" /></a>
<a href="./characters/flavor-scribe/README.md"><img src="./assets/characters/flavor-scribe/profile.svg" alt="Flavor Scribe" width="120" /></a>
<a href="./characters/garnish-ghost/README.md"><img src="./assets/characters/garnish-ghost/profile.svg" alt="Garnish Ghost" width="120" /></a>
<a href="./characters/growth-guru/README.md"><img src="./assets/characters/growth-guru/profile.svg" alt="Growth Guru" width="120" /></a>
<a href="./characters/kaji/README.md"><img src="./assets/characters/kaji/profile.svg" alt="Kaji" width="120" /></a>
<a href="./characters/kuro-guard/README.md"><img src="./assets/characters/kuro-guard/profile.svg" alt="Kuro Guard" width="120" /></a>
<a href="./characters/ladle-lumen/README.md"><img src="./assets/characters/ladle-lumen/profile.svg" alt="Ladle Lumen" width="120" /></a>
<a href="./characters/ledger-ladle/README.md"><img src="./assets/characters/ledger-ladle/profile.svg" alt="Ledger Ladle" width="120" /></a>
<a href="./characters/mizu/README.md"><img src="./assets/characters/mizu/profile.svg" alt="Mizu" width="120" /></a>
<a href="./characters/null-chan/README.md"><img src="./assets/characters/null-chan/profile.svg" alt="Null-chan" width="120" /></a>
<a href="./characters/orchestra-core/README.md"><img src="./assets/characters/orchestra-core/profile.svg" alt="Orchestra Core" width="120" /></a>
<a href="./characters/policy-kenji/README.md"><img src="./assets/characters/policy-kenji/profile.svg" alt="Policy Kenji" width="120" /></a>
<a href="./characters/prep-pulse/README.md"><img src="./assets/characters/prep-pulse/profile.svg" alt="Prep Pulse" width="120" /></a>
<a href="./characters/queue-quartz/README.md"><img src="./assets/characters/queue-quartz/profile.svg" alt="Queue Quartz" width="120" /></a>
<a href="./characters/scale-oni/README.md"><img src="./assets/characters/scale-oni/profile.svg" alt="Scale Oni" width="120" /></a>
<a href="./characters/seira/README.md"><img src="./assets/characters/seira/profile.svg" alt="Seira" width="120" /></a>
<a href="./characters/tensho/README.md"><img src="./assets/characters/tensho/profile.svg" alt="Tensho" width="120" /></a>
<a href="./characters/timer-tactician/README.md"><img src="./assets/characters/timer-tactician/profile.svg" alt="Timer Tactician" width="120" /></a>
<a href="./characters/vacuum-vesper/README.md"><img src="./assets/characters/vacuum-vesper/profile.svg" alt="Vacuum Vesper" width="120" /></a>
<a href="./characters/yume/README.md"><img src="./assets/characters/yume/profile.svg" alt="Yume" width="120" /></a>
<a href="./characters/seira-scan/README.md"><img src="./assets/characters/seira-scan/profile.svg" alt="Seira Scan" width="120" /></a>
<a href="./characters/beacon-broil/README.md"><img src="./assets/characters/beacon-broil/profile.svg" alt="Beacon Broil" width="120" /></a>
<a href="./characters/kurogami-senpai/README.md"><img src="./assets/characters/kurogami-senpai/profile.svg" alt="Kurogami Senpai" width="120" /></a>
<a href="./characters/plate-inspector/README.md"><img src="./assets/characters/plate-inspector/profile.svg" alt="Plate Inspector" width="120" /></a>
<a href="./characters/reserve-rune/README.md"><img src="./assets/characters/reserve-rune/profile.svg" alt="Reserve Rune" width="120" /></a>
<a href="./characters/velvet-vesper/README.md"><img src="./assets/characters/velvet-vesper/profile.svg" alt="Velvet Vesper" width="120" /></a>
<a href="./characters/culture-chef/README.md"><img src="./assets/characters/culture-chef/profile.svg" alt="Culture Chef" width="120" /></a>
<a href="./characters/cve-kumo/README.md"><img src="./assets/characters/cve-kumo/profile.svg" alt="CVE Kumo" width="120" /></a>
<a href="./characters/hugo-matrix/README.md"><img src="./assets/characters/hugo-matrix/profile.svg" alt="Hugo Matrix" width="120" /></a>
<a href="./characters/insight-sensei/README.md"><img src="./assets/characters/insight-sensei/profile.svg" alt="Insight Sensei" width="120" /></a>
<a href="./characters/iron-hashi/README.md"><img src="./assets/characters/iron-hashi/profile.svg" alt="Iron Hashi" width="120" /></a>
<a href="./characters/yume-builder/README.md"><img src="./assets/characters/yume-builder/profile.svg" alt="Yume Builder" width="120" /></a>
<a href="./characters/alko-commit-chef/README.md"><img src="./assets/characters/alko-commit-chef/profile.svg" alt="Alko Commit Chef" width="120" /></a>
<a href="./characters/crate-courier/README.md"><img src="./assets/characters/crate-courier/profile.svg" alt="Crate Courier" width="120" /></a>
<a href="./characters/flavor-forager/README.md"><img src="./assets/characters/flavor-forager/profile.svg" alt="Flavor Forager" width="120" /></a>
<a href="./characters/metrics-miko/README.md"><img src="./assets/characters/metrics-miko/profile.svg" alt="Metrics Miko" width="120" /></a>
<a href="./characters/bruno-blast-radius/README.md"><img src="./assets/characters/bruno-blast-radius/profile.svg" alt="Bruno Blast Radius" width="120" /></a>
<a href="./characters/lila-branchkeeper/README.md"><img src="./assets/characters/lila-branchkeeper/profile.svg" alt="Lila Branchkeeper" width="120" /></a>
<a href="./characters/omar-reviewer/README.md"><img src="./assets/characters/omar-reviewer/profile.svg" alt="Omar Reviewer" width="120" /></a>
<a href="./characters/nina-promoter/README.md"><img src="./assets/characters/nina-promoter/profile.svg" alt="Nina Promoter" width="120" /></a>
<a href="./characters/release-conductor/README.md"><img src="./assets/characters/release-conductor/profile.svg" alt="Release Conductor" width="120" /></a>
<a href="./characters/felix-rollback/README.md"><img src="./assets/characters/felix-rollback/profile.svg" alt="Felix Rollback" width="120" /></a>
<a href="./characters/tariq-notesmith/README.md"><img src="./assets/characters/tariq-notesmith/profile.svg" alt="Tariq Notesmith" width="120" /></a>
<a href="./characters/ivun-cache/README.md"><img src="./assets/characters/ivun-cache/profile.svg" alt="Ivun Cache" width="120" /></a>
<a href="./characters/canary-taster/README.md"><img src="./assets/characters/canary-taster/profile.svg" alt="Canary Taster" width="120" /></a>
<a href="./characters/pipeline-sensei/README.md"><img src="./assets/characters/pipeline-sensei/profile.svg" alt="Pipeline Sensei" width="120" /></a>
<a href="./characters/template-tanaka/README.md"><img src="./assets/characters/template-tanaka/profile.svg" alt="Template Tanaka" width="120" /></a>
<a href="./characters/bootstrap-aiko/README.md"><img src="./assets/characters/bootstrap-aiko/profile.svg" alt="Bootstrap Aiko" width="120" /></a>
<a href="./characters/terra-forge/README.md"><img src="./assets/characters/terra-forge/profile.svg" alt="Terra Forge" width="120" /></a>
<a href="./characters/schema-sora/README.md"><img src="./assets/characters/schema-sora/profile.svg" alt="Schema Sora" width="120" /></a>
<a href="./characters/runtime-riku/README.md"><img src="./assets/characters/runtime-riku/profile.svg" alt="Runtime Riku" width="120" /></a>
<a href="./characters/vault-hana/README.md"><img src="./assets/characters/vault-hana/profile.svg" alt="Vault Hana" width="120" /></a>
<a href="./characters/streama/README.md"><img src="./assets/characters/streama/profile.svg" alt="Streama" width="120" /></a>
<a href="./characters/preview-yuki/README.md"><img src="./assets/characters/preview-yuki/profile.svg" alt="Preview Yuki" width="120" /></a>
<a href="./characters/portal-rei/README.md"><img src="./assets/characters/portal-rei/profile.svg" alt="Portal Rei" width="120" /></a>
<a href="./characters/guardrail-goro/README.md"><img src="./assets/characters/guardrail-goro/profile.svg" alt="Guardrail Goro" width="120" /></a>
<a href="./characters/platform-sensei/README.md"><img src="./assets/characters/platform-sensei/profile.svg" alt="Platform Sensei" width="120" /></a>
<a href="./characters/slo-sage/README.md"><img src="./assets/characters/slo-sage/profile.svg" alt="SLO Sage" width="120" /></a>
<a href="./characters/trace-sensei/README.md"><img src="./assets/characters/trace-sensei/profile.svg" alt="Trace Sensei" width="120" /></a>
<a href="./characters/chaos-kaito/README.md"><img src="./assets/characters/chaos-kaito/profile.svg" alt="Chaos Kaito" width="120" /></a>
<a href="./characters/capacity-kanna/README.md"><img src="./assets/characters/capacity-kanna/profile.svg" alt="Capacity Kanna" width="120" /></a>
<a href="./characters/alert-akira/README.md"><img src="./assets/characters/alert-akira/profile.svg" alt="Alert Akira" width="120" /></a>
<a href="./characters/allergen-oracle/README.md"><img src="./assets/characters/allergen-oracle/profile.svg" alt="Allergen Oracle" width="120" /></a>
<a href="./characters/anomaly-aki/README.md"><img src="./assets/characters/anomaly-aki/profile.svg" alt="Anomaly Aki" width="120" /></a>
<a href="./characters/apprentice-kai/README.md"><img src="./assets/characters/apprentice-kai/profile.svg" alt="Apprentice Kai" width="120" /></a>
<a href="./characters/auditor-emi/README.md"><img src="./assets/characters/auditor-emi/profile.svg" alt="Auditor Emi" width="120" /></a>
<a href="./characters/backlog-benji/README.md"><img src="./assets/characters/backlog-benji/profile.svg" alt="Backlog Benji" width="120" /></a>
<a href="./characters/chaos-analyst/README.md"><img src="./assets/characters/chaos-analyst/profile.svg" alt="Chaos Analyst" width="120" /></a>
<a href="./characters/container-kage/README.md"><img src="./assets/characters/container-kage/profile.svg" alt="Container Kage" width="120" /></a>
<a href="./characters/cost-kaito/README.md"><img src="./assets/characters/cost-kaito/profile.svg" alt="Cost Kaito" width="120" /></a>
<a href="./characters/dora-daichi/README.md"><img src="./assets/characters/dora-daichi/profile.svg" alt="DORA Daichi" width="120" /></a>
<a href="./characters/dx-mei/README.md"><img src="./assets/characters/dx-mei/profile.svg" alt="DX Mei" width="120" /></a>
<a href="./characters/evidence-scribe/README.md"><img src="./assets/characters/evidence-scribe/profile.svg" alt="Evidence Scribe" width="120" /></a>
<a href="./characters/flag-fox/README.md"><img src="./assets/characters/flag-fox/profile.svg" alt="Flag Fox" width="120" /></a>
<a href="./characters/forecast-fuji/README.md"><img src="./assets/characters/forecast-fuji/profile.svg" alt="Forecast Fuji" width="120" /></a>
<a href="./characters/grafana-mei/README.md"><img src="./assets/characters/grafana-mei/profile.svg" alt="Grafana Mei" width="120" /></a>
<a href="./characters/harvest-hex/README.md"><img src="./assets/characters/harvest-hex/profile.svg" alt="Harvest Hex" width="120" /></a>
<a href="./characters/impact-ichi/README.md"><img src="./assets/characters/impact-ichi/profile.svg" alt="Impact Ichi" width="120" /></a>
<a href="./characters/incident-kitsune/README.md"><img src="./assets/characters/incident-kitsune/profile.svg" alt="Incident Kitsune" width="120" /></a>
<a href="./characters/lake-haru/README.md"><img src="./assets/characters/lake-haru/profile.svg" alt="Lake Haru" width="120" /></a>
<a href="./characters/lattice/README.md"><img src="./assets/characters/lattice/profile.svg" alt="Lattice" width="120" /></a>
<a href="./characters/leaderboard-leo/README.md"><img src="./assets/characters/leaderboard-leo/profile.svg" alt="Leaderboard Leo" width="120" /></a>
<a href="./characters/merge-sentinel/README.md"><img src="./assets/characters/merge-sentinel/profile.svg" alt="Merge Sentinel" width="120" /></a>
<a href="./characters/nudge-neko/README.md"><img src="./assets/characters/nudge-neko/profile.svg" alt="Nudge Neko" width="120" /></a>
<a href="./characters/oncall-naomi/README.md"><img src="./assets/characters/oncall-naomi/profile.svg" alt="OnCall Naomi" width="120" /></a>
<a href="./characters/pager-hiro/README.md"><img src="./assets/characters/pager-hiro/profile.svg" alt="Pager Hiro" width="120" /></a>
<a href="./characters/pantry-paladin/README.md"><img src="./assets/characters/pantry-paladin/profile.svg" alt="Pantry Paladin" width="120" /></a>
<a href="./characters/policy-ronin/README.md"><img src="./assets/characters/policy-ronin/profile.svg" alt="Policy Ronin" width="120" /></a>
<a href="./characters/portion-paladin/README.md"><img src="./assets/characters/portion-paladin/profile.svg" alt="Portion Paladin" width="120" /></a>
<a href="./characters/queue-mizu/README.md"><img src="./assets/characters/queue-mizu/profile.svg" alt="Queue Mizu" width="120" /></a>
<a href="./characters/recipe-ranger/README.md"><img src="./assets/characters/recipe-ranger/profile.svg" alt="Recipe Ranger" width="120" /></a>
<a href="./characters/red-oni/README.md"><img src="./assets/characters/red-oni/profile.svg" alt="Red Oni" width="120" /></a>
<a href="./characters/reliability-sensei/README.md"><img src="./assets/characters/reliability-sensei/profile.svg" alt="Reliability Sensei" width="120" /></a>
<a href="./characters/repo-ranger/README.md"><img src="./assets/characters/repo-ranger/profile.svg" alt="Repo Ranger" width="120" /></a>
<a href="./characters/resilience-ryu/README.md"><img src="./assets/characters/resilience-ryu/profile.svg" alt="Resilience Ryu" width="120" /></a>
<a href="./characters/revenue-rina/README.md"><img src="./assets/characters/revenue-rina/profile.svg" alt="Revenue Rina" width="120" /></a>
<a href="./characters/review-ren/README.md"><img src="./assets/characters/review-ren/profile.svg" alt="Review Ren" width="120" /></a>
<a href="./characters/risk-ryota/README.md"><img src="./assets/characters/risk-ryota/profile.svg" alt="Risk Ryota" width="120" /></a>
<a href="./characters/roadmap-sensei/README.md"><img src="./assets/characters/roadmap-sensei/profile.svg" alt="Roadmap Sensei" width="120" /></a>
<a href="./characters/scorecard-shin/README.md"><img src="./assets/characters/scorecard-shin/profile.svg" alt="Scorecard Shin" width="120" /></a>
<a href="./characters/secure-sakura/README.md"><img src="./assets/characters/secure-sakura/profile.svg" alt="Secure Sakura" width="120" /></a>
<a href="./characters/seira-vaultkeeper/README.md"><img src="./assets/characters/seira-vaultkeeper/profile.svg" alt="Seira Vaultkeeper" width="120" /></a>
<a href="./characters/storyteller-sumi/README.md"><img src="./assets/characters/storyteller-sumi/profile.svg" alt="Storyteller Sumi" width="120" /></a>
<a href="./characters/taxonomy-taka/README.md"><img src="./assets/characters/taxonomy-taka/profile.svg" alt="Taxonomy Taka" width="120" /></a>
<a href="./characters/threat-taro/README.md"><img src="./assets/characters/threat-taro/profile.svg" alt="Threat Taro" width="120" /></a>
<a href="./characters/ticket-tactician/README.md"><img src="./assets/characters/ticket-tactician/profile.svg" alt="Ticket Tactician" width="120" /></a>
<a href="./characters/token-toshi/README.md"><img src="./assets/characters/token-toshi/profile.svg" alt="Token Toshi" width="120" /></a>
<a href="./characters/umami-code/README.md"><img src="./assets/characters/umami-code/profile.svg" alt="Umami Code" width="120" /></a>
<a href="./characters/watchtower-yoru/README.md"><img src="./assets/characters/watchtower-yoru/profile.svg" alt="Watchtower Yoru" width="120" /></a>

## Getting started

```bash
npm install        # installs the root workspaces
npm test           # validates the 112 profiles and every player card
npm run test:workspaces   # runs each workspace test that exists
```

Python tools (`tools/mise-pr`, `tools/salt-shakers`, `tools/microlink-a2a`, `tools/gcp-lazy-minting`) and pnpm monorepos (`apps/developer-platform`, `apps/registry-platform`, `apps/bootstrap-registry`, `apps/mint-playground`, `tools/chaingate`) install from their own folders. Each component keeps its own README and LICENSE.

## Runtime trust model

MiseOS defaults agents to least privilege and read-only operation. Shell, repository write, network, deployment, publication, billing, minting, and merge capabilities require explicit policy authorization. Privileged execution must produce auditable evidence and remain subject to human or independent policy approval where configured.

## Repository structure

- `characters/<slug>/` — character profile and metadata
- `assets/characters/<slug>/profile.svg` — clickable identity tile
- `assets/player-cards/<collection>/` — player card art (`thumbs/` for gallery thumbnails)
- `data/` — indexes and roster data
- `apps/`, `tools/`, `packages/` — the universe components above
- `.github/workflows/` — registry validation plus path-filtered CI per component

## Mise Orchestra

The roster includes established Orchestra characters such as Kurogami Senpai, Tensho, Mizu, Kaji, Yume, Null-chan, Flash Riku, Seira, Kuro Guard, Scale Oni, Build-Kun, Orchestra Core, Data-chan, Insight Sensei, Chaos Analyst, Growth Guru, Culture Chef, Canary Taster, Metrics Miko, SLO Sage, Streama, Umami Code, and other MiseOS specialists.

## License

MIT for the root registry. Components under `apps/`, `tools/` and `packages/` keep their own LICENSE files.
