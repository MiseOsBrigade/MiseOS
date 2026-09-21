<div align="center">

<img src="./assets/header.svg" alt="MiseOS Character Agent Registry header" width="100%" />

# MiseOS Character Agent Registry

**Executable personalities for AI\-native software operations\.**

<p>
  <img src="https://img.shields.io/badge/Characters-112-E97822?style=for-the-badge&labelColor=090B12" alt="characters" />
  <img src="https://img.shields.io/badge/Kitchens-6-F4D58D?style=for-the-badge&labelColor=090B12" alt="kitchens" />
  <img src="https://img.shields.io/badge/Registry-Validated-63D471?style=for-the-badge&labelColor=090B12" alt="registry" />
  <img src="https://img.shields.io/badge/Architecture-Agent--Native-5B8CFF?style=for-the-badge&labelColor=090B12" alt="agent native" />
</p>

</div>

---

## Overview

MiseOS models software work as a coordinated kitchen of character agents\. Each character has a clickable visual identity, machine\-readable metadata, operational workflow, proof gate, statistics, department membership, and explicit handoffs to other agents\.

This profile contains all **112 character agents** in the supplied canonical ecosystem registry\. The source registry also contains **23 registry manifests**, giving **135 total ecosystem records**\.

---

## Architecture map

```mermaid
flowchart TD
  M[MiseOS] --> P[Pipeline Kitchen]
  M --> PL[Platform Kitchen]
  M --> S[Security Kitchen]
  M --> R[Reliability Kitchen]
  M --> D[Data & Insight Kitchen]
  M --> O[Operations Kitchen]
  P --> C[Character Profiles]
  PL --> C
  S --> C
  R --> C
  D --> C
  O --> C
  C --> MD[Metadata]
  C --> WF[Workflows]
  C --> PG[Proof Gates]
  C --> SY[Synced Agents]
```

---

## Character roster

Every portrait is clickable and opens that character’s dedicated profile\.

### Pipeline Kitchen

<a href="./characters/alko-commit-chef/README.md"><img src="./assets/characters/alko-commit-chef/profile.svg" alt="Alko Commit Chef" width="145" /></a>
<a href="./characters/bruno-blast-radius/README.md"><img src="./assets/characters/bruno-blast-radius/profile.svg" alt="Bruno Blast-Radius" width="145" /></a>
<a href="./characters/lila-branchkeeper/README.md"><img src="./assets/characters/lila-branchkeeper/profile.svg" alt="Lila Branchkeeper" width="145" /></a>
<a href="./characters/omar-reviewer/README.md"><img src="./assets/characters/omar-reviewer/profile.svg" alt="Omar Reviewer" width="145" /></a>
<a href="./characters/hugo-matrix/README.md"><img src="./assets/characters/hugo-matrix/profile.svg" alt="Hugo Matrix" width="145" /></a>
<a href="./characters/seira-scan/README.md"><img src="./assets/characters/seira-scan/profile.svg" alt="Seira Scan" width="145" /></a>
<a href="./characters/yume-builder/README.md"><img src="./assets/characters/yume-builder/profile.svg" alt="Yume Builder" width="145" /></a>
<a href="./characters/iron-hashi/README.md"><img src="./assets/characters/iron-hashi/profile.svg" alt="Iron Hashi" width="145" /></a>
<a href="./characters/nina-promoter/README.md"><img src="./assets/characters/nina-promoter/profile.svg" alt="Nina Promoter" width="145" /></a>
<a href="./characters/release-conductor/README.md"><img src="./assets/characters/release-conductor/profile.svg" alt="Release Conductor" width="145" /></a>
<a href="./characters/felix-rollback/README.md"><img src="./assets/characters/felix-rollback/profile.svg" alt="Felix Rollback" width="145" /></a>
<a href="./characters/tariq-notesmith/README.md"><img src="./assets/characters/tariq-notesmith/profile.svg" alt="Tariq Notesmith" width="145" /></a>
<a href="./characters/ivun-cache/README.md"><img src="./assets/characters/ivun-cache/profile.svg" alt="Ivun Cache" width="145" /></a>
<a href="./characters/canary-taster/README.md"><img src="./assets/characters/canary-taster/profile.svg" alt="Canary Taster" width="145" /></a>
<a href="./characters/pipeline-sensei/README.md"><img src="./assets/characters/pipeline-sensei/profile.svg" alt="Pipeline Sensei" width="145" /></a>
<a href="./characters/tensho/README.md"><img src="./assets/characters/tensho/profile.svg" alt="Tensho" width="145" /></a>
<a href="./characters/yume/README.md"><img src="./assets/characters/yume/profile.svg" alt="Yume" width="145" /></a>
<a href="./characters/flash-riku/README.md"><img src="./assets/characters/flash-riku/profile.svg" alt="Flash Riku" width="145" /></a>
<a href="./characters/build-kun/README.md"><img src="./assets/characters/build-kun/profile.svg" alt="Build-Kun" width="145" /></a>

<details>
<summary>Character index (19)</summary>

- [**Alko Commit Chef**](./characters/alko-commit-chef/README.md) \- Commit Intake \- `Genesis`
- [**Bruno Blast\-Radius**](./characters/bruno-blast-radius/README.md) \- Change Impact Scanner \- `Rare`
- [**Lila Branchkeeper**](./characters/lila-branchkeeper/README.md) \- Branch Policy Gate \- `Rare`
- [**Omar Reviewer**](./characters/omar-reviewer/README.md) \- PR Hygiene Check \- `Genesis`
- [**Hugo Matrix**](./characters/hugo-matrix/README.md) \- Test Matrix Runner \- `Common`
- [**Seira Scan**](./characters/seira-scan/README.md) \- Security Scan Stage \- `Rare`
- [**Yume Builder**](./characters/yume-builder/README.md) \- Artifact Builder \- `Genesis`
- [**Iron Hashi**](./characters/iron-hashi/README.md) \- Artifact Validator \- `Genesis`
- [**Nina Promoter**](./characters/nina-promoter/README.md) \- Environment Promotion Gate \- `Common`
- [**Release Conductor**](./characters/release-conductor/README.md) \- Deployment Orchestrator \- `Common`
- [**Felix Rollback**](./characters/felix-rollback/README.md) \- Rollback & Fix\-Forward \- `Common`
- [**Tariq Notesmith**](./characters/tariq-notesmith/README.md) \- Release Notes Generator \- `Common`
- [**Ivun Cache**](./characters/ivun-cache/README.md) \- Pipeline Cost Monitor \- `Common`
- [**Canary Taster**](./characters/canary-taster/README.md) \- Pipeline Observability \- `Rare`
- [**Pipeline Sensei**](./characters/pipeline-sensei/README.md) \- Pipeline Tuner Agent \- `Epic`
- [**Tensho**](./characters/tensho/README.md) \- Task Flow \- `Rare`
- [**Yume**](./characters/yume/README.md) \- Build \- `Rare`
- [**Flash Riku**](./characters/flash-riku/README.md) \- Deploy \- `Epic`
- [**Build\-Kun**](./characters/build-kun/README.md) \- Build \- `Rare`

</details>
### Platform Kitchen

<a href="./characters/template-tanaka/README.md"><img src="./assets/characters/template-tanaka/profile.svg" alt="Template Tanaka" width="145" /></a>
<a href="./characters/bootstrap-aiko/README.md"><img src="./assets/characters/bootstrap-aiko/profile.svg" alt="Bootstrap Aiko" width="145" /></a>
<a href="./characters/terra-forge/README.md"><img src="./assets/characters/terra-forge/profile.svg" alt="Terra Forge" width="145" /></a>
<a href="./characters/schema-sora/README.md"><img src="./assets/characters/schema-sora/profile.svg" alt="Schema Sora" width="145" /></a>
<a href="./characters/runtime-riku/README.md"><img src="./assets/characters/runtime-riku/profile.svg" alt="Runtime Riku" width="145" /></a>
<a href="./characters/vault-hana/README.md"><img src="./assets/characters/vault-hana/profile.svg" alt="Vault Hana" width="145" /></a>
<a href="./characters/policy-kenji/README.md"><img src="./assets/characters/policy-kenji/profile.svg" alt="Policy Kenji" width="145" /></a>
<a href="./characters/grafana-mei/README.md"><img src="./assets/characters/grafana-mei/profile.svg" alt="Grafana Mei" width="145" /></a>
<a href="./characters/umami-code/README.md"><img src="./assets/characters/umami-code/profile.svg" alt="Umami Code" width="145" /></a>
<a href="./characters/queue-mizu/README.md"><img src="./assets/characters/queue-mizu/profile.svg" alt="Queue Mizu" width="145" /></a>
<a href="./characters/streama/README.md"><img src="./assets/characters/streama/profile.svg" alt="Streama" width="145" /></a>
<a href="./characters/preview-yuki/README.md"><img src="./assets/characters/preview-yuki/profile.svg" alt="Preview Yuki" width="145" /></a>
<a href="./characters/portal-rei/README.md"><img src="./assets/characters/portal-rei/profile.svg" alt="Portal Rei" width="145" /></a>
<a href="./characters/guardrail-goro/README.md"><img src="./assets/characters/guardrail-goro/profile.svg" alt="Guardrail Goro" width="145" /></a>
<a href="./characters/platform-sensei/README.md"><img src="./assets/characters/platform-sensei/profile.svg" alt="Platform Sensei" width="145" /></a>
<a href="./characters/seira/README.md"><img src="./assets/characters/seira/profile.svg" alt="Seira" width="145" /></a>
<a href="./characters/kuro-guard/README.md"><img src="./assets/characters/kuro-guard/profile.svg" alt="Kuro Guard" width="145" /></a>
<a href="./characters/orchestra-core/README.md"><img src="./assets/characters/orchestra-core/profile.svg" alt="Orchestra Core" width="145" /></a>

<details>
<summary>Character index (18)</summary>

- [**Template Tanaka**](./characters/template-tanaka/README.md) \- Service Template Catalog \- `Common`
- [**Bootstrap Aiko**](./characters/bootstrap-aiko/README.md) \- New Service Wizard \- `Genesis`
- [**Terra Forge**](./characters/terra-forge/README.md) \- Environment Provisioner \- `Common`
- [**Schema Sora**](./characters/schema-sora/README.md) \- Database Blueprint Manager \- `Common`
- [**Runtime Riku**](./characters/runtime-riku/README.md) \- Runtime Profile Manager \- `Common`
- [**Vault Hana**](./characters/vault-hana/README.md) \- Secrets & Config Broker \- `Rare`
- [**Policy Kenji**](./characters/policy-kenji/README.md) \- Policy Packs \- `Rare`
- [**Grafana Mei**](./characters/grafana-mei/README.md) \- Shared Observability Pack \- `Common`
- [**Umami Code**](./characters/umami-code/README.md) \- Traffic & Ingress Manager \- `Genesis`
- [**Queue Mizu**](./characters/queue-mizu/README.md) \- Job & Queue Templates \- `Genesis`
- [**Streama**](./characters/streama/README.md) \- Data Streaming Profiles \- `Genesis`
- [**Preview Yuki**](./characters/preview-yuki/README.md) \- Preview Environment Spawner \- `Common`
- [**Portal Rei**](./characters/portal-rei/README.md) \- Self\-Service Portal UI \- `Common`
- [**Guardrail Goro**](./characters/guardrail-goro/README.md) \- Golden Path Guardrails \- `Common`
- [**Platform Sensei**](./characters/platform-sensei/README.md) \- Platform Health Board \- `Epic`
- [**Seira**](./characters/seira/README.md) \- Secure \- `Epic`
- [**Kuro Guard**](./characters/kuro-guard/README.md) \- Protect \- `Epic`
- [**Orchestra Core**](./characters/orchestra-core/README.md) \- Coordinate \- `Mythic`

</details>
### Security Kitchen

<a href="./characters/threat-taro/README.md"><img src="./assets/characters/threat-taro/profile.svg" alt="Threat Taro" width="145" /></a>
<a href="./characters/secure-sakura/README.md"><img src="./assets/characters/secure-sakura/profile.svg" alt="Secure Sakura" width="145" /></a>
<a href="./characters/token-toshi/README.md"><img src="./assets/characters/token-toshi/profile.svg" alt="Token Toshi" width="145" /></a>
<a href="./characters/cve-kumo/README.md"><img src="./assets/characters/cve-kumo/profile.svg" alt="CVE Kumo" width="145" /></a>
<a href="./characters/container-kage/README.md"><img src="./assets/characters/container-kage/profile.svg" alt="Container Kage" width="145" /></a>
<a href="./characters/seira-vaultkeeper/README.md"><img src="./assets/characters/seira-vaultkeeper/profile.svg" alt="Seira Vaultkeeper" width="145" /></a>
<a href="./characters/policy-ronin/README.md"><img src="./assets/characters/policy-ronin/profile.svg" alt="Policy Ronin" width="145" /></a>
<a href="./characters/merge-sentinel/README.md"><img src="./assets/characters/merge-sentinel/profile.svg" alt="Merge Sentinel" width="145" /></a>
<a href="./characters/watchtower-yoru/README.md"><img src="./assets/characters/watchtower-yoru/profile.svg" alt="Watchtower Yoru" width="145" /></a>
<a href="./characters/auditor-emi/README.md"><img src="./assets/characters/auditor-emi/profile.svg" alt="Auditor Emi" width="145" /></a>
<a href="./characters/incident-kitsune/README.md"><img src="./assets/characters/incident-kitsune/profile.svg" alt="Incident Kitsune" width="145" /></a>
<a href="./characters/evidence-scribe/README.md"><img src="./assets/characters/evidence-scribe/profile.svg" alt="Evidence Scribe" width="145" /></a>
<a href="./characters/nudge-neko/README.md"><img src="./assets/characters/nudge-neko/profile.svg" alt="Nudge Neko" width="145" /></a>
<a href="./characters/scorecard-shin/README.md"><img src="./assets/characters/scorecard-shin/profile.svg" alt="Scorecard Shin" width="145" /></a>
<a href="./characters/red-oni/README.md"><img src="./assets/characters/red-oni/profile.svg" alt="Red Oni" width="145" /></a>

<details>
<summary>Character index (15)</summary>

- [**Threat Taro**](./characters/threat-taro/README.md) \- Threat Modeling Starter \- `Common`
- [**Secure Sakura**](./characters/secure-sakura/README.md) \- Secure Template Library \- `Common`
- [**Token Toshi**](./characters/token-toshi/README.md) \- Credential Hygiene Scanner \- `Rare`
- [**CVE Kumo**](./characters/cve-kumo/README.md) \- Dependency Risk Monitor \- `Rare`
- [**Container Kage**](./characters/container-kage/README.md) \- Container Hardening Workflow \- `Common`
- [**Seira Vaultkeeper**](./characters/seira-vaultkeeper/README.md) \- Secrets Lifecycle Manager \- `Genesis`
- [**Policy Ronin**](./characters/policy-ronin/README.md) \- Policy\-as\-Code Engine \- `Genesis`
- [**Merge Sentinel**](./characters/merge-sentinel/README.md) \- Pre\-Merge Security Gate \- `Rare`
- [**Watchtower Yoru**](./characters/watchtower-yoru/README.md) \- Runtime Threat Detector \- `Common`
- [**Auditor Emi**](./characters/auditor-emi/README.md) \- Access Review Workflow \- `Common`
- [**Incident Kitsune**](./characters/incident-kitsune/README.md) \- Security Incident Playbooks \- `Rare`
- [**Evidence Scribe**](./characters/evidence-scribe/README.md) \- Compliance Evidence Collector \- `Rare`
- [**Nudge Neko**](./characters/nudge-neko/README.md) \- Security Training Nudges \- `Rare`
- [**Scorecard Shin**](./characters/scorecard-shin/README.md) \- Security Scorecard \- `Rare`
- [**Red Oni**](./characters/red-oni/README.md) \- Red Team / Chaos Security Mode \- `Epic`

</details>
### Reliability Kitchen

<a href="./characters/slo-sage/README.md"><img src="./assets/characters/slo-sage/profile.svg" alt="SLO Sage" width="145" /></a>
<a href="./characters/trace-sensei/README.md"><img src="./assets/characters/trace-sensei/profile.svg" alt="Trace Sensei" width="145" /></a>
<a href="./characters/chaos-kaito/README.md"><img src="./assets/characters/chaos-kaito/profile.svg" alt="Chaos Kaito" width="145" /></a>
<a href="./characters/capacity-kanna/README.md"><img src="./assets/characters/capacity-kanna/profile.svg" alt="Capacity Kanna" width="145" /></a>
<a href="./characters/canary-judge/README.md"><img src="./assets/characters/canary-judge/profile.svg" alt="Canary Judge" width="145" /></a>
<a href="./characters/alert-akira/README.md"><img src="./assets/characters/alert-akira/profile.svg" alt="Alert Akira" width="145" /></a>
<a href="./characters/pager-hiro/README.md"><img src="./assets/characters/pager-hiro/profile.svg" alt="Pager Hiro" width="145" /></a>
<a href="./characters/oncall-naomi/README.md"><img src="./assets/characters/oncall-naomi/profile.svg" alt="OnCall Naomi" width="145" /></a>
<a href="./characters/review-ren/README.md"><img src="./assets/characters/review-ren/profile.svg" alt="Review Ren" width="145" /></a>
<a href="./characters/backlog-benji/README.md"><img src="./assets/characters/backlog-benji/profile.svg" alt="Backlog Benji" width="145" /></a>
<a href="./characters/metrics-miko/README.md"><img src="./assets/characters/metrics-miko/profile.svg" alt="Metrics Miko" width="145" /></a>
<a href="./characters/forecast-fuji/README.md"><img src="./assets/characters/forecast-fuji/profile.svg" alt="Forecast Fuji" width="145" /></a>
<a href="./characters/resilience-ryu/README.md"><img src="./assets/characters/resilience-ryu/profile.svg" alt="Resilience Ryu" width="145" /></a>
<a href="./characters/impact-ichi/README.md"><img src="./assets/characters/impact-ichi/profile.svg" alt="Impact Ichi" width="145" /></a>
<a href="./characters/reliability-sensei/README.md"><img src="./assets/characters/reliability-sensei/profile.svg" alt="Reliability Sensei" width="145" /></a>
<a href="./characters/null-chan/README.md"><img src="./assets/characters/null-chan/profile.svg" alt="Null-chan" width="145" /></a>

<details>
<summary>Character index (16)</summary>

- [**SLO Sage**](./characters/slo-sage/README.md) \- SLO Definition Workflow \- `Genesis`
- [**Trace Sensei**](./characters/trace-sensei/README.md) \- Instrumentation Booster \- `Rare`
- [**Chaos Kaito**](./characters/chaos-kaito/README.md) \- Load & Chaos Profiles \- `Common`
- [**Capacity Kanna**](./characters/capacity-kanna/README.md) \- Pre\-Deployment Reliability Check \- `Common`
- [**Canary Judge**](./characters/canary-judge/README.md) \- Canary Judge \- `Rare`
- [**Alert Akira**](./characters/alert-akira/README.md) \- Incident Detection Rules \- `Common`
- [**Pager Hiro**](./characters/pager-hiro/README.md) \- Incident Triage Runbook \- `Common`
- [**OnCall Naomi**](./characters/oncall-naomi/README.md) \- On\-Call Rotation Manager \- `Common`
- [**Review Ren**](./characters/review-ren/README.md) \- Post\-Incident Review \- `Common`
- [**Backlog Benji**](./characters/backlog-benji/README.md) \- Reliability Backlog Builder \- `Common`
- [**Metrics Miko**](./characters/metrics-miko/README.md) \- SLO Dashboards \- `Genesis`
- [**Forecast Fuji**](./characters/forecast-fuji/README.md) \- Capacity Planner \- `Common`
- [**Resilience Ryu**](./characters/resilience-ryu/README.md) \- Resilience Testing Loop \- `Rare`
- [**Impact Ichi**](./characters/impact-ichi/README.md) \- Customer Impact Simulator \- `Common`
- [**Reliability Sensei**](./characters/reliability-sensei/README.md) \- Reliability Advisor Agent \- `Epic`
- [**Null\-chan**](./characters/null-chan/README.md) \- Cleanse \- `Rare`

</details>
### Data & Insight Kitchen

<a href="./characters/taxonomy-taka/README.md"><img src="./assets/characters/taxonomy-taka/profile.svg" alt="Taxonomy Taka" width="145" /></a>
<a href="./characters/lake-haru/README.md"><img src="./assets/characters/lake-haru/profile.svg" alt="Lake Haru" width="145" /></a>
<a href="./characters/lattice/README.md"><img src="./assets/characters/lattice/profile.svg" alt="Lattice" width="145" /></a>
<a href="./characters/repo-ranger/README.md"><img src="./assets/characters/repo-ranger/profile.svg" alt="Repo Ranger" width="145" /></a>
<a href="./characters/dora-daichi/README.md"><img src="./assets/characters/dora-daichi/profile.svg" alt="DORA Daichi" width="145" /></a>
<a href="./characters/flag-fox/README.md"><img src="./assets/characters/flag-fox/profile.svg" alt="Flag Fox" width="145" /></a>
<a href="./characters/cost-kaito/README.md"><img src="./assets/characters/cost-kaito/profile.svg" alt="Cost Kaito" width="145" /></a>
<a href="./characters/dx-mei/README.md"><img src="./assets/characters/dx-mei/profile.svg" alt="DX Mei" width="145" /></a>
<a href="./characters/revenue-rina/README.md"><img src="./assets/characters/revenue-rina/profile.svg" alt="Revenue Rina" width="145" /></a>
<a href="./characters/risk-ryota/README.md"><img src="./assets/characters/risk-ryota/profile.svg" alt="Risk Ryota" width="145" /></a>
<a href="./characters/apprentice-kai/README.md"><img src="./assets/characters/apprentice-kai/profile.svg" alt="Apprentice Kai" width="145" /></a>
<a href="./characters/anomaly-aki/README.md"><img src="./assets/characters/anomaly-aki/profile.svg" alt="Anomaly Aki" width="145" /></a>
<a href="./characters/leaderboard-leo/README.md"><img src="./assets/characters/leaderboard-leo/profile.svg" alt="Leaderboard Leo" width="145" /></a>
<a href="./characters/storyteller-sumi/README.md"><img src="./assets/characters/storyteller-sumi/profile.svg" alt="Storyteller Sumi" width="145" /></a>
<a href="./characters/roadmap-sensei/README.md"><img src="./assets/characters/roadmap-sensei/profile.svg" alt="Roadmap Sensei" width="145" /></a>
<a href="./characters/data-chan/README.md"><img src="./assets/characters/data-chan/profile.svg" alt="Data-chan" width="145" /></a>
<a href="./characters/insight-sensei/README.md"><img src="./assets/characters/insight-sensei/profile.svg" alt="Insight Sensei" width="145" /></a>
<a href="./characters/chaos-analyst/README.md"><img src="./assets/characters/chaos-analyst/profile.svg" alt="Chaos Analyst" width="145" /></a>
<a href="./characters/growth-guru/README.md"><img src="./assets/characters/growth-guru/profile.svg" alt="Growth Guru" width="145" /></a>
<a href="./characters/culture-chef/README.md"><img src="./assets/characters/culture-chef/profile.svg" alt="Culture Chef" width="145" /></a>

<details>
<summary>Character index (20)</summary>

- [**Taxonomy Taka**](./characters/taxonomy-taka/README.md) \- Event Taxonomy Manager \- `Common`
- [**Lake Haru**](./characters/lake-haru/README.md) \- Telemetry Ingestion Pipeline \- `Common`
- [**Lattice**](./characters/lattice/README.md) \- Trace Correlator \- `Genesis`
- [**Repo Ranger**](./characters/repo-ranger/README.md) \- Repo Health Analyzer \- `Common`
- [**DORA Daichi**](./characters/dora-daichi/README.md) \- Pipeline Analytics Engine \- `Common`
- [**Flag Fox**](./characters/flag-fox/README.md) \- Feature Flag Analytics \- `Common`
- [**Cost Kaito**](./characters/cost-kaito/README.md) \- Cost & Efficiency Monitor \- `Common`
- [**DX Mei**](./characters/dx-mei/README.md) \- Developer Experience Survey Loop \- `Common`
- [**Revenue Rina**](./characters/revenue-rina/README.md) \- Customer Behavior → Incident Linker \- `Common`
- [**Risk Ryota**](./characters/risk-ryota/README.md) \- Risk Scoring Model \- `Rare`
- [**Apprentice Kai**](./characters/apprentice-kai/README.md) \- Self\-Improvement Agent \- `Genesis`
- [**Anomaly Aki**](./characters/anomaly-aki/README.md) \- Anomaly Detection Studio \- `Common`
- [**Leaderboard Leo**](./characters/leaderboard-leo/README.md) \- Scorecards & Leaderboards \- `Common`
- [**Storyteller Sumi**](./characters/storyteller-sumi/README.md) \- Narrative Report Generator \- `Common`
- [**Roadmap Sensei**](./characters/roadmap-sensei/README.md) \- Strategic Roadmap Recommender \- `Genesis`
- [**Data\-chan**](./characters/data-chan/README.md) \- Collect \- `Rare`
- [**Insight Sensei**](./characters/insight-sensei/README.md) \- Analyze \- `Epic`
- [**Chaos Analyst**](./characters/chaos-analyst/README.md) \- Learn \- `Legendary`
- [**Growth Guru**](./characters/growth-guru/README.md) \- Optimize \- `Epic`
- [**Culture Chef**](./characters/culture-chef/README.md) \- Grow \- `Legendary`

</details>
### Operations Kitchen

<a href="./characters/kurogami-senpai/README.md"><img src="./assets/characters/kurogami-senpai/profile.svg" alt="Kurogami Senpai" width="145" /></a>
<a href="./characters/mizu/README.md"><img src="./assets/characters/mizu/profile.svg" alt="Mizu" width="145" /></a>
<a href="./characters/kaji/README.md"><img src="./assets/characters/kaji/profile.svg" alt="Kaji" width="145" /></a>
<a href="./characters/scale-oni/README.md"><img src="./assets/characters/scale-oni/profile.svg" alt="Scale Oni" width="145" /></a>
<a href="./characters/velvet-vesper/README.md"><img src="./assets/characters/velvet-vesper/profile.svg" alt="Velvet Vesper" width="145" /></a>
<a href="./characters/flavor-forager/README.md"><img src="./assets/characters/flavor-forager/profile.svg" alt="Flavor Forager" width="145" /></a>
<a href="./characters/crate-courier/README.md"><img src="./assets/characters/crate-courier/profile.svg" alt="Crate Courier" width="145" /></a>
<a href="./characters/ledger-ladle/README.md"><img src="./assets/characters/ledger-ladle/profile.svg" alt="Ledger Ladle" width="145" /></a>
<a href="./characters/beacon-broil/README.md"><img src="./assets/characters/beacon-broil/profile.svg" alt="Beacon Broil" width="145" /></a>
<a href="./characters/ladle-lumen/README.md"><img src="./assets/characters/ladle-lumen/profile.svg" alt="Ladle Lumen" width="145" /></a>
<a href="./characters/reserve-rune/README.md"><img src="./assets/characters/reserve-rune/profile.svg" alt="Reserve Rune" width="145" /></a>
<a href="./characters/vacuum-vesper/README.md"><img src="./assets/characters/vacuum-vesper/profile.svg" alt="Vacuum Vesper" width="145" /></a>
<a href="./characters/flavor-scribe/README.md"><img src="./assets/characters/flavor-scribe/profile.svg" alt="Flavor Scribe" width="145" /></a>
<a href="./characters/prep-pulse/README.md"><img src="./assets/characters/prep-pulse/profile.svg" alt="Prep Pulse" width="145" /></a>
<a href="./characters/queue-quartz/README.md"><img src="./assets/characters/queue-quartz/profile.svg" alt="Queue Quartz" width="145" /></a>
<a href="./characters/harvest-hex/README.md"><img src="./assets/characters/harvest-hex/profile.svg" alt="Harvest Hex" width="145" /></a>
<a href="./characters/garnish-ghost/README.md"><img src="./assets/characters/garnish-ghost/profile.svg" alt="Garnish Ghost" width="145" /></a>
<a href="./characters/pantry-paladin/README.md"><img src="./assets/characters/pantry-paladin/profile.svg" alt="Pantry Paladin" width="145" /></a>
<a href="./characters/ticket-tactician/README.md"><img src="./assets/characters/ticket-tactician/profile.svg" alt="Ticket Tactician" width="145" /></a>
<a href="./characters/plate-inspector/README.md"><img src="./assets/characters/plate-inspector/profile.svg" alt="Plate Inspector" width="145" /></a>
<a href="./characters/timer-tactician/README.md"><img src="./assets/characters/timer-tactician/profile.svg" alt="Timer Tactician" width="145" /></a>
<a href="./characters/recipe-ranger/README.md"><img src="./assets/characters/recipe-ranger/profile.svg" alt="Recipe Ranger" width="145" /></a>
<a href="./characters/portion-paladin/README.md"><img src="./assets/characters/portion-paladin/profile.svg" alt="Portion Paladin" width="145" /></a>
<a href="./characters/allergen-oracle/README.md"><img src="./assets/characters/allergen-oracle/profile.svg" alt="Allergen Oracle" width="145" /></a>

<details>
<summary>Character index (24)</summary>

- [**Kurogami Senpai**](./characters/kurogami-senpai/README.md) \- Orchestrate \- `Mythic`
- [**Mizu**](./characters/mizu/README.md) \- Prepare \- `Rare`
- [**Kaji**](./characters/kaji/README.md) \- Compute \- `Epic`
- [**Scale Oni**](./characters/scale-oni/README.md) \- Scale \- `Legendary`
- [**Velvet Vesper**](./characters/velvet-vesper/README.md) \- Guest Concierge \- `Rare`
- [**Flavor Forager**](./characters/flavor-forager/README.md) \- Ingredient Scout \- `Rare`
- [**Crate Courier**](./characters/crate-courier/README.md) \- Provision Scout \- `Common`
- [**Ledger Ladle**](./characters/ledger-ladle/README.md) \- Cost Steward \- `Epic`
- [**Beacon Broil**](./characters/beacon-broil/README.md) \- Alert Dispatcher \- `Epic`
- [**Ladle Lumen**](./characters/ladle-lumen/README.md) \- Broth Beacon \- `Rare`
- [**Reserve Rune**](./characters/reserve-rune/README.md) \- Backup Archivist \- `Epic`
- [**Vacuum Vesper**](./characters/vacuum-vesper/README.md) \- Seal Keeper \- `Rare`
- [**Flavor Scribe**](./characters/flavor-scribe/README.md) \- Menu Curator \- `Epic`
- [**Prep Pulse**](./characters/prep-pulse/README.md) \- Mise Monitor \- `Rare`
- [**Queue Quartz**](./characters/queue-quartz/README.md) \- Service Timer \- `Epic`
- [**Harvest Hex**](./characters/harvest-hex/README.md) \- Produce Alchemist \- `Legendary`
- [**Garnish Ghost**](./characters/garnish-ghost/README.md) \- Finisher \- `Legendary`
- [**Pantry Paladin**](./characters/pantry-paladin/README.md) \- Provision Steward \- `Epic`
- [**Ticket Tactician**](./characters/ticket-tactician/README.md) \- Order Strategist \- `Rare`
- [**Plate Inspector**](./characters/plate-inspector/README.md) \- Asset Auditor \- `Epic`
- [**Timer Tactician**](./characters/timer-tactician/README.md) \- Chrono Chef \- `Epic`
- [**Recipe Ranger**](./characters/recipe-ranger/README.md) \- Knowledge Pathfinder \- `Rare`
- [**Portion Paladin**](./characters/portion-paladin/README.md) \- Balance Steward \- `Epic`
- [**Allergen Oracle**](./characters/allergen-oracle/README.md) \- Safety Seer \- `Legendary`

</details>

---

## Packages

|Package                    |Purpose                                           |
|---------------------------|--------------------------------------------------|
|`@miseos/card-schema`      |Character-card validation contract                |
|`@miseos/catalog`          |Query helpers for the canonical roster            |
|`@miseos/profile-generator`|Paths and generation primitives for profile assets|

---

## Repository automation

- `validate-registry.yml` validates IDs, slugs, metadata, profile assets, and proof gates\.
- `profile-integrity.yml` runs profile integrity checks on pull requests\.
- `dependency-review.yml` reviews dependency changes\.
- `codeql.yml` performs JavaScript/TypeScript CodeQL analysis\.

---

## Trust model

Character identity and personality do not grant authority\. Runtime permissions should be enforced independently through least privilege, branch/ruleset controls, approval gates, and auditable evidence\.

> **Canonical proof gate:** No merge, deployment, publication, billing action, or mint without evidence.

---

## Data provenance

Generated from the supplied `miseos-ecosystem-135.json`\. Original status, confidence, origin, workflows, stats, departments, rarity, and handoff metadata are preserved\. The SVG profile portraits in this repository are generated identity tiles derived from registry metadata, not claimed as original character artwork\.# MiseOS

MiseOS is an agent-native operating layer for coordinating repositories, automation, human approvals, and production workflows.

## Working Copy + MiseOS

Working Copy is the **mobile Git edge node** for MiseOS on iPhone and iPad. It gives the operator a local, offline-capable Git workspace while GitHub remains the canonical remote, CI/CD system, and governance layer.

### Recommended iPad Pro workflow

```text
MiseOS / ChatGPT
      |
      v
Working Copy
  |       \
  |        +--> Search / diff / stage / commit / push
  |
  +--> Textastic for focused editing
  +--> Swift Playgrounds for executable prototypes
  +--> Files app for document-provider handoff
      |
      v
GitHub
  |
  +--> Pull requests
  +--> GitHub Actions
  +--> Tests / security / builds
  +--> Releases / deployment
```

## Core use case: Mobile Git Operations Console

MiseOS treats Working Copy as a human-in-the-loop control surface:

1. Clone or pull a MiseOS repository.
2. Search files, symbols, and text locally.
3. Open source in Textastic or another iOS editor.
4. Use Swift Playgrounds for small executable experiments.
5. Review the diff in Working Copy.
6. Stage only the intended changes.
7. Create a signed commit when policy requires it.
8. Push the branch to GitHub.
9. Let GitHub Actions perform deterministic validation.
10. Review and merge through the normal GitHub governance path.

## Agent patch workflow

A MiseOS agent can prepare a change without silently taking final authority over the repository:

```text
Issue / task
    -> agent analysis
    -> patch in Working Copy
    -> human diff review
    -> signed commit
    -> push
    -> GitHub Actions
    -> pull request
    -> review / merge
```

This preserves a clear human authorization boundary while still allowing agents to perform high-value repository work.

## Shortcuts

The `.miseos/` directory contains the repository-side contract for mobile automation. iOS Shortcuts can use Working Copy actions and x-callback-url to expose repeatable operations such as:

- Sync repository
- Inspect status
- Open the working tree
- Create an agent branch
- Prepare an agent patch
- Run validation
- Push a reviewed branch
- Dispatch GitHub Actions

Keep credentials out of repository files and Shortcuts. Prefer narrowly scoped GitHub App credentials or short-lived tokens for automation, and use Working Copy's configured SSH/signing identity for Git operations where appropriate.

## Design principles

- **GitHub is canonical.** Working Copy is a local edge workspace, not a second source of truth.
- **Human approval is explicit.** Agent-generated changes should be reviewable before privileged operations.
- **CI is deterministic.** Heavy builds, tests, security checks, and deployment remain on GitHub Actions or dedicated infrastructure.
- **Offline-first editing.** iPad work should remain useful when network access is unavailable.
- **Least privilege.** Automation receives only the permissions needed for its operation.
- **Signed provenance.** Use signed commits for workflows that require stronger authorship and integrity guarantees.

## Repository contract

See `.miseos/manifest.json`, `.miseos/commands.yaml`, and `.miseos/shortcuts.md` for the initial mobile-operations contract.

## License

MIT
