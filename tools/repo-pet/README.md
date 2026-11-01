# MiseOS Repo Pet

<p align="center">
  <img alt="MiseOS" src="https://img.shields.io/badge/MiseOS-Repo%20Pet-D4AF37?style=for-the-badge&labelColor=0E0F10">
  <img alt="Kitchen status" src="https://img.shields.io/badge/Kitchen-Open-E97822?style=for-the-badge&labelColor=0E0F10">
  <img alt="Node" src="https://img.shields.io/badge/Node-%3E%3D18-2E6B4E?style=for-the-badge&labelColor=0E0F10">
  <img alt="Safety" src="https://img.shields.io/badge/Safety-Read--Only-1B2A41?style=for-the-badge&labelColor=0E0F10">
</p>

<p align="center">
  <a href="https://github.com/MiseOsBrigade/Repo-Pet/actions/workflows/miseos-repo-pet.yml">
    <img alt="MiseOS Repo Pet workflow" src="https://github.com/MiseOsBrigade/Repo-Pet/actions/workflows/miseos-repo-pet.yml/badge.svg">
  </a>
</p>

**MiseOS Repo Pet** is a Shimeji-style terminal mascot that safely roams through a repository or container filesystem.

It treats a repo like a kitchen: every folder is a station, every file is prep, and every agent has a role.

## Signature

> Every agent has a role. Every role has purpose. Every action is orchestrated.  
> **Cook · Orchestrate · Deploy · Observe**

## Install

```bash
npm install
```

## Run

Roam the current repository:

```bash
npm run roam:repo
```

Roam the container filesystem with depth limits:

```bash
npm run roam:container
```

List the MiseOS character roster:

```bash
npm run list:characters
```

Run one character directly:

```bash
node bin/mise-roam.mjs . --character=kurogami-senpai --max-depth=6 --tick=650
```

Safe peek mode reads only small, non-secret-looking source/config/docs files:

```bash
node bin/mise-roam.mjs . --character=orchestra-core --peek
```

JSON event stream mode:

```bash
node bin/mise-roam.mjs . --character=seira --steps=5 --json
```

## Standalone Shemi Roamer

The repo also includes `shemi-roamer.mjs`, a single-file Shimeji-style JavaScript mascot that roams the repository or container filesystem.

Run it on the current repo:

```bash
node shemi-roamer.mjs . --max-depth=6 --tick=650
```

Run it through the container filesystem:

```bash
node shemi-roamer.mjs / --max-depth=4 --tick=800
```

Allow safe code peeking:

```bash
node shemi-roamer.mjs . --max-depth=6 --tick=650 --peek
```

Install as a local CLI:

```bash
chmod +x shemi-roamer.mjs
npm link
shemi . --max-depth=6 --tick=650 --sprite=🦝
```

This gives you a terminal-native repo pet that wanders the repository/container like a tiny DevOps mascot without writing, deleting, or mutating files.

## Example output

```text
🥢 Kurogami Senpai wanders into: /workspaces/Repo-Pet/src
🥢 Kurogami Senpai traces the JavaScript station: /workspaces/Repo-Pet/src/repo-roamer.js
🥢 Kurogami Senpai studies the kitchen lore: /workspaces/Repo-Pet/README.md
```

## Character roster

The initial roster uses 15 MiseOS kitchen-orchestra characters based on the provided character references:

| # | Character | Role | Sprite |
|---:|---|---|---|
| 1 | Kurogami Senpai | Chef de Cuisine | 🥢 |
| 2 | Seira | Navigator | 🧭 |
| 3 | Mise Garde | Quality Guard | 🛡️ |
| 4 | Mise Sauce | Workflow Saucer | 🥣 |
| 5 | Mise Locker | Pattern Keeper | 🔐 |
| 6 | Mise Bootstrap | Repo Starter | 🥾 |
| 7 | Mise Runtime | Timing Chef | ⏱️ |
| 8 | Mise Sommelier | Traceability Steward | 🍷 |
| 9 | Mise Apprentice | Learning Agent | 📓 |
| 10 | Mise Lattice | Integrity Graph | 🕸️ |
| 11 | Mise GPU | Heavy Lane Cook | ⚡ |
| 12 | Mise Soul | Human-in-the-loop Steward | 🫶 |
| 13 | Mise Brigadier | Repo Steward | 📋 |
| 14 | Mise Maestro | Control Plane Conductor | 🎼 |
| 15 | Orchestra Core | Signature Repo Pet | 🍳 |

## Safety model

Repo Pet is read-only. It does not write, delete, rename, execute repo files, or follow symlinks.

It masks secret-like paths and ignores common high-noise or sensitive directories:

```text
.git, node_modules, .next, dist, build, coverage, .venv, proc, sys, dev, run, tmp, var/log
```

## GitHub workflow

The workflow at `.github/workflows/miseos-repo-pet.yml` runs on pushes, pull requests, manual dispatches, and MiseOS-style tags.

Tag examples:

```bash
git tag miseos-repo-pet-v0.1.0
git push origin main --tags
```

## Repo topics

Suggested GitHub topics:

```text
miseos, repo-pet, shimeji, devops, terminal, mascot, github-actions, autonomous-development, kitchen-os
```

## Test

```bash
npm test
```

Expected:

```text
Smoke test passed: MiseOS Repo Pet can roam safely.
```
