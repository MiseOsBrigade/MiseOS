# MiseOS Repo Pet

**The kitchen is open.** MiseOS Repo Pet is a Shimeji-style terminal mascot that safely roams through a repository or container filesystem.

It uses the Mise Orchestra character system as the personality layer: Kurogami Senpai conducts the service, Tensho rushes CI/CD routes, Seira guards secrets, Build-Kun checks containers, Streama follows data flows, and Orchestra Core keeps the whole kitchen synchronized.

> Every agent has a role. Every role has purpose. Every action is orchestrated.

## Quick start

```bash
npm install
npm run list:characters
npm run roam:repo
```

Or run directly:

```bash
node bin/mise-roam.mjs . --character=kurogami-senpai --max-depth=6 --tick=650
```

Run a finite example suitable for CI logs or README demos:

```bash
node bin/mise-roam.mjs . --character=flash-riku --steps=8
```

JSON-lines mode:

```bash
node bin/mise-roam.mjs . --character=orchestra-core --steps=5 --json
```

Container filesystem mode:

```bash
node bin/mise-roam.mjs / --character=orchestra-core --max-depth=4 --tick=800
```

## README example

```text
$ node bin/mise-roam.mjs . --character=kurogami-senpai --steps=5
🧑‍🍳 Kurogami Senpai steps into the next station: src
🧑‍🍳 Kurogami Senpai checks the recipe logic: src/index.js
🧑‍🍳 Kurogami Senpai returns to the pass: src/index.js
🧑‍🍳 Kurogami Senpai studies the kitchen lore: README.md
🧑‍🍳 Kurogami Senpai aligns the service board: package.json
```

## Core character roster

| # | Character | Kitchen role | DevOps responsibility |
|---:|---|---|---|
| 1 | Kurogami Senpai | Chef de Cuisine | System orchestration and repo direction |
| 2 | Tensho | Expediter | CI/CD routing and delivery speed |
| 3 | Mizu | Prep Chef | Queue prep, organization, task readiness |
| 4 | Umami Code | Saucier | API and integration connective tissue |
| 5 | Kaji | Grillardin | Compute, heat, and engine pressure |
| 6 | Yume | Pastry Chef | Artifacts, polish, and release packaging |
| 7 | Iron Hashi | Boucher | Validation, schemas, and quality gates |
| 8 | Null-chan | Plongeur | Cleanup, garbage collection, stale-state removal |
| 9 | Flash Riku | Runner | Fast delivery, scripts, and deploy flow |
| 10 | Seira | Sommelier | Secrets, vault safety, sensitive ingredients |
| 11 | Kuro Guard | Steward | Security perimeter and threat protection |
| 12 | Scale Oni | Rotisseur | Autoscaling, capacity, performance pressure |
| 13 | Build-Kun | Boulanger | Build recipes, containers, generated assets |
| 14 | Streama | Poissonnier | Data streams, logs, queues, event flow |
| 15 | Orchestra Core | Chef Spirit | Meta-orchestration and kitchen consciousness |

## Safety model

Repo Pet is read-only by design.

- It does not write, delete, move, or mutate files.
- It ignores heavy directories like `.git`, `node_modules`, `dist`, `build`, cache folders, virtualenvs, and system directories.
- It does not follow symlinks by default.
- It masks secret-like paths such as `.env`, tokens, keys, credentials, PEM files, and vault paths.
- File peeking is off by default. Use `--peek` only when you want small safe text files summarized by first useful line.

## Commands

```bash
# List characters
node bin/mise-roam.mjs --list-characters

# Roam with Kurogami Senpai
node bin/mise-roam.mjs . --character=kurogami-senpai

# Roam with Seira, the secrets sommelier
node bin/mise-roam.mjs . --character=seira --max-depth=5

# Run 10 deterministic-style log steps for demos
node bin/mise-roam.mjs . --character=build-kun --steps=10

# Output events as JSON lines
node bin/mise-roam.mjs . --character=streama --steps=10 --json

# Allow safe first-line peeking of small non-secret source/docs/config files
node bin/mise-roam.mjs . --character=orchestra-core --peek
```

## Character-biased roaming

Each character has a different movement bias.

For example:

- **Tensho** favors `.github`, workflows, scripts, deploy routes, and CI/CD paths.
- **Seira** favors vault, auth, policy, and config zones but masks secret-like paths.
- **Iron Hashi** favors tests, schemas, contracts, specs, and validation files.
- **Build-Kun** favors Dockerfiles, package files, builds, and generated artifact routes.
- **Streama** favors data, queues, logs, metrics, and event streams.
- **Orchestra Core** balances the whole kitchen.

## Use the reference art

The reference assets are kept under:

```text
docs/assets/reference/
```

Recommended next step: replace the terminal emoji `sprite` values in `src/characters.js` with URLs or rendered sprites if you later add a web overlay, Tauri desktop pet, VS Code panel, or GitHub Pages demo.

## Programmatic usage

```js
import { RepoRoamer, formatEventLine } from "./src/index.js";

const roamer = new RepoRoamer({
  root: ".",
  character: "kurogami-senpai",
  maxDepth: 4
});

for (let index = 0; index < 5; index += 1) {
  const event = await roamer.step();
  console.log(formatEventLine(event));
}
```

## Development

```bash
npm test
npm run demo
```

## Vision

MiseOS Repo Pet is the mascot layer for autonomous development: a visible, playful signal that the repository is not just a folder tree. It is a living kitchen where every file has a station, every agent has a purpose, and chaos becomes coordinated service.
