<!-- Mise OS README hero update: 2026-06-25 -->

<p align="center">
  <a href="https://ea2-494d-ae27-bf1fdb744692-00-ktzv2rxn9afa.kirk.replit.dev">
    <img src="./assets/brand/miseos-intro-poster.jpeg" alt="Mise OS intro poster: The kitchen is open." width="100%" />
  </a>
</p>

<h1 align="center">Mise OS</h1>

<p align="center">
  <strong>The Kitchen OS that turns AI chaos into coordinated service.</strong><br />
  Cook. Orchestrate. Deploy. Observe.
</p>

<p align="center">
  <img alt="Node LTS" src="https://img.shields.io/badge/Node-24_LTS-2E6B4E?style=for-the-badge" />
  <img alt="Runtime" src="https://img.shields.io/badge/Runtime-ESM-1B2A41?style=for-the-badge" />
  <img alt="Dependencies" src="https://img.shields.io/badge/Dependencies-Zero-D4AF37?style=for-the-badge" />
  <img alt="Brand" src="https://img.shields.io/badge/Mise_OS-Brigade-0E0F10?style=for-the-badge" />
</p>

> **Intro video slot:** GitHub README pages are most reliable with a poster/GIF at the top. The staged hero poster is `assets/brand/miseos-intro-poster.jpeg`. Add a final video export at `assets/intro/miseos-intro.mp4` when available and keep the poster as the fallback.

---

## The kitchen is open

Mise OS turns autonomous development into a coordinated kitchen service:

- Every agent becomes a chef.
- Every repository becomes a kitchen.
- Every deployment becomes a service.
- Every workflow becomes an orchestra.

## Software matrix

| Layer | Current project standard |
|---|---|
| Runtime | Node.js `>=24.18.0` |
| Module system | Native ESM |
| Package manager | npm |
| External dependencies | None |
| CLI entrypoint | `mise-roam` |
| Safe-read mode | Metadata-only by default |
| Optional read mode | `--peek` for small non-secret-looking files |
| Last updated | 2026-06-25 |

## Quick start

```bash
npm install
npm run doctor
npm run roam
```

Run the repo mascot through the current repository:

```bash
node scripts/mise-roamer.mjs . --max-depth=6 --tick=650
```

Let a specific chef roam:

```bash
node scripts/mise-roamer.mjs . --chef=kurogami-senpai
node scripts/mise-roamer.mjs . --chef=seira --peek
node scripts/mise-roamer.mjs . --chef=streama --max-depth=7
```

Brand every folder with a `MISE.md` station card:

```bash
npm run brand:folders
npm run brand:check
```

## Repo roamer

The Mise roamer is a Shimeji-style terminal mascot adapted for repositories. Instead of walking across a desktop, each chef wanders through folders, reads safe metadata, reacts to files, and keeps a recent service trail.

Safety rules:

- Does not write, delete, rename, or mutate files.
- Does not follow symlinks.
- Ignores `.git`, `node_modules`, build outputs, caches, virtual environments, and OS system folders.
- Masks secret-like filenames.
- Reads file contents only with `--peek`, and only for small, non-secret-looking source/docs/config files.

## 15 chef characters

| Chef | Role | Focus |
|---|---|---|
| Kurogami Senpai | Chef de Cuisine | architecture, routing, coordination |
| Tensho | Expediter | queues, handoffs, issues |
| Mizu | Prep Chef | docs, prep, staging |
| Umami Code | Saucier | APIs, SDKs, integrations |
| Kaji | Grillardin | build, runtime, performance |
| Yume | Pastry Chef | assets, creative, releases |
| Iron Hashi | Boucher | tests, lint, checks |
| Null-chan | Plongeur | cleanup, refactor, dead-code |
| Flash Riku | Runner | deploy, release, CI |
| Seira | Sommelier | vault, secrets, policy |
| Kuro Guard | Steward | auth, RBAC, threat modeling |
| Scale Oni | Rotisseur | containers, cloud, traffic |
| Build-Kun | Boulanger | Docker, packages, builds |
| Streama | Poissonier | logs, events, observability |
| Orchestra Core | Chef Spirit | README, brand, governance |

## Platform architecture

| Station | Purpose |
|---|---|
| MiseOS Core | Operating system and command center |
| MiseOS Brigade | Agent workforce engine |
| MiseOS Kitchen | Developer workspace for repositories, tasks, knowledge, and deployments |
| MiseOS Orchestra | Multi-agent coordination, delegation, routing, and human approvals |
| MiseOS Vault | Secrets management and credential isolation |
| MiseOS Observatory | Agent conversations, actions, cost, performance, and token usage |
| MiseOS Ecosystem | Integrations, APIs, artifacts, and community extensions |

## Brand system

Primary palette:

- Umami Black — `#0E0F10`
- Gold Ladle — `#D4AF37`
- Broth Cream — `#F6F1E7`

Secondary palette:

- Flame Orange — `#E97822`
- Ink Blue — `#1B2A41`
- Matcha Green — `#2E6B4E`

## Repository service loop

```text
Intent → Orchestrate → Execute → Observe → Improve
```

Every folder is a station.  
Every file is an ingredient.  
Every agent has a role.  
Every role has purpose.
