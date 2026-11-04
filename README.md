<div align="center">

<img src="./assets/header.svg" alt="MiseOS Universe" width="100%" />

# MiseOS Universe

**112 character agents • 300 player cards • 6 operational kitchens • 23 registry manifests • one repository**

</div>

<p align="center"><img src="./assets/repo-pets/walk-header.svg" alt="MiseOS brigade walking across the repository" width="100%" /></p>

MiseOS models software delivery as a kitchen brigade. Every character is a player card with an identity, a profile, machine-readable metadata, an operational workflow and a proof gate. This repository is the MiseOS Universe: the character registry, every player card, and the apps, tools and packages that run the brigade, in one place.

> No merge, deployment, publication, billing action, or mint without evidence.

## Contents

- [Universe map](#universe-map)
- [Repo pets](#repo-pets)
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
| **[Repo Pet](./tools/repo-pet)** | `tools/repo-pet` | Shimeji-style repo pets: terminal roamer and the walking README strips. |
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

## Repo pets

<!-- universe-index:start -->
**Universe indexes:** [Characters](./docs/characters/README.md) · [Agents (92)](./docs/agents/README.md) · [Repo pets (35, 8 animals)](./docs/repo-pets/README.md) · [Source library manifest](./data/source-files.json)

<p align="center"><img src="./assets/repo-pets/walk-animals.svg" alt="MiseOS animal repo pets" width="100%" /></p>
<!-- universe-index:end -->

<p align="center"><img src="./assets/repo-pets/walk-kitchen.svg" alt="MiseOS repo pets on patrol" width="100%" /></p>

The brigade roams this repository as Shimeji-style repo pets. The strips above and below are self-contained animated SVGs built from the characters' card art and the Shimeji Brigade sprite packs (Kurogami and Mizu walk, perch and climb frame by frame). They pause when your system asks for reduced motion.

- [`tools/repo-pet`](./tools/repo-pet) — the terminal Repo Pet that walks a repository or container safely, read-only (`npm run roam:repo`), plus the strip generator `npm run pets:readme`.
- [`assets/repo-pets/`](./assets/repo-pets) — character cutouts, sprite frames and the generated `walk-*.svg` strips.
- Shimeji Brigade sprite packs: [`apps/developer-platform/packages/shimeji-brigade`](./apps/developer-platform/packages/shimeji-brigade), [`apps/miseos-platform/apps/shimeji-brigade`](./apps/miseos-platform/apps/shimeji-brigade); minting starter in [`tools/shimeji-mint`](./tools/shimeji-mint).

The **Repo Pets** workflow can reshuffle which characters walk (run it manually, or let it run weekly).

## Player cards

300 unique player cards across 8 collections. Each thumbnail opens its character page (workflow, actions, implementation, card metadata and sources) or, for unmatched cards, a per-card page; see the [character index](./docs/characters/README.md). 180 cards are matched to 134 characters / registry entries.

<details open>
<summary><b>Long Cards</b> — 43 cards (40 matched to characters)</summary>

<p>
<a href="./docs/characters/plate-inspector.md"><img src="./assets/player-cards/long-cards/thumbs/plate-inspector.webp" alt="Plate Inspector" title="Plate Inspector" width="120" /></a>
<a href="./docs/characters/miseos-repo-steward.md"><img src="./assets/player-cards/long-cards/thumbs/keeperofhistory-guardianofintegrity.webp" alt="KEEPEROFHISTORY.GUARDIANOFINTEGRITY" title="KEEPEROFHISTORY.GUARDIANOFINTEGRITY" width="120" /></a>
<a href="./docs/characters/miseos-release-sentinel.md"><img src="./assets/player-cards/long-cards/thumbs/miseosreleasesentinel.webp" alt="MISEOSRELEASESENTINEL" title="MISEOSRELEASESENTINEL" width="120" /></a>
<a href="./docs/characters/miseos-docs-builder.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-docs-builder.webp" alt="MiseOS Docs Builder" title="MiseOS Docs Builder" width="120" /></a>
<a href="./docs/cards/long-cards--miseos-conductor-prime.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-conductor-prime.webp" alt="MiseOS Conductor Prime" title="MiseOS Conductor Prime" width="120" /></a>
<a href="./docs/characters/cold-zero.md"><img src="./assets/player-cards/long-cards/thumbs/cold-zero.webp" alt="Cold Zero" title="Cold Zero" width="120" /></a>
<a href="./docs/characters/miseos-trust-graph.md"><img src="./assets/player-cards/long-cards/thumbs/miseos.webp" alt="Miseos" title="Miseos" width="120" /></a>
<a href="./docs/characters/resilience-ryu.md"><img src="./assets/player-cards/long-cards/thumbs/resilience-ryu.webp" alt="Resilience Ryu" title="Resilience Ryu" width="120" /></a>
<a href="./docs/characters/miseos-maven-policy-adapter.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-maven-policy-adapter.webp" alt="MiseOS Maven Policy Adapter" title="MiseOS Maven Policy Adapter" width="120" /></a>
<a href="./docs/characters/miseos-repo-pet.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-repo-pet.webp" alt="MiseOS Repo Pet" title="MiseOS Repo Pet" width="120" /></a>
<a href="./docs/characters/miseos-attestation-gate.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-attestation-gate.webp" alt="MiseOS Attestation Gate" title="MiseOS Attestation Gate" width="120" /></a>
<a href="./docs/cards/long-cards--thunder-surge.md"><img src="./assets/player-cards/long-cards/thumbs/thunder-surge.webp" alt="Thunder Surge" title="Thunder Surge" width="120" /></a>
<a href="./docs/characters/miseos-nuget-client.md"><img src="./assets/player-cards/long-cards/thumbs/miseosnugetclient.webp" alt="MiseOSNuGetClient" title="MiseOSNuGetClient" width="120" /></a>
<a href="./docs/characters/miseos-registry-schema.md"><img src="./assets/player-cards/long-cards/thumbs/ultra-mythic.webp" alt="ULTRA MYTHIC" title="ULTRA MYTHIC" width="120" /></a>
<a href="./docs/characters/steam-whisper.md"><img src="./assets/player-cards/long-cards/thumbs/whisper.webp" alt="Whisper" title="Whisper" width="120" /></a>
<a href="./docs/characters/miseos-sbom-indexer.md"><img src="./assets/player-cards/long-cards/thumbs/sigstore.webp" alt="SIGSTORE" title="SIGSTORE" width="120" /></a>
<a href="./docs/characters/miseos-registry-schema.md"><img src="./assets/player-cards/long-cards/thumbs/ultramythic.webp" alt="ULTRAMYTHIC" title="ULTRAMYTHIC" width="120" /></a>
<a href="./docs/characters/miseos-workflow-linter.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-workflow-linter.webp" alt="MISEOS WORKFLOW LINTER" title="MISEOS WORKFLOW LINTER" width="120" /></a>
<a href="./docs/characters/miseos-orchestra-theme.md"><img src="./assets/player-cards/long-cards/thumbs/mise-orchestra-theme.webp" alt="Mise Orchestra Theme" title="Mise Orchestra Theme" width="120" /></a>
<a href="./docs/characters/miseos-runner.md"><img src="./assets/player-cards/long-cards/thumbs/runner.webp" alt="RUNNER" title="RUNNER" width="120" /></a>
<a href="./docs/characters/miseos-ruby-steward.md"><img src="./assets/player-cards/long-cards/thumbs/15-80.webp" alt="15/80" title="15/80" width="120" /></a>
<a href="./docs/characters/sauce-sage.md"><img src="./assets/player-cards/long-cards/thumbs/sauce-sage.webp" alt="Sauce Sage" title="Sauce Sage" width="120" /></a>
<a href="./docs/characters/miseos-agent-sdk.md"><img src="./assets/player-cards/long-cards/thumbs/agent-sdk.webp" alt="Agent SDK" title="Agent SDK" width="120" /></a>
<a href="./docs/characters/miseos-policy-engine.md"><img src="./assets/player-cards/long-cards/thumbs/i-am-the-will-that-governs-all-action.webp" alt="I AM THE WILL THAT GOVERNS ALL ACTION" title="I AM THE WILL THAT GOVERNS ALL ACTION" width="120" /></a>
<a href="./docs/characters/miseos-docs-hub-template.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-docs-hub-template.webp" alt="MiseOS Docs Hub Template" title="MiseOS Docs Hub Template" width="120" /></a>
<a href="./docs/characters/miseos-maven-policy-adapter.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-maven-policy-adapter-2.webp" alt="MiseOS Maven Policy Adapter" title="MiseOS Maven Policy Adapter" width="120" /></a>
<a href="./docs/characters/miseos-policy-checker.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-policy-checker.webp" alt="MiseOS Policy Checker" title="MiseOS Policy Checker" width="120" /></a>
<a href="./docs/characters/pan-phantom.md"><img src="./assets/player-cards/long-cards/thumbs/pan-phantom.webp" alt="Pan Phantom" title="Pan Phantom" width="120" /></a>
<a href="./docs/characters/butcher-blade.md"><img src="./assets/player-cards/long-cards/thumbs/butcher-blade.webp" alt="Butcher Blade" title="Butcher Blade" width="120" /></a>
<a href="./docs/characters/miseos-workflow-pack.md"><img src="./assets/player-cards/long-cards/thumbs/packaged-for-infinity-built-for-synergy.webp" alt="Packaged for infinity.Built for synergy." title="Packaged for infinity.Built for synergy." width="120" /></a>
<a href="./docs/characters/zen-plater.md"><img src="./assets/player-cards/long-cards/thumbs/zen-plater.webp" alt="Zen Plater" title="Zen Plater" width="120" /></a>
<a href="./docs/characters/miseos-repo-steward.md"><img src="./assets/player-cards/long-cards/thumbs/keeperofhistory-guardian-ofintegrity.webp" alt="KEEPEROFHISTORY.GUARDIAN OFINTEGRITY." title="KEEPEROFHISTORY.GUARDIAN OFINTEGRITY." width="120" /></a>
<a href="./docs/characters/miseos-orchestra-theme.md"><img src="./assets/player-cards/long-cards/thumbs/mise-orchestra-theme-2.webp" alt="Mise Orchestra Theme" title="Mise Orchestra Theme" width="120" /></a>
<a href="./docs/characters/spice-alchemist.md"><img src="./assets/player-cards/long-cards/thumbs/spice-alchemist.webp" alt="Spice Alchemist" title="Spice Alchemist" width="120" /></a>
<a href="./docs/characters/miseos-release-sentinel.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-release-sentinel.webp" alt="MISEOS RELEASE SENTINEL" title="MISEOS RELEASE SENTINEL" width="120" /></a>
<a href="./docs/characters/miseos-gradle-plugin.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-gradle-plugin.webp" alt="MiseOS Gradle Plugin" title="MiseOS Gradle Plugin" width="120" /></a>
<a href="./docs/characters/miseos-repo-pet.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-repo-pet-2.webp" alt="MiseOS Repo Pet" title="MiseOS Repo Pet" width="120" /></a>
<a href="./docs/characters/knead-guardian.md"><img src="./assets/player-cards/long-cards/thumbs/knead-guardian.webp" alt="Knead Guardian" title="Knead Guardian" width="120" /></a>
<a href="./docs/characters/miseos-cli.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-cli.webp" alt="MiseOS CLI" title="MiseOS CLI" width="120" /></a>
<a href="./docs/characters/byte.md"><img src="./assets/player-cards/long-cards/thumbs/byte.webp" alt="Byte" title="Byte" width="120" /></a>
<a href="./docs/cards/long-cards--d446f048-3fbc-41b8-ada0-a36127e03f15.md"><img src="./assets/player-cards/long-cards/thumbs/d446f048-3fbc-41b8-ada0-a36127e03f15.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/characters/char-coach.md"><img src="./assets/player-cards/long-cards/thumbs/char-coach.webp" alt="Char Coach" title="Char Coach" width="120" /></a>
<a href="./docs/characters/miseos-analytics-engine.md"><img src="./assets/player-cards/long-cards/thumbs/miseos-analytics-engine.webp" alt="MiseOS Analytics Engine" title="MiseOS Analytics Engine" width="120" /></a>
</p>

</details>

<details open>
<summary><b>1×1 Chefs</b> — 113 cards (94 matched to characters)</summary>

<p>
<a href="./docs/characters/felix-rollback.md"><img src="./assets/player-cards/1by1-chefs/thumbs/felix-rollback.webp" alt="Felix Rollback" title="Felix Rollback" width="120" /></a>
<a href="./docs/characters/plating-poet.md"><img src="./assets/player-cards/1by1-chefs/thumbs/plating-poet.webp" alt="Plating Poet" title="Plating Poet" width="120" /></a>
<a href="./docs/cards/1by1-chefs--gatekeeper.md"><img src="./assets/player-cards/1by1-chefs/thumbs/gatekeeper.webp" alt="Gatekeeper" title="Gatekeeper" width="120" /></a>
<a href="./docs/characters/flavor-forager.md"><img src="./assets/player-cards/1by1-chefs/thumbs/flavor-forager.webp" alt="Flavor Forager" title="Flavor Forager" width="120" /></a>
<a href="./docs/cards/1by1-chefs--sre-chef.md"><img src="./assets/player-cards/1by1-chefs/thumbs/sre-chef.webp" alt="SRE Chef" title="SRE Chef" width="120" /></a>
<a href="./docs/characters/ladle-lumen.md"><img src="./assets/player-cards/1by1-chefs/thumbs/ladle-lumen.webp" alt="Ladle Lumen" title="Ladle Lumen" width="120" /></a>
<a href="./docs/characters/cost-kaito.md"><img src="./assets/player-cards/1by1-chefs/thumbs/cost-kaito.webp" alt="Cost Kaito" title="Cost Kaito" width="120" /></a>
<a href="./docs/characters/streama.md"><img src="./assets/player-cards/1by1-chefs/thumbs/streama.webp" alt="Streama" title="Streama" width="120" /></a>
<a href="./docs/characters/orchestra-core.md"><img src="./assets/player-cards/1by1-chefs/thumbs/acore.webp" alt="aCore" title="aCore" width="120" /></a>
<a href="./docs/characters/flash-riku.md"><img src="./assets/player-cards/1by1-chefs/thumbs/flash-riku.webp" alt="Flash Riku" title="Flash Riku" width="120" /></a>
<a href="./docs/characters/energy-keeper.md"><img src="./assets/player-cards/1by1-chefs/thumbs/energy-keeper.webp" alt="Energy Keeper" title="Energy Keeper" width="120" /></a>
<a href="./docs/cards/1by1-chefs--dispatcher.md"><img src="./assets/player-cards/1by1-chefs/thumbs/dispatcher.webp" alt="Dispatcher" title="Dispatcher" width="120" /></a>
<a href="./docs/characters/orderly-owl.md"><img src="./assets/player-cards/1by1-chefs/thumbs/orderly-owl.webp" alt="Orderly Owl" title="Orderly Owl" width="120" /></a>
<a href="./docs/cards/1by1-chefs--reviewer.md"><img src="./assets/player-cards/1by1-chefs/thumbs/reviewer.webp" alt="Reviewer" title="Reviewer" width="120" /></a>
<a href="./docs/characters/schema-sora.md"><img src="./assets/player-cards/1by1-chefs/thumbs/schema-sora.webp" alt="Schema Sora" title="Schema Sora" width="120" /></a>
<a href="./docs/characters/sanitation-star.md"><img src="./assets/player-cards/1by1-chefs/thumbs/sanitation-star.webp" alt="Sanitation Star" title="Sanitation Star" width="120" /></a>
<a href="./docs/cards/1by1-chefs--doc-writer.md"><img src="./assets/player-cards/1by1-chefs/thumbs/doc-writer.webp" alt="Doc Writer" title="Doc Writer" width="120" /></a>
<a href="./docs/characters/ledger-ladle.md"><img src="./assets/player-cards/1by1-chefs/thumbs/ledger-ladle.webp" alt="Ledger Ladle" title="Ledger Ladle" width="120" /></a>
<a href="./docs/characters/iron-hashi.md"><img src="./assets/player-cards/1by1-chefs/thumbs/iron-hashi.webp" alt="Iron Hashi" title="Iron Hashi" width="120" /></a>
<a href="./docs/characters/pickle-doc.md"><img src="./assets/player-cards/1by1-chefs/thumbs/pickle-doc.webp" alt="Pickle Doc" title="Pickle Doc" width="120" /></a>
<a href="./docs/cards/1by1-chefs--compliance.md"><img src="./assets/player-cards/1by1-chefs/thumbs/compliance.webp" alt="Compliance" title="Compliance" width="120" /></a>
<a href="./docs/characters/ticket-tactician.md"><img src="./assets/player-cards/1by1-chefs/thumbs/ticket-tactician.webp" alt="Ticket Tactician" title="Ticket Tactician" width="120" /></a>
<a href="./docs/characters/merge-sentinel.md"><img src="./assets/player-cards/1by1-chefs/thumbs/merge-sentinel.webp" alt="Merge Sentinel" title="Merge Sentinel" width="120" /></a>
<a href="./docs/characters/citrus-zest.md"><img src="./assets/player-cards/1by1-chefs/thumbs/zest.webp" alt="Zest" title="Zest" width="120" /></a>
<a href="./docs/characters/cacao-alchemist.md"><img src="./assets/player-cards/1by1-chefs/thumbs/cacao-alchemist.webp" alt="Cacao Alchemist" title="Cacao Alchemist" width="120" /></a>
<a href="./docs/characters/velvet-vesper.md"><img src="./assets/player-cards/1by1-chefs/thumbs/velvet-vesper.webp" alt="Velvet Vesper" title="Velvet Vesper" width="120" /></a>
<a href="./docs/characters/tariq-notesmith.md"><img src="./assets/player-cards/1by1-chefs/thumbs/tariq-notesmith.webp" alt="Tariq Notesmith" title="Tariq Notesmith" width="120" /></a>
<a href="./docs/characters/umami-seeker.md"><img src="./assets/player-cards/1by1-chefs/thumbs/umami-seeker.webp" alt="Umami Seeker" title="Umami Seeker" width="120" /></a>
<a href="./docs/characters/release-conductor.md"><img src="./assets/player-cards/1by1-chefs/thumbs/release-conductor.webp" alt="Release Conductor" title="Release Conductor" width="120" /></a>
<a href="./docs/characters/hugo-matrix.md"><img src="./assets/player-cards/1by1-chefs/thumbs/hugo-matrix.webp" alt="Hugo Matrix" title="Hugo Matrix" width="120" /></a>
<a href="./docs/cards/1by1-chefs--conductor.md"><img src="./assets/player-cards/1by1-chefs/thumbs/conductor.webp" alt="Conductor" title="Conductor" width="120" /></a>
<a href="./docs/cards/1by1-chefs--ux-chef.md"><img src="./assets/player-cards/1by1-chefs/thumbs/ux-chef.webp" alt="UX Chef" title="UX Chef" width="120" /></a>
<a href="./docs/characters/allergen-oracle.md"><img src="./assets/player-cards/1by1-chefs/thumbs/allergen-oracle.webp" alt="Allergen Oracle" title="Allergen Oracle" width="120" /></a>
<a href="./docs/characters/scorecard-shin.md"><img src="./assets/player-cards/1by1-chefs/thumbs/scorecard-shin.webp" alt="Scorecard Shin" title="Scorecard Shin" width="120" /></a>
<a href="./docs/characters/pantry-paladin.md"><img src="./assets/player-cards/1by1-chefs/thumbs/pantry-paladin.webp" alt="Pantry Paladin" title="Pantry Paladin" width="120" /></a>
<a href="./docs/characters/ashen-one.md"><img src="./assets/player-cards/1by1-chefs/thumbs/ashen-one.webp" alt="Ashen One" title="Ashen One" width="120" /></a>
<a href="./docs/characters/nudge-neko.md"><img src="./assets/player-cards/1by1-chefs/thumbs/nudge-neko.webp" alt="Nudge Neko" title="Nudge Neko" width="120" /></a>
<a href="./docs/characters/mizu.md"><img src="./assets/player-cards/1by1-chefs/thumbs/mizu.webp" alt="Mizu" title="Mizu" width="120" /></a>
<a href="./docs/characters/garnish-ghost.md"><img src="./assets/player-cards/1by1-chefs/thumbs/garnish-ghost.webp" alt="Garnish Ghost" title="Garnish Ghost" width="120" /></a>
<a href="./docs/characters/reserve-rune.md"><img src="./assets/player-cards/1by1-chefs/thumbs/reserve.webp" alt="Reserve" title="Reserve" width="120" /></a>
<a href="./docs/cards/1by1-chefs--security-auditor.md"><img src="./assets/player-cards/1by1-chefs/thumbs/security-auditor.webp" alt="Security Auditor" title="Security Auditor" width="120" /></a>
<a href="./docs/characters/roast-commander.md"><img src="./assets/player-cards/1by1-chefs/thumbs/roast-commander.webp" alt="Roast Commander" title="Roast Commander" width="120" /></a>
<a href="./docs/characters/scale-oni.md"><img src="./assets/player-cards/1by1-chefs/thumbs/scale-oni.webp" alt="Scale Oni" title="Scale Oni" width="120" /></a>
<a href="./docs/characters/ivun-cache.md"><img src="./assets/player-cards/1by1-chefs/thumbs/ivun-cache.webp" alt="Ivun Cache" title="Ivun Cache" width="120" /></a>
<a href="./docs/cards/1by1-chefs--coder.md"><img src="./assets/player-cards/1by1-chefs/thumbs/coder.webp" alt="Coder" title="Coder" width="120" /></a>
<a href="./docs/cards/1by1-chefs--encryptor.md"><img src="./assets/player-cards/1by1-chefs/thumbs/encryptor.webp" alt="Encryptor" title="Encryptor" width="120" /></a>
<a href="./docs/characters/vacuum-vesper.md"><img src="./assets/player-cards/1by1-chefs/thumbs/vesper.webp" alt="Vesper" title="Vesper" width="120" /></a>
<a href="./docs/characters/evidence-scribe.md"><img src="./assets/player-cards/1by1-chefs/thumbs/evidence-scribe.webp" alt="Evidence Scribe" title="Evidence Scribe" width="120" /></a>
<a href="./docs/characters/brine-baron.md"><img src="./assets/player-cards/1by1-chefs/thumbs/brine-baron.webp" alt="Brine Baron" title="Brine Baron" width="120" /></a>
<a href="./docs/characters/guardrail-goro.md"><img src="./assets/player-cards/1by1-chefs/thumbs/guardrail-goro.webp" alt="Guardrail Goro" title="Guardrail Goro" width="120" /></a>
<a href="./docs/characters/shift-sentinel.md"><img src="./assets/player-cards/1by1-chefs/thumbs/shift-sentinel.webp" alt="Shift Sentinel" title="Shift Sentinel" width="120" /></a>
<a href="./docs/characters/sweet-architect.md"><img src="./assets/player-cards/1by1-chefs/thumbs/sweet-architect.webp" alt="Sweet Architect." title="Sweet Architect." width="120" /></a>
<a href="./docs/characters/umami-code.md"><img src="./assets/player-cards/1by1-chefs/thumbs/umami-code.webp" alt="Umami Code" title="Umami Code" width="120" /></a>
<a href="./docs/characters/yume.md"><img src="./assets/player-cards/1by1-chefs/thumbs/yume.webp" alt="Yume" title="Yume" width="120" /></a>
<a href="./docs/characters/kaji.md"><img src="./assets/player-cards/1by1-chefs/thumbs/kaji.webp" alt="Kaji" title="Kaji" width="120" /></a>
<a href="./docs/characters/crate-courier.md"><img src="./assets/player-cards/1by1-chefs/thumbs/crate-courier.webp" alt="Crate Courier" title="Crate Courier" width="120" /></a>
<a href="./docs/characters/broth-scholar.md"><img src="./assets/player-cards/1by1-chefs/thumbs/broth-scholar.webp" alt="Broth Scholar" title="Broth Scholar" width="120" /></a>
<a href="./docs/characters/preview-yuki.md"><img src="./assets/player-cards/1by1-chefs/thumbs/preview.webp" alt="Preview" title="Preview" width="120" /></a>
<a href="./docs/cards/1by1-chefs--swarmer.md"><img src="./assets/player-cards/1by1-chefs/thumbs/swarmer.webp" alt="Swarmer" title="Swarmer" width="120" /></a>
<a href="./docs/characters/anomaly-aki.md"><img src="./assets/player-cards/1by1-chefs/thumbs/anomaly-aki.webp" alt="Anomaly Aki" title="Anomaly Aki" width="120" /></a>
<a href="./docs/characters/legacy-keeper.md"><img src="./assets/player-cards/1by1-chefs/thumbs/legacy.webp" alt="Legacy" title="Legacy" width="120" /></a>
<a href="./docs/characters/dora-daichi.md"><img src="./assets/player-cards/1by1-chefs/thumbs/dora-daichi.webp" alt="DORA Daichi" title="DORA Daichi" width="120" /></a>
<a href="./docs/cards/1by1-chefs--tester.md"><img src="./assets/player-cards/1by1-chefs/thumbs/tester.webp" alt="Tester" title="Tester" width="120" /></a>
<a href="./docs/characters/miso-maven.md"><img src="./assets/player-cards/1by1-chefs/thumbs/miso-maven.webp" alt="Miso Maven" title="Miso Maven" width="120" /></a>
<a href="./docs/characters/slicer-swift.md"><img src="./assets/player-cards/1by1-chefs/thumbs/slicer-swift.webp" alt="Slicer Swift" title="Slicer Swift" width="120" /></a>
<a href="./docs/characters/sear-samurai.md"><img src="./assets/player-cards/1by1-chefs/thumbs/sear-samurai.webp" alt="Sear Samurai" title="Sear Samurai" width="120" /></a>
<a href="./docs/characters/pulse-captain.md"><img src="./assets/player-cards/1by1-chefs/thumbs/pulse-captain.webp" alt="Pulse Captain" title="Pulse Captain" width="120" /></a>
<a href="./docs/characters/queue-quartz.md"><img src="./assets/player-cards/1by1-chefs/thumbs/queue.webp" alt="Queue" title="Queue" width="120" /></a>
<a href="./docs/cards/1by1-chefs--devrel.md"><img src="./assets/player-cards/1by1-chefs/thumbs/devrel.webp" alt="DevRel" title="DevRel" width="120" /></a>
<a href="./docs/characters/runtime-riku.md"><img src="./assets/player-cards/1by1-chefs/thumbs/runtime-riku.webp" alt="Runtime Riku" title="Runtime Riku" width="120" /></a>
<a href="./docs/characters/incident-kitsune.md"><img src="./assets/player-cards/1by1-chefs/thumbs/incident-kitsune.webp" alt="Incident Kitsune" title="Incident Kitsune" width="120" /></a>
<a href="./docs/characters/grafana-mei.md"><img src="./assets/player-cards/1by1-chefs/thumbs/grafana-mei.webp" alt="Grafana Mei" title="Grafana Mei" width="120" /></a>
<a href="./docs/cards/1by1-chefs--human-liaison.md"><img src="./assets/player-cards/1by1-chefs/thumbs/human-liaison.webp" alt="Human Liaison" title="Human Liaison" width="120" /></a>
<a href="./docs/cards/1by1-chefs--scheduler.md"><img src="./assets/player-cards/1by1-chefs/thumbs/scheduler.webp" alt="Scheduler" title="Scheduler" width="120" /></a>
<a href="./docs/characters/garnish-ghost.md"><img src="./assets/player-cards/1by1-chefs/thumbs/garnish-ghost-2.webp" alt="Garnish Ghost" title="Garnish Ghost" width="120" /></a>
<a href="./docs/characters/glaze-whisperer.md"><img src="./assets/player-cards/1by1-chefs/thumbs/glaze-whisperer.webp" alt="Glaze Whisperer" title="Glaze Whisperer" width="120" /></a>
<a href="./docs/characters/recipe-ranger.md"><img src="./assets/player-cards/1by1-chefs/thumbs/recipe-ranger.webp" alt="Recipe Ranger" title="Recipe Ranger" width="120" /></a>
<a href="./docs/characters/portal-rei.md"><img src="./assets/player-cards/1by1-chefs/thumbs/portal-rei.webp" alt="Portal Rei" title="Portal Rei" width="120" /></a>
<a href="./docs/cards/1by1-chefs--pen-tester.md"><img src="./assets/player-cards/1by1-chefs/thumbs/pen-tester.webp" alt="Pen Tester" title="Pen Tester" width="120" /></a>
<a href="./docs/characters/no-waste-ninja.md"><img src="./assets/player-cards/1by1-chefs/thumbs/no-waste-ninja.webp" alt="No-Waste Ninja" title="No-Waste Ninja" width="120" /></a>
<a href="./docs/characters/kitchen-conductor.md"><img src="./assets/player-cards/1by1-chefs/thumbs/kitchen-conductor.webp" alt="Kitchen Conductor" title="Kitchen Conductor" width="120" /></a>
<a href="./docs/characters/build-kun.md"><img src="./assets/player-cards/1by1-chefs/thumbs/build-kun.webp" alt="Build-Kun" title="Build-Kun" width="120" /></a>
<a href="./docs/cards/1by1-chefs--architect.md"><img src="./assets/player-cards/1by1-chefs/thumbs/architect.webp" alt="Architect" title="Architect" width="120" /></a>
<a href="./docs/characters/harvest-hex.md"><img src="./assets/player-cards/1by1-chefs/thumbs/harvest-hex.webp" alt="Harvest Hex" title="Harvest Hex" width="120" /></a>
<a href="./docs/characters/stock-sage.md"><img src="./assets/player-cards/1by1-chefs/thumbs/stock-sage.webp" alt="Stock Sage" title="Stock Sage" width="120" /></a>
<a href="./docs/characters/oil-oracle.md"><img src="./assets/player-cards/1by1-chefs/thumbs/oil-oracle.webp" alt="Oil Oracle" title="Oil Oracle" width="120" /></a>
<a href="./docs/characters/nina-promoter.md"><img src="./assets/player-cards/1by1-chefs/thumbs/nina-promoter.webp" alt="Nina Promoter" title="Nina Promoter" width="120" /></a>
<a href="./docs/characters/token-toshi.md"><img src="./assets/player-cards/1by1-chefs/thumbs/token-toshi.webp" alt="Token Toshi" title="Token Toshi" width="120" /></a>
<a href="./docs/characters/kuro-guard.md"><img src="./assets/player-cards/1by1-chefs/thumbs/kuro-guard.webp" alt="Kuro Guard" title="Kuro Guard" width="120" /></a>
<a href="./docs/characters/shift-sentinel.md"><img src="./assets/player-cards/1by1-chefs/thumbs/shift-sentinel-2.webp" alt="Shift Sentinel" title="Shift Sentinel" width="120" /></a>
<a href="./docs/characters/temp-tamer.md"><img src="./assets/player-cards/1by1-chefs/thumbs/temp-tamer.webp" alt="Temp Tamer" title="Temp Tamer" width="120" /></a>
<a href="./docs/characters/cve-kumo.md"><img src="./assets/player-cards/1by1-chefs/thumbs/cve-kumo.webp" alt="CVE Kumo" title="CVE Kumo" width="120" /></a>
<a href="./docs/characters/scale-oni.md"><img src="./assets/player-cards/1by1-chefs/thumbs/scale-oni-2.webp" alt="Scale Oni" title="Scale Oni" width="120" /></a>
<a href="./docs/characters/prep-pulse.md"><img src="./assets/player-cards/1by1-chefs/thumbs/prep-pulse.webp" alt="Prep Pulse" title="Prep Pulse" width="120" /></a>
<a href="./docs/characters/herb-whisperer.md"><img src="./assets/player-cards/1by1-chefs/thumbs/herb-whisperer.webp" alt="Herb Whisperer" title="Herb Whisperer" width="120" /></a>
<a href="./docs/characters/kurogami-senpai.md"><img src="./assets/player-cards/1by1-chefs/thumbs/kurogami-senpai.webp" alt="Kurogami Senpai" title="Kurogami Senpai" width="120" /></a>
<a href="./docs/characters/fermenta.md"><img src="./assets/player-cards/1by1-chefs/thumbs/fermenta.webp" alt="Fermenta" title="Fermenta" width="120" /></a>
<a href="./docs/characters/crisp-master.md"><img src="./assets/player-cards/1by1-chefs/thumbs/crisp-master.webp" alt="Crisp Master" title="Crisp Master" width="120" /></a>
<a href="./docs/characters/beacon-broil.md"><img src="./assets/player-cards/1by1-chefs/thumbs/beacon-broil.webp" alt="Beacon Broil" title="Beacon Broil" width="120" /></a>
<a href="./docs/characters/timer-tactician.md"><img src="./assets/player-cards/1by1-chefs/thumbs/timer-tactician.webp" alt="Timer Tactician" title="Timer Tactician" width="120" /></a>
<a href="./docs/characters/plate-inspector.md"><img src="./assets/player-cards/1by1-chefs/thumbs/plate-inspector.webp" alt="Plate Inspector" title="Plate Inspector" width="120" /></a>
<a href="./docs/characters/sear-samurai.md"><img src="./assets/player-cards/1by1-chefs/thumbs/sear-samurai-2.webp" alt="Sear Samurai" title="Sear Samurai" width="120" /></a>
<a href="./docs/characters/grain-guardian.md"><img src="./assets/player-cards/1by1-chefs/thumbs/grain-guardian.webp" alt="Grain Guardian" title="Grain Guardian" width="120" /></a>
<a href="./docs/characters/flavor-scribe.md"><img src="./assets/player-cards/1by1-chefs/thumbs/flavor-scribe.webp" alt="Flavor Scribe" title="Flavor Scribe" width="120" /></a>
<a href="./docs/characters/menu-maestro.md"><img src="./assets/player-cards/1by1-chefs/thumbs/menu-maestro.webp" alt="Menu Maestro" title="Menu Maestro" width="120" /></a>
<a href="./docs/characters/null-chan.md"><img src="./assets/player-cards/1by1-chefs/thumbs/null-chan.webp" alt="Null-chan" title="Null-chan" width="120" /></a>
<a href="./docs/cards/1by1-chefs--firewall.md"><img src="./assets/player-cards/1by1-chefs/thumbs/firewall.webp" alt="Firewall" title="Firewall" width="120" /></a>
<a href="./docs/characters/smoke-monk.md"><img src="./assets/player-cards/1by1-chefs/thumbs/smoke-monk.webp" alt="Smoke Monk" title="Smoke Monk" width="120" /></a>
<a href="./docs/characters/supply-scout.md"><img src="./assets/player-cards/1by1-chefs/thumbs/supply-scout.webp" alt="Supply Scout" title="Supply Scout" width="120" /></a>
<a href="./docs/characters/seira.md"><img src="./assets/player-cards/1by1-chefs/thumbs/seira.webp" alt="Seira" title="Seira" width="120" /></a>
<a href="./docs/characters/kombu-keeper.md"><img src="./assets/player-cards/1by1-chefs/thumbs/kombu-keeper.webp" alt="Kombu Keeper" title="Kombu Keeper" width="120" /></a>
<a href="./docs/characters/veg-virtuoso.md"><img src="./assets/player-cards/1by1-chefs/thumbs/virtuoso.webp" alt="Virtuoso" title="Virtuoso" width="120" /></a>
<a href="./docs/characters/portion-paladin.md"><img src="./assets/player-cards/1by1-chefs/thumbs/portion-paladin.webp" alt="Portion Paladin" title="Portion Paladin" width="120" /></a>
</p>

</details>

<details>
<summary><b>Cartoon Chefs</b> — 75 cards (1 matched to characters)</summary>

<p>
<a href="./docs/cards/cartoon-chefs--img_5929.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5929.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5930.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5930.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5931.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5931.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5932.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5932.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5933.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5933.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5934.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5934.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5935.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5935.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5936.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5936.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5937.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5937.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5938.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5938.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5939.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5939.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/characters/kaji.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/kaji.webp" alt="Kaji" title="Kaji" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5942.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5942.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5943.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5943.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5944-2.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5944-2.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5945.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5945.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5946.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5946.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5947.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5947.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5948.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5948.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5949.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5949.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5950.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5950.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5951.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5951.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5952.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5952.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5953.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5953.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5954.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5954.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5955.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5955.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5956.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5956.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5957.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5957.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5958.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5958.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5959.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5959.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5960.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5960.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5961.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5961.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5962.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5962.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5963.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5963.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5964.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5964.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5965.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5965.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5966.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5966.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5967.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5967.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5968.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5968.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5969.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5969.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5970.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5970.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5971.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5971.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5972.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5972.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5973.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5973.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5974.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5974.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5975.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5975.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5976.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5976.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5977.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5977.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5978.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5978.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5979.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5979.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5980.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5980.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5981.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5981.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5982.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5982.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5983.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5983.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5984.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5984.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5985.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5985.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5986.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5986.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5987.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5987.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5988.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5988.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5989.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5989.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5990.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5990.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5991.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5991.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5992.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5992.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5993.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5993.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5994.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5994.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5995.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5995.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5996.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5996.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5997.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5997.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5998.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5998.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_5999.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_5999.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_6001.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_6001.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_6002.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_6002.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_6003.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_6003.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_6004.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_6004.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/cartoon-chefs--img_6005.md"><img src="./assets/player-cards/cartoon-chefs/thumbs/img_6005.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
</p>

</details>

<details>
<summary><b>Character Building Theme</b> — 18 cards (9 matched to characters)</summary>

<p>
<a href="./docs/characters/canary-taster.md"><img src="./assets/player-cards/character-building/thumbs/canary-taster.webp" alt="Canary Taster" title="Canary Taster" width="120" /></a>
<a href="./docs/characters/build-kun.md"><img src="./assets/player-cards/character-building/thumbs/build-kun.webp" alt="Build-Kun" title="Build-Kun" width="120" /></a>
<a href="./docs/characters/orchestra-core.md"><img src="./assets/player-cards/character-building/thumbs/orchestra-core.webp" alt="Orchestra Core" title="Orchestra Core" width="120" /></a>
<a href="./docs/characters/seira.md"><img src="./assets/player-cards/character-building/thumbs/seira.webp" alt="Seira" title="Seira" width="120" /></a>
<a href="./docs/cards/character-building--harmonyvs-entropy.md"><img src="./assets/player-cards/character-building/thumbs/harmonyvs-entropy.webp" alt="Harmonyvs.Entropy" title="Harmonyvs.Entropy" width="120" /></a>
<a href="./docs/cards/character-building--miseos.md"><img src="./assets/player-cards/character-building/thumbs/miseos.webp" alt="MiseOs" title="MiseOs" width="120" /></a>
<a href="./docs/cards/character-building--miseos-2.md"><img src="./assets/player-cards/character-building/thumbs/miseos-2.webp" alt="MiseOs" title="MiseOs" width="120" /></a>
<a href="./docs/cards/character-building--italiay.md"><img src="./assets/player-cards/character-building/thumbs/italiay.webp" alt="Italiay" title="Italiay" width="120" /></a>
<a href="./docs/characters/lattice.md"><img src="./assets/player-cards/character-building/thumbs/lattice.webp" alt="Lattice" title="Lattice" width="120" /></a>
<a href="./docs/cards/character-building--mise.md"><img src="./assets/player-cards/character-building/thumbs/mise.webp" alt="MISE" title="MISE" width="120" /></a>
<a href="./docs/characters/lattice.md"><img src="./assets/player-cards/character-building/thumbs/lattice-2.webp" alt="Lattice" title="Lattice" width="120" /></a>
<a href="./docs/cards/character-building--specialist-tier.md"><img src="./assets/player-cards/character-building/thumbs/specialist-tier.webp" alt="Specialist Tier" title="Specialist Tier" width="120" /></a>
<a href="./docs/characters/mizu.md"><img src="./assets/player-cards/character-building/thumbs/prepare.webp" alt="Mizu" title="Mizu" width="120" /></a>
<a href="./docs/cards/character-building--img_4556.md"><img src="./assets/player-cards/character-building/thumbs/img_4556.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/characters/orchestra-core.md"><img src="./assets/player-cards/character-building/thumbs/orchestra-core-2.webp" alt="Orchestra Core" title="Orchestra Core" width="120" /></a>
<a href="./docs/cards/character-building--data-lnsights.md"><img src="./assets/player-cards/character-building/thumbs/data-lnsights.webp" alt="Data/lnsights" title="Data/lnsights" width="120" /></a>
<a href="./docs/characters/release-conductor.md"><img src="./assets/player-cards/character-building/thumbs/release-conductor.webp" alt="Release Conductor" title="Release Conductor" width="120" /></a>
<a href="./docs/cards/character-building--focus.md"><img src="./assets/player-cards/character-building/thumbs/focus.webp" alt="Focus:" title="Focus:" width="120" /></a>
</p>

</details>

<details>
<summary><b>Mise Orchestra Trading Cards (Season 1)</b> — 23 cards (23 matched to characters)</summary>

<p>
<a href="./docs/characters/kurogami-senpai.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/kurogami-senpai.webp" alt="Kurogami Senpai" title="Kurogami Senpai" width="120" /></a>
<a href="./docs/characters/tensho.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/tensho.webp" alt="Tensho" title="Tensho" width="120" /></a>
<a href="./docs/characters/mizu.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/mizu.webp" alt="Mizu" title="Mizu" width="120" /></a>
<a href="./docs/characters/umami-code.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/umami-code.webp" alt="Umami Code" title="Umami Code" width="120" /></a>
<a href="./docs/characters/kaji.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/kaji.webp" alt="Kaji" title="Kaji" width="120" /></a>
<a href="./docs/characters/yume.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/yume.webp" alt="Yume" title="Yume" width="120" /></a>
<a href="./docs/characters/iron-hashi.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/iron-hashi.webp" alt="Iron Hashi" title="Iron Hashi" width="120" /></a>
<a href="./docs/characters/null-chan.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/null-chan.webp" alt="Null-chan" title="Null-chan" width="120" /></a>
<a href="./docs/characters/flash-riku.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/flash-riku.webp" alt="Flash Riku" title="Flash Riku" width="120" /></a>
<a href="./docs/characters/seira.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/seira.webp" alt="Seira" title="Seira" width="120" /></a>
<a href="./docs/characters/kuro-guard.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/kuro-guard.webp" alt="Kuro Guard" title="Kuro Guard" width="120" /></a>
<a href="./docs/characters/scale-oni.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/scale-oni.webp" alt="Scale Oni" title="Scale Oni" width="120" /></a>
<a href="./docs/characters/build-kun.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/build-kun.webp" alt="Build-Kun" title="Build-Kun" width="120" /></a>
<a href="./docs/characters/streama.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/streama.webp" alt="Streama" title="Streama" width="120" /></a>
<a href="./docs/characters/orchestra-core.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/orchestra-core.webp" alt="Orchestra Core" title="Orchestra Core" width="120" /></a>
<a href="./docs/characters/canary-taster.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/canary-taster.webp" alt="Canary Taster" title="Canary Taster" width="120" /></a>
<a href="./docs/characters/metrics-miko.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/metrics-miko.webp" alt="Metrics Miko" title="Metrics Miko" width="120" /></a>
<a href="./docs/characters/slo-sage.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/slo-sage.webp" alt="SLO Sage" title="SLO Sage" width="120" /></a>
<a href="./docs/characters/data-chan.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/data-chan.webp" alt="Data Chan" title="Data Chan" width="120" /></a>
<a href="./docs/characters/insight-sensei.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/insight-sensei.webp" alt="Insight Sensei" title="Insight Sensei" width="120" /></a>
<a href="./docs/characters/chaos-analyst.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/chaos-analyst.webp" alt="Chaos Analyst" title="Chaos Analyst" width="120" /></a>
<a href="./docs/characters/growth-guru.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/growth-guru.webp" alt="Growth Guru" title="Growth Guru" width="120" /></a>
<a href="./docs/characters/culture-chef.md"><img src="./assets/player-cards/orchestra-trading-cards/thumbs/culture-chef.webp" alt="Culture Chef" title="Culture Chef" width="120" /></a>
</p>

</details>

<details>
<summary><b>Final Roster</b> — 1 cards (1 matched to characters)</summary>

<p>
<a href="./docs/characters/flavor-hacker.md"><img src="./assets/player-cards/final-roster/thumbs/flavor-hacker.webp" alt="Flavor Hacker" title="Flavor Hacker" width="120" /></a>
</p>

</details>

<details>
<summary><b>Registry Catalogue Pages</b> — 3 cards (3 matched to characters)</summary>

<p>
<a href="./docs/characters/allergen-oracle.md"><img src="./assets/player-cards/registry-pages/thumbs/allergen-oracle.webp" alt="Allergen Oracle" title="Allergen Oracle" width="120" /></a>
<a href="./docs/characters/sear-samurai.md"><img src="./assets/player-cards/registry-pages/thumbs/sear-samurai.webp" alt="Sear Samurai" title="Sear Samurai" width="120" /></a>
<a href="./docs/characters/nudge-neko.md"><img src="./assets/player-cards/registry-pages/thumbs/nudge-neko.webp" alt="Nudge Neko" title="Nudge Neko" width="120" /></a>
</p>

</details>

<details>
<summary><b>Studio Art & Screens</b> — 24 cards (9 matched to characters)</summary>

<p>
<a href="./docs/characters/tensho.md"><img src="./assets/player-cards/icloud-screens/thumbs/tensho.webp" alt="Tensho" title="Tensho" width="120" /></a>
<a href="./docs/cards/icloud-screens--fork-fable.md"><img src="./assets/player-cards/icloud-screens/thumbs/fork-fable.webp" alt="Fork Fable" title="Fork Fable" width="120" /></a>
<a href="./docs/characters/iron-hashi.md"><img src="./assets/player-cards/icloud-screens/thumbs/iron-hashi.webp" alt="Iron Hashi" title="Iron Hashi" width="120" /></a>
<a href="./docs/cards/icloud-screens--mise.md"><img src="./assets/player-cards/icloud-screens/thumbs/mise.webp" alt="MISE" title="MISE" width="120" /></a>
<a href="./docs/cards/icloud-screens--8309bbe1-e173-43bc-9cbb-bb510b648f67.md"><img src="./assets/player-cards/icloud-screens/thumbs/8309bbe1-e173-43bc-9cbb-bb510b648f67.webp" alt="MiseOS card" title="MiseOS card" width="120" /></a>
<a href="./docs/cards/icloud-screens--miseos.md"><img src="./assets/player-cards/icloud-screens/thumbs/miseos.webp" alt="@miseos" title="@miseos" width="120" /></a>
<a href="./docs/characters/kuro-guard.md"><img src="./assets/player-cards/icloud-screens/thumbs/kuro-guard.webp" alt="Kuro Guard" title="Kuro Guard" width="120" /></a>
<a href="./docs/cards/icloud-screens--miseorchestra.md"><img src="./assets/player-cards/icloud-screens/thumbs/miseorchestra.webp" alt="MISEORCHESTRA" title="MISEORCHESTRA" width="120" /></a>
<a href="./docs/cards/icloud-screens--v1-0-0.md"><img src="./assets/player-cards/icloud-screens/thumbs/v1-0-0.webp" alt="v1.0.0" title="v1.0.0" width="120" /></a>
<a href="./docs/cards/icloud-screens--token-taro.md"><img src="./assets/player-cards/icloud-screens/thumbs/token-taro.webp" alt="Token Taro" title="Token Taro" width="120" /></a>
<a href="./docs/characters/kaji.md"><img src="./assets/player-cards/icloud-screens/thumbs/kaji.webp" alt="Kaji" title="Kaji" width="120" /></a>
<a href="./docs/cards/icloud-screens--frostbyte.md"><img src="./assets/player-cards/icloud-screens/thumbs/frostbyte.webp" alt="Frostbyte" title="Frostbyte" width="120" /></a>
<a href="./docs/characters/kurogami-senpai.md"><img src="./assets/player-cards/icloud-screens/thumbs/kurogami-senpai.webp" alt="Kurogami Senpai" title="Kurogami Senpai" width="120" /></a>
<a href="./docs/cards/icloud-screens--one-kitchen-many-spirits.md"><img src="./assets/player-cards/icloud-screens/thumbs/one-kitchen-many-spirits.webp" alt="One kitchen.Many spirits." title="One kitchen.Many spirits." width="120" /></a>
<a href="./docs/characters/tensho.md"><img src="./assets/player-cards/icloud-screens/thumbs/tensho-2.webp" alt="Tensho" title="Tensho" width="120" /></a>
<a href="./docs/cards/icloud-screens--enter-the-kitohen-table.md"><img src="./assets/player-cards/icloud-screens/thumbs/enter-the-kitohen-table.webp" alt="Enter The-Kitohen Table →" title="Enter The-Kitohen Table →" width="120" /></a>
<a href="./docs/characters/kuro-guard.md"><img src="./assets/player-cards/icloud-screens/thumbs/kuro-guard-2.webp" alt="Kuro Guard" title="Kuro Guard" width="120" /></a>
<a href="./docs/cards/icloud-screens--a10-layerdefensibilitymoatprotects-thegr.md"><img src="./assets/player-cards/icloud-screens/thumbs/a10-layerdefensibilitymoatprotects-thegr.webp" alt="A10-layerdefensibilitymoatprotects theGreatKitchen." title="A10-layerdefensibilitymoatprotects theGreatKitchen." width="120" /></a>
<a href="./docs/cards/icloud-screens--pokeframe-019f3676-d05f-76c1-bcfb-a3851bb189e3.md"><img src="./assets/player-cards/icloud-screens/thumbs/pokeframe-019f3676-d05f-76c1-bcfb-a3851bb189e3.webp" alt="黑神先辈" title="黑神先辈" width="120" /></a>
<a href="./docs/cards/icloud-screens--create-image.md"><img src="./assets/player-cards/icloud-screens/thumbs/create-image.webp" alt="Create Image" title="Create Image" width="120" /></a>
<a href="./docs/cards/icloud-screens--orion-arkforge.md"><img src="./assets/player-cards/icloud-screens/thumbs/orion-arkforge.webp" alt="Orion Arkforge" title="Orion Arkforge" width="120" /></a>
<a href="./docs/cards/icloud-screens--v1-0-0-2.md"><img src="./assets/player-cards/icloud-screens/thumbs/v1-0-0-2.webp" alt="v1.0.0" title="v1.0.0" width="120" /></a>
<a href="./docs/characters/null-chan.md"><img src="./assets/player-cards/icloud-screens/thumbs/null-chan.webp" alt="Null-chan" title="Null-chan" width="120" /></a>
<a href="./docs/characters/canary-taster.md"><img src="./assets/player-cards/icloud-screens/thumbs/canary-taster.webp" alt="Canary Taster" title="Canary Taster" width="120" /></a>
</p>

</details>

## Characters

<a href="./docs/characters/build-kun.md"><img src="./assets/characters/build-kun/profile.svg" alt="Build-Kun" width="120" /></a>
<a href="./docs/characters/canary-judge.md"><img src="./assets/characters/canary-judge/profile.svg" alt="Canary Judge" width="120" /></a>
<a href="./docs/characters/data-chan.md"><img src="./assets/characters/data-chan/profile.svg" alt="Data Chan" width="120" /></a>
<a href="./docs/characters/flash-riku.md"><img src="./assets/characters/flash-riku/profile.svg" alt="Flash Riku" width="120" /></a>
<a href="./docs/characters/flavor-scribe.md"><img src="./assets/characters/flavor-scribe/profile.svg" alt="Flavor Scribe" width="120" /></a>
<a href="./docs/characters/garnish-ghost.md"><img src="./assets/characters/garnish-ghost/profile.svg" alt="Garnish Ghost" width="120" /></a>
<a href="./docs/characters/growth-guru.md"><img src="./assets/characters/growth-guru/profile.svg" alt="Growth Guru" width="120" /></a>
<a href="./docs/characters/kaji.md"><img src="./assets/characters/kaji/profile.svg" alt="Kaji" width="120" /></a>
<a href="./docs/characters/kuro-guard.md"><img src="./assets/characters/kuro-guard/profile.svg" alt="Kuro Guard" width="120" /></a>
<a href="./docs/characters/ladle-lumen.md"><img src="./assets/characters/ladle-lumen/profile.svg" alt="Ladle Lumen" width="120" /></a>
<a href="./docs/characters/ledger-ladle.md"><img src="./assets/characters/ledger-ladle/profile.svg" alt="Ledger Ladle" width="120" /></a>
<a href="./docs/characters/mizu.md"><img src="./assets/characters/mizu/profile.svg" alt="Mizu" width="120" /></a>
<a href="./docs/characters/null-chan.md"><img src="./assets/characters/null-chan/profile.svg" alt="Null-chan" width="120" /></a>
<a href="./docs/characters/orchestra-core.md"><img src="./assets/characters/orchestra-core/profile.svg" alt="Orchestra Core" width="120" /></a>
<a href="./docs/characters/policy-kenji.md"><img src="./assets/characters/policy-kenji/profile.svg" alt="Policy Kenji" width="120" /></a>
<a href="./docs/characters/prep-pulse.md"><img src="./assets/characters/prep-pulse/profile.svg" alt="Prep Pulse" width="120" /></a>
<a href="./docs/characters/queue-quartz.md"><img src="./assets/characters/queue-quartz/profile.svg" alt="Queue Quartz" width="120" /></a>
<a href="./docs/characters/scale-oni.md"><img src="./assets/characters/scale-oni/profile.svg" alt="Scale Oni" width="120" /></a>
<a href="./docs/characters/seira.md"><img src="./assets/characters/seira/profile.svg" alt="Seira" width="120" /></a>
<a href="./docs/characters/tensho.md"><img src="./assets/characters/tensho/profile.svg" alt="Tensho" width="120" /></a>
<a href="./docs/characters/timer-tactician.md"><img src="./assets/characters/timer-tactician/profile.svg" alt="Timer Tactician" width="120" /></a>
<a href="./docs/characters/vacuum-vesper.md"><img src="./assets/characters/vacuum-vesper/profile.svg" alt="Vacuum Vesper" width="120" /></a>
<a href="./docs/characters/yume.md"><img src="./assets/characters/yume/profile.svg" alt="Yume" width="120" /></a>
<a href="./docs/characters/seira-scan.md"><img src="./assets/characters/seira-scan/profile.svg" alt="Seira Scan" width="120" /></a>
<a href="./docs/characters/beacon-broil.md"><img src="./assets/characters/beacon-broil/profile.svg" alt="Beacon Broil" width="120" /></a>
<a href="./docs/characters/kurogami-senpai.md"><img src="./assets/characters/kurogami-senpai/profile.svg" alt="Kurogami Senpai" width="120" /></a>
<a href="./docs/characters/plate-inspector.md"><img src="./assets/characters/plate-inspector/profile.svg" alt="Plate Inspector" width="120" /></a>
<a href="./docs/characters/reserve-rune.md"><img src="./assets/characters/reserve-rune/profile.svg" alt="Reserve Rune" width="120" /></a>
<a href="./docs/characters/velvet-vesper.md"><img src="./assets/characters/velvet-vesper/profile.svg" alt="Velvet Vesper" width="120" /></a>
<a href="./docs/characters/culture-chef.md"><img src="./assets/characters/culture-chef/profile.svg" alt="Culture Chef" width="120" /></a>
<a href="./docs/characters/cve-kumo.md"><img src="./assets/characters/cve-kumo/profile.svg" alt="CVE Kumo" width="120" /></a>
<a href="./docs/characters/hugo-matrix.md"><img src="./assets/characters/hugo-matrix/profile.svg" alt="Hugo Matrix" width="120" /></a>
<a href="./docs/characters/insight-sensei.md"><img src="./assets/characters/insight-sensei/profile.svg" alt="Insight Sensei" width="120" /></a>
<a href="./docs/characters/iron-hashi.md"><img src="./assets/characters/iron-hashi/profile.svg" alt="Iron Hashi" width="120" /></a>
<a href="./docs/characters/yume-builder.md"><img src="./assets/characters/yume-builder/profile.svg" alt="Yume Builder" width="120" /></a>
<a href="./docs/characters/alko-commit-chef.md"><img src="./assets/characters/alko-commit-chef/profile.svg" alt="Alko Commit Chef" width="120" /></a>
<a href="./docs/characters/crate-courier.md"><img src="./assets/characters/crate-courier/profile.svg" alt="Crate Courier" width="120" /></a>
<a href="./docs/characters/flavor-forager.md"><img src="./assets/characters/flavor-forager/profile.svg" alt="Flavor Forager" width="120" /></a>
<a href="./docs/characters/metrics-miko.md"><img src="./assets/characters/metrics-miko/profile.svg" alt="Metrics Miko" width="120" /></a>
<a href="./docs/characters/bruno-blast-radius.md"><img src="./assets/characters/bruno-blast-radius/profile.svg" alt="Bruno Blast Radius" width="120" /></a>
<a href="./docs/characters/lila-branchkeeper.md"><img src="./assets/characters/lila-branchkeeper/profile.svg" alt="Lila Branchkeeper" width="120" /></a>
<a href="./docs/characters/omar-reviewer.md"><img src="./assets/characters/omar-reviewer/profile.svg" alt="Omar Reviewer" width="120" /></a>
<a href="./docs/characters/nina-promoter.md"><img src="./assets/characters/nina-promoter/profile.svg" alt="Nina Promoter" width="120" /></a>
<a href="./docs/characters/release-conductor.md"><img src="./assets/characters/release-conductor/profile.svg" alt="Release Conductor" width="120" /></a>
<a href="./docs/characters/felix-rollback.md"><img src="./assets/characters/felix-rollback/profile.svg" alt="Felix Rollback" width="120" /></a>
<a href="./docs/characters/tariq-notesmith.md"><img src="./assets/characters/tariq-notesmith/profile.svg" alt="Tariq Notesmith" width="120" /></a>
<a href="./docs/characters/ivun-cache.md"><img src="./assets/characters/ivun-cache/profile.svg" alt="Ivun Cache" width="120" /></a>
<a href="./docs/characters/canary-taster.md"><img src="./assets/characters/canary-taster/profile.svg" alt="Canary Taster" width="120" /></a>
<a href="./docs/characters/pipeline-sensei.md"><img src="./assets/characters/pipeline-sensei/profile.svg" alt="Pipeline Sensei" width="120" /></a>
<a href="./docs/characters/template-tanaka.md"><img src="./assets/characters/template-tanaka/profile.svg" alt="Template Tanaka" width="120" /></a>
<a href="./docs/characters/bootstrap-aiko.md"><img src="./assets/characters/bootstrap-aiko/profile.svg" alt="Bootstrap Aiko" width="120" /></a>
<a href="./docs/characters/terra-forge.md"><img src="./assets/characters/terra-forge/profile.svg" alt="Terra Forge" width="120" /></a>
<a href="./docs/characters/schema-sora.md"><img src="./assets/characters/schema-sora/profile.svg" alt="Schema Sora" width="120" /></a>
<a href="./docs/characters/runtime-riku.md"><img src="./assets/characters/runtime-riku/profile.svg" alt="Runtime Riku" width="120" /></a>
<a href="./docs/characters/vault-hana.md"><img src="./assets/characters/vault-hana/profile.svg" alt="Vault Hana" width="120" /></a>
<a href="./docs/characters/streama.md"><img src="./assets/characters/streama/profile.svg" alt="Streama" width="120" /></a>
<a href="./docs/characters/preview-yuki.md"><img src="./assets/characters/preview-yuki/profile.svg" alt="Preview Yuki" width="120" /></a>
<a href="./docs/characters/portal-rei.md"><img src="./assets/characters/portal-rei/profile.svg" alt="Portal Rei" width="120" /></a>
<a href="./docs/characters/guardrail-goro.md"><img src="./assets/characters/guardrail-goro/profile.svg" alt="Guardrail Goro" width="120" /></a>
<a href="./docs/characters/platform-sensei.md"><img src="./assets/characters/platform-sensei/profile.svg" alt="Platform Sensei" width="120" /></a>
<a href="./docs/characters/slo-sage.md"><img src="./assets/characters/slo-sage/profile.svg" alt="SLO Sage" width="120" /></a>
<a href="./docs/characters/trace-sensei.md"><img src="./assets/characters/trace-sensei/profile.svg" alt="Trace Sensei" width="120" /></a>
<a href="./docs/characters/chaos-kaito.md"><img src="./assets/characters/chaos-kaito/profile.svg" alt="Chaos Kaito" width="120" /></a>
<a href="./docs/characters/capacity-kanna.md"><img src="./assets/characters/capacity-kanna/profile.svg" alt="Capacity Kanna" width="120" /></a>
<a href="./docs/characters/alert-akira.md"><img src="./assets/characters/alert-akira/profile.svg" alt="Alert Akira" width="120" /></a>
<a href="./docs/characters/allergen-oracle.md"><img src="./assets/characters/allergen-oracle/profile.svg" alt="Allergen Oracle" width="120" /></a>
<a href="./docs/characters/anomaly-aki.md"><img src="./assets/characters/anomaly-aki/profile.svg" alt="Anomaly Aki" width="120" /></a>
<a href="./docs/characters/apprentice-kai.md"><img src="./assets/characters/apprentice-kai/profile.svg" alt="Apprentice Kai" width="120" /></a>
<a href="./docs/characters/auditor-emi.md"><img src="./assets/characters/auditor-emi/profile.svg" alt="Auditor Emi" width="120" /></a>
<a href="./docs/characters/backlog-benji.md"><img src="./assets/characters/backlog-benji/profile.svg" alt="Backlog Benji" width="120" /></a>
<a href="./docs/characters/chaos-analyst.md"><img src="./assets/characters/chaos-analyst/profile.svg" alt="Chaos Analyst" width="120" /></a>
<a href="./docs/characters/container-kage.md"><img src="./assets/characters/container-kage/profile.svg" alt="Container Kage" width="120" /></a>
<a href="./docs/characters/cost-kaito.md"><img src="./assets/characters/cost-kaito/profile.svg" alt="Cost Kaito" width="120" /></a>
<a href="./docs/characters/dora-daichi.md"><img src="./assets/characters/dora-daichi/profile.svg" alt="DORA Daichi" width="120" /></a>
<a href="./docs/characters/dx-mei.md"><img src="./assets/characters/dx-mei/profile.svg" alt="DX Mei" width="120" /></a>
<a href="./docs/characters/evidence-scribe.md"><img src="./assets/characters/evidence-scribe/profile.svg" alt="Evidence Scribe" width="120" /></a>
<a href="./docs/characters/flag-fox.md"><img src="./assets/characters/flag-fox/profile.svg" alt="Flag Fox" width="120" /></a>
<a href="./docs/characters/forecast-fuji.md"><img src="./assets/characters/forecast-fuji/profile.svg" alt="Forecast Fuji" width="120" /></a>
<a href="./docs/characters/grafana-mei.md"><img src="./assets/characters/grafana-mei/profile.svg" alt="Grafana Mei" width="120" /></a>
<a href="./docs/characters/harvest-hex.md"><img src="./assets/characters/harvest-hex/profile.svg" alt="Harvest Hex" width="120" /></a>
<a href="./docs/characters/impact-ichi.md"><img src="./assets/characters/impact-ichi/profile.svg" alt="Impact Ichi" width="120" /></a>
<a href="./docs/characters/incident-kitsune.md"><img src="./assets/characters/incident-kitsune/profile.svg" alt="Incident Kitsune" width="120" /></a>
<a href="./docs/characters/lake-haru.md"><img src="./assets/characters/lake-haru/profile.svg" alt="Lake Haru" width="120" /></a>
<a href="./docs/characters/lattice.md"><img src="./assets/characters/lattice/profile.svg" alt="Lattice" width="120" /></a>
<a href="./docs/characters/leaderboard-leo.md"><img src="./assets/characters/leaderboard-leo/profile.svg" alt="Leaderboard Leo" width="120" /></a>
<a href="./docs/characters/merge-sentinel.md"><img src="./assets/characters/merge-sentinel/profile.svg" alt="Merge Sentinel" width="120" /></a>
<a href="./docs/characters/nudge-neko.md"><img src="./assets/characters/nudge-neko/profile.svg" alt="Nudge Neko" width="120" /></a>
<a href="./docs/characters/oncall-naomi.md"><img src="./assets/characters/oncall-naomi/profile.svg" alt="OnCall Naomi" width="120" /></a>
<a href="./docs/characters/pager-hiro.md"><img src="./assets/characters/pager-hiro/profile.svg" alt="Pager Hiro" width="120" /></a>
<a href="./docs/characters/pantry-paladin.md"><img src="./assets/characters/pantry-paladin/profile.svg" alt="Pantry Paladin" width="120" /></a>
<a href="./docs/characters/policy-ronin.md"><img src="./assets/characters/policy-ronin/profile.svg" alt="Policy Ronin" width="120" /></a>
<a href="./docs/characters/portion-paladin.md"><img src="./assets/characters/portion-paladin/profile.svg" alt="Portion Paladin" width="120" /></a>
<a href="./docs/characters/queue-mizu.md"><img src="./assets/characters/queue-mizu/profile.svg" alt="Queue Mizu" width="120" /></a>
<a href="./docs/characters/recipe-ranger.md"><img src="./assets/characters/recipe-ranger/profile.svg" alt="Recipe Ranger" width="120" /></a>
<a href="./docs/characters/red-oni.md"><img src="./assets/characters/red-oni/profile.svg" alt="Red Oni" width="120" /></a>
<a href="./docs/characters/reliability-sensei.md"><img src="./assets/characters/reliability-sensei/profile.svg" alt="Reliability Sensei" width="120" /></a>
<a href="./docs/characters/repo-ranger.md"><img src="./assets/characters/repo-ranger/profile.svg" alt="Repo Ranger" width="120" /></a>
<a href="./docs/characters/resilience-ryu.md"><img src="./assets/characters/resilience-ryu/profile.svg" alt="Resilience Ryu" width="120" /></a>
<a href="./docs/characters/revenue-rina.md"><img src="./assets/characters/revenue-rina/profile.svg" alt="Revenue Rina" width="120" /></a>
<a href="./docs/characters/review-ren.md"><img src="./assets/characters/review-ren/profile.svg" alt="Review Ren" width="120" /></a>
<a href="./docs/characters/risk-ryota.md"><img src="./assets/characters/risk-ryota/profile.svg" alt="Risk Ryota" width="120" /></a>
<a href="./docs/characters/roadmap-sensei.md"><img src="./assets/characters/roadmap-sensei/profile.svg" alt="Roadmap Sensei" width="120" /></a>
<a href="./docs/characters/scorecard-shin.md"><img src="./assets/characters/scorecard-shin/profile.svg" alt="Scorecard Shin" width="120" /></a>
<a href="./docs/characters/secure-sakura.md"><img src="./assets/characters/secure-sakura/profile.svg" alt="Secure Sakura" width="120" /></a>
<a href="./docs/characters/seira-vaultkeeper.md"><img src="./assets/characters/seira-vaultkeeper/profile.svg" alt="Seira Vaultkeeper" width="120" /></a>
<a href="./docs/characters/storyteller-sumi.md"><img src="./assets/characters/storyteller-sumi/profile.svg" alt="Storyteller Sumi" width="120" /></a>
<a href="./docs/characters/taxonomy-taka.md"><img src="./assets/characters/taxonomy-taka/profile.svg" alt="Taxonomy Taka" width="120" /></a>
<a href="./docs/characters/threat-taro.md"><img src="./assets/characters/threat-taro/profile.svg" alt="Threat Taro" width="120" /></a>
<a href="./docs/characters/ticket-tactician.md"><img src="./assets/characters/ticket-tactician/profile.svg" alt="Ticket Tactician" width="120" /></a>
<a href="./docs/characters/token-toshi.md"><img src="./assets/characters/token-toshi/profile.svg" alt="Token Toshi" width="120" /></a>
<a href="./docs/characters/umami-code.md"><img src="./assets/characters/umami-code/profile.svg" alt="Umami Code" width="120" /></a>
<a href="./docs/characters/watchtower-yoru.md"><img src="./assets/characters/watchtower-yoru/profile.svg" alt="Watchtower Yoru" width="120" /></a>

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

<p align="center"><img src="./assets/repo-pets/walk-footer.svg" alt="MiseOS repo pets climbing and walking" width="100%" /></p>

## License

MIT for the root registry. Components under `apps/`, `tools/` and `packages/` keep their own LICENSE files.
