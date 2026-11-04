# 🎭 MiseOS: The Kitchen Brigade for Autonomous Development

> **A collectible DevOps orchestra at your fingertips** — every repository becomes a kitchen, every workflow becomes a station, and every AI/operator role becomes an interactive trading card with purpose, process, stats, and team handoffs.

<p align="center">
  <img alt="MiseOS Prototype" src="assets/reference/brand-guidelines-collage.jpeg" width="100%" />
</p>

<p align="center">
  <img alt="MiseOS Core 75" src="https://img.shields.io/badge/Core_Roster-75_Chefs-E97822?style=for-the-badge" />
  <img alt="Expansion Cards" src="https://img.shields.io/badge/Expansion_Overlay-23_Cards-D4AF37?style=for-the-badge" />
  <img alt="Prototype Cards" src="https://img.shields.io/badge/Prototype_Total-92_Cards-2E6B4E?style=for-the-badge" />
  <img alt="No Merge" src="https://img.shields.io/badge/Proof_Only-No_Merge-1B2A41?style=for-the-badge" />
</p>

---

## 🆕 There is a prototype now

Open the interactive proof:

```bash
python3 -m http.server 4175
# then open http://localhost:4175/index.html
```

Or open `index.html` directly from this folder.

The prototype includes:

- Holo/foil character cards with CSS 3D tilt.
- Hover movement for every character card.
- Click-to-open drawer for complete character metadata.
- Department filters and roster search.
- 5 / 7 / 10 / 15 character team folders.
- Exportable data files for repo migration.
- README-ready roster sections modeled after high-signal agent repos, but branded as MiseOS.

---

## 🚀 What Is MiseOS?

MiseOS is **the operating system for autonomous development, properly organized**.

Instead of one vague AI assistant, MiseOS turns the repository into a kitchen brigade:

- **Pipeline chefs** move code from commit to production.
- **Platform chefs** provide golden paths, runtime profiles, and self-service portals.
- **Reliability chefs** watch SLOs, traces, capacity, incidents, and recovery.
- **Security chefs** guard secrets, policies, access, provenance, and compliance.
- **Data & Insight chefs** convert repo activity into dashboards, forecasts, and decisions.
- **Operations / Orchestra chefs** supply the mythic front-line story layer for collectible and social experiences.

Think of it as: **The Agency structure + collectible card UX + DevOps control plane + kitchen mythology.**

---

## ⚡ Quick Start

### Option 1: Run the static prototype

```bash
cd miseos-roster-prototype
python3 -m http.server 4175
```

### Option 2: Copy the README only

```bash
cp README.md /path/to/Mise-OS/README.md
```

### Option 3: Copy the prototype into a repo docs site

```bash
mkdir -p docs/miseos-roster
cp -R index.html assets data docs teams characters .miseos docs/miseos-roster/
```

### Option 4: Use the JSON as app data

```bash
cat data/all-characters.json
cat teams/index.json
cat data/registry-catalog.json
```

---

## 🃏 Character Card System

Each character has:

- **Identity:** name, role, Mise name, codename, department.
- **Visual layer:** card SVG, avatar SVG, color, aura, tool, rarity.
- **Workflow layer:** job name, inputs, outputs, summary, synced agents.
- **Stats:** power, precision, speed, resilience, intelligence, teamwork.
- **Folder:** `characters/<character-id>/README.md` + `metadata.json`.

---

## 🍱 Team Folder System

Each department is exported as a real folder:

```text
teams/
  pipeline/
    TEAM.md
    lineup-5.json
    lineup-7.json
    lineup-10.json
    lineup-15.json
  platform/
  reliability/
  security/
  data-insight/
  operations/
```

Use these lineups as preset deployment squads:

| Pack | Purpose |
|---|---|
| 5-character pack | Minimum viable station team |
| 7-character pack | Focused squad with extra coverage |
| 10-character pack | Brigade lane for bigger repository work |
| 15-character pack | Full department deployment |

---

## 🎨 Brand System

| Token | Hex | Use |
|---|---:|---|
| Umami Black | `#0E0F10` | Premium depth, dark UI, card backs |
| Gold Ladle | `#D4AF37` | Founder/mythic highlights |
| Broth Cream | `#F6F1E7` | Warm readable surfaces |
| Flame Orange | `#E97822` | Pipeline, urgency, release heat |
| Ink Blue | `#1B2A41` | Reliability, observability, platform depth |
| Matcha Green | `#2E6B4E` | Safety, success, healthy execution |

Voice: **technical but playful, metaphor-driven, anime narrative style, emotionally expressive, smart and insightful.**

---

## 🎴 The MiseOS Roster

### Data & Insight Kitchen — Learn. Optimize. Evolve.

| # | Character | Agent Function | Rarity | Source |
|---:|---|---|---|---|
| 61 | [Taxonomy Taka](characters/taxonomy-taka/README.md) | Event Taxonomy Manager | Common | characters.generated.json |
| 62 | [Lake Haru](characters/lake-haru/README.md) | Telemetry Ingestion Pipeline | Common | characters.generated.json |
| 63 | [Lattice](characters/lattice/README.md) | Trace Correlator | Genesis | characters.generated.json |
| 64 | [Repo Ranger](characters/repo-ranger/README.md) | Repo Health Analyzer | Common | characters.generated.json |
| 65 | [DORA Daichi](characters/dora-daichi/README.md) | Pipeline Analytics Engine | Common | characters.generated.json |
| 66 | [Flag Fox](characters/flag-fox/README.md) | Feature Flag Analytics | Common | characters.generated.json |
| 67 | [Cost Kaito](characters/cost-kaito/README.md) | Cost & Efficiency Monitor | Common | characters.generated.json |
| 68 | [DX Mei](characters/dx-mei/README.md) | Developer Experience Survey Loop | Common | characters.generated.json |
| 69 | [Revenue Rina](characters/revenue-rina/README.md) | Customer Behavior → Incident Linker | Common | characters.generated.json |
| 70 | [Risk Ryota](characters/risk-ryota/README.md) | Risk Scoring Model | Rare | characters.generated.json |
| 71 | [Apprentice Kai](characters/apprentice-kai/README.md) | Self-Improvement Agent | Genesis | characters.generated.json |
| 72 | [Anomaly Aki](characters/anomaly-aki/README.md) | Anomaly Detection Studio | Common | characters.generated.json |
| 73 | [Leaderboard Leo](characters/leaderboard-leo/README.md) | Scorecards & Leaderboards | Common | characters.generated.json |
| 74 | [Storyteller Sumi](characters/storyteller-sumi/README.md) | Narrative Report Generator | Common | characters.generated.json |
| 75 | [Roadmap Sensei](characters/roadmap-sensei/README.md) | Strategic Roadmap Recommender | Genesis | characters.generated.json |
| 88 | [Data-chan](characters/data-chan/README.md) | Collect | Rare | mise_orchestra_cards.csv |
| 89 | [Insight Sensei](characters/insight-sensei/README.md) | Analyze | Epic | mise_orchestra_cards.csv |
| 90 | [Chaos Analyst](characters/chaos-analyst/README.md) | Learn | Legendary | mise_orchestra_cards.csv |
| 91 | [Growth Guru](characters/growth-guru/README.md) | Optimize | Epic | mise_orchestra_cards.csv |
| 92 | [Culture Chef](characters/culture-chef/README.md) | Grow | Legendary | mise_orchestra_cards.csv |
### Operations Kitchen — Keep the kitchen running smoothly.

| # | Character | Agent Function | Rarity | Source |
|---:|---|---|---|---|
| 76 | [Kurogami Senpai](characters/kurogami-senpai/README.md) | Orchestrate | Mythic | mise_orchestra_cards.csv |
| 78 | [Mizu](characters/mizu/README.md) | Prepare | Rare | mise_orchestra_cards.csv |
| 79 | [Kaji](characters/kaji/README.md) | Compute | Epic | mise_orchestra_cards.csv |
| 85 | [Scale Oni](characters/scale-oni/README.md) | Scale | Legendary | mise_orchestra_cards.csv |
### Pipeline Kitchen — Build. Test. Deploy. Repeat.

| # | Character | Agent Function | Rarity | Source |
|---:|---|---|---|---|
| 1 | [Alko Commit Chef](characters/alko-commit-chef/README.md) | Commit Intake | Genesis | characters.generated.json |
| 2 | [Bruno Blast-Radius](characters/bruno-blast-radius/README.md) | Change Impact Scanner | Rare | characters.generated.json |
| 3 | [Lila Branchkeeper](characters/lila-branchkeeper/README.md) | Branch Policy Gate | Rare | characters.generated.json |
| 4 | [Omar Reviewer](characters/omar-reviewer/README.md) | PR Hygiene Check | Genesis | characters.generated.json |
| 5 | [Hugo Matrix](characters/hugo-matrix/README.md) | Test Matrix Runner | Common | characters.generated.json |
| 6 | [Seira Scan](characters/seira-scan/README.md) | Security Scan Stage | Rare | characters.generated.json |
| 7 | [Yume Builder](characters/yume-builder/README.md) | Artifact Builder | Genesis | characters.generated.json |
| 8 | [Iron Hashi](characters/iron-hashi/README.md) | Artifact Validator | Genesis | characters.generated.json |
| 9 | [Nina Promoter](characters/nina-promoter/README.md) | Environment Promotion Gate | Common | characters.generated.json |
| 10 | [Release Conductor](characters/release-conductor/README.md) | Deployment Orchestrator | Common | characters.generated.json |
| 11 | [Felix Rollback](characters/felix-rollback/README.md) | Rollback & Fix-Forward | Common | characters.generated.json |
| 12 | [Tariq Notesmith](characters/tariq-notesmith/README.md) | Release Notes Generator | Common | characters.generated.json |
| 13 | [Ivun Cache](characters/ivun-cache/README.md) | Pipeline Cost Monitor | Common | characters.generated.json |
| 14 | [Canary Taster](characters/canary-taster/README.md) | Pipeline Observability | Rare | characters.generated.json |
| 15 | [Pipeline Sensei](characters/pipeline-sensei/README.md) | Pipeline Tuner Agent | Epic | characters.generated.json |
| 77 | [Tensho](characters/tensho/README.md) | Task Flow | Rare | mise_orchestra_cards.csv |
| 80 | [Yume](characters/yume/README.md) | Build | Rare | mise_orchestra_cards.csv |
| 82 | [Flash Riku](characters/flash-riku/README.md) | Deploy | Epic | mise_orchestra_cards.csv |
| 86 | [Build-Kun](characters/build-kun/README.md) | Build | Rare | mise_orchestra_cards.csv |
### Platform Kitchen — The stage where services live.

| # | Character | Agent Function | Rarity | Source |
|---:|---|---|---|---|
| 16 | [Template Tanaka](characters/template-tanaka/README.md) | Service Template Catalog | Common | characters.generated.json |
| 17 | [Bootstrap Aiko](characters/bootstrap-aiko/README.md) | New Service Wizard | Genesis | characters.generated.json |
| 18 | [Terra Forge](characters/terra-forge/README.md) | Environment Provisioner | Common | characters.generated.json |
| 19 | [Schema Sora](characters/schema-sora/README.md) | Database Blueprint Manager | Common | characters.generated.json |
| 20 | [Runtime Riku](characters/runtime-riku/README.md) | Runtime Profile Manager | Common | characters.generated.json |
| 21 | [Vault Hana](characters/vault-hana/README.md) | Secrets & Config Broker | Rare | characters.generated.json |
| 22 | [Policy Kenji](characters/policy-kenji/README.md) | Policy Packs | Rare | characters.generated.json |
| 23 | [Grafana Mei](characters/grafana-mei/README.md) | Shared Observability Pack | Common | characters.generated.json |
| 24 | [Umami Code](characters/umami-code/README.md) | Traffic & Ingress Manager | Genesis | characters.generated.json |
| 25 | [Queue Mizu](characters/queue-mizu/README.md) | Job & Queue Templates | Genesis | characters.generated.json |
| 26 | [Streama](characters/streama/README.md) | Data Streaming Profiles | Genesis | characters.generated.json |
| 27 | [Preview Yuki](characters/preview-yuki/README.md) | Preview Environment Spawner | Common | characters.generated.json |
| 28 | [Portal Rei](characters/portal-rei/README.md) | Self-Service Portal UI | Common | characters.generated.json |
| 29 | [Guardrail Goro](characters/guardrail-goro/README.md) | Golden Path Guardrails | Common | characters.generated.json |
| 30 | [Platform Sensei](characters/platform-sensei/README.md) | Platform Health Board | Epic | characters.generated.json |
| 83 | [Seira](characters/seira/README.md) | Secure | Epic | mise_orchestra_cards.csv |
| 84 | [Kuro Guard](characters/kuro-guard/README.md) | Protect | Epic | mise_orchestra_cards.csv |
| 87 | [Orchestra Core](characters/orchestra-core/README.md) | Coordinate | Mythic | mise_orchestra_cards.csv |
### Reliability Kitchen — Observe. Measure. Improve.

| # | Character | Agent Function | Rarity | Source |
|---:|---|---|---|---|
| 31 | [SLO Sage](characters/slo-sage/README.md) | SLO Definition Workflow | Genesis | characters.generated.json |
| 32 | [Trace Sensei](characters/trace-sensei/README.md) | Instrumentation Booster | Rare | characters.generated.json |
| 33 | [Chaos Kaito](characters/chaos-kaito/README.md) | Load & Chaos Profiles | Common | characters.generated.json |
| 34 | [Capacity Kanna](characters/capacity-kanna/README.md) | Pre-Deployment Reliability Check | Common | characters.generated.json |
| 35 | [Canary Judge](characters/canary-judge/README.md) | Canary Judge | Rare | characters.generated.json |
| 36 | [Alert Akira](characters/alert-akira/README.md) | Incident Detection Rules | Common | characters.generated.json |
| 37 | [Pager Hiro](characters/pager-hiro/README.md) | Incident Triage Runbook | Common | characters.generated.json |
| 38 | [OnCall Naomi](characters/oncall-naomi/README.md) | On-Call Rotation Manager | Common | characters.generated.json |
| 39 | [Review Ren](characters/review-ren/README.md) | Post-Incident Review | Common | characters.generated.json |
| 40 | [Backlog Benji](characters/backlog-benji/README.md) | Reliability Backlog Builder | Common | characters.generated.json |
| 41 | [Metrics Miko](characters/metrics-miko/README.md) | SLO Dashboards | Genesis | characters.generated.json |
| 42 | [Forecast Fuji](characters/forecast-fuji/README.md) | Capacity Planner | Common | characters.generated.json |
| 43 | [Resilience Ryu](characters/resilience-ryu/README.md) | Resilience Testing Loop | Rare | characters.generated.json |
| 44 | [Impact Ichi](characters/impact-ichi/README.md) | Customer Impact Simulator | Common | characters.generated.json |
| 45 | [Reliability Sensei](characters/reliability-sensei/README.md) | Reliability Advisor Agent | Epic | characters.generated.json |
| 81 | [Null-chan](characters/null-chan/README.md) | Cleanse | Rare | mise_orchestra_cards.csv |
### Security Kitchen — Guard. Audit. Comply.

| # | Character | Agent Function | Rarity | Source |
|---:|---|---|---|---|
| 46 | [Threat Taro](characters/threat-taro/README.md) | Threat Modeling Starter | Common | characters.generated.json |
| 47 | [Secure Sakura](characters/secure-sakura/README.md) | Secure Template Library | Common | characters.generated.json |
| 48 | [Token Toshi](characters/token-toshi/README.md) | Credential Hygiene Scanner | Rare | characters.generated.json |
| 49 | [CVE Kumo](characters/cve-kumo/README.md) | Dependency Risk Monitor | Rare | characters.generated.json |
| 50 | [Container Kage](characters/container-kage/README.md) | Container Hardening Workflow | Common | characters.generated.json |
| 51 | [Seira Vaultkeeper](characters/seira-vaultkeeper/README.md) | Secrets Lifecycle Manager | Genesis | characters.generated.json |
| 52 | [Policy Ronin](characters/policy-ronin/README.md) | Policy-as-Code Engine | Genesis | characters.generated.json |
| 53 | [Merge Sentinel](characters/merge-sentinel/README.md) | Pre-Merge Security Gate | Rare | characters.generated.json |
| 54 | [Watchtower Yoru](characters/watchtower-yoru/README.md) | Runtime Threat Detector | Common | characters.generated.json |
| 55 | [Auditor Emi](characters/auditor-emi/README.md) | Access Review Workflow | Common | characters.generated.json |
| 56 | [Incident Kitsune](characters/incident-kitsune/README.md) | Security Incident Playbooks | Rare | characters.generated.json |
| 57 | [Evidence Scribe](characters/evidence-scribe/README.md) | Compliance Evidence Collector | Rare | characters.generated.json |
| 58 | [Nudge Neko](characters/nudge-neko/README.md) | Security Training Nudges | Rare | characters.generated.json |
| 59 | [Scorecard Shin](characters/scorecard-shin/README.md) | Security Scorecard | Rare | characters.generated.json |
| 60 | [Red Oni](characters/red-oni/README.md) | Red Team / Chaos Security Mode | Epic | characters.generated.json |


---

## 🧩 Registry Catalog Preview

The uploaded registry catalog maps MiseOS packages, containers, templates, and policy tools into a product ecosystem.

| Package | Type | Version | Status | Artifact |
|---|---|---:|---|---|
| MiseOS Agent SDK | sdk | 0.2.0 | experimental | `@mise-os/agent-sdk` |
| MiseOS Analytics Engine | analytics | 0.2.0 | experimental | `@mise-os/analytics-engine` |
| MiseOS Attestation Gate | policy | 0.2.0 | experimental | `@mise-os/attestation-gate` |
| MiseOS CLI | package | 0.2.0 | experimental | `@mise-os/cli` |
| MiseOS Docs Builder | container | 0.2.0 | experimental | `ghcr.io/mise-os/miseos-docs-builder` |
| MiseOS Docs Hub Template | template | 0.2.0 | experimental | `@mise-os/docs-hub-template; templates/docs-hub` |
| MiseOS Gradle Plugin | package | 0.2.0 | experimental | `dev.miseos.registry-plugin` |
| MiseOS Maven Policy Adapter | package | 0.2.0 | experimental | `dev.miseos:policy-adapter` |
| MiseOS NuGet Client | sdk | 0.2.0 | experimental | `MiseOS.Registry.Client` |
| MiseOS Policy Checker | container | 0.2.0 | experimental | `ghcr.io/mise-os/miseos-policy-checker` |
| MiseOS Policy Engine | policy | 0.2.0 | experimental | `@mise-os/policy-engine; ghcr.io/mise-os/miseos-policy-checker` |
| MiseOS Registry Schema | schema | 0.2.0 | experimental | `@mise-os/registry-schema` |

---

## 🎯 Real-World Use Cases

### Scenario 1: CI/CD rescue

**Team:** Pipeline Kitchen 10-pack

- Intake commits.
- Scan blast radius.
- Run test matrix.
- Build artifacts.
- Promote only when evidence is clean.

### Scenario 2: Agent-ready repo conversion

**Team:** Platform + Security starter packs

- Add templates.
- Configure policies.
- Make safe agent instructions.
- Build repo health dashboards.

### Scenario 3: Reliability launch review

**Team:** Reliability Kitchen 7-pack

- Define SLOs.
- Verify traces.
- Run chaos/load checks.
- Prepare incident notes and rollback map.

### Scenario 4: Collectible/social universe

**Team:** Operations + Expansion cards

- Turn technical workflows into character lore.
- Generate social content.
- Build NFT-safe metadata without investment language.
- Create lore arcs around deployments, incidents, and recovery.

---

## 🔌 Multi-Tool Integration Targets

MiseOS can export or adapt character instructions to:

- Claude Code / `.claude/agents/`
- Codex / `.codex/agents/`
- Cursor / `.cursor/rules/`
- GitHub Copilot instructions
- OpenCode / `.opencode/agents/`
- Windsurf / `.windsurfrules`
- Aider / `CONVENTIONS.md`
- MCP servers and GitHub Actions

This prototype does not install those integrations yet. It proves the roster, card UX, folder model, and README structure first.

---

## 🗺️ Roadmap

- [x] Static proof prototype with all roster data.
- [x] Holo trading card UI.
- [x] Character folders and metadata.
- [x] Team folders with 5/7/10/15 presets.
- [ ] Connect real sprite/card art for all 75+ characters.
- [ ] Add GitHub Pages deployment.
- [ ] Add installer/converter scripts for Codex, Claude Code, Cursor, and Copilot.
- [ ] Add 3D model / animation slots.
- [ ] Add DigitalOcean Spaces upload manifest.
- [ ] Add Minty-compatible metadata pipeline.

---

## 📜 License Note

This is a local proof prototype generated from your uploaded MiseOS roster and collection files. It includes no investment, resale, or profit language.

---

<div align="center">

**MiseOS: Everything in its place, for every repo.**

Cook. Orchestrate. Deploy. Observe.

</div>
