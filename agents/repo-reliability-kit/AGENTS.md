# AGENTS.md

This file follows the emerging [agents.md](https://agents.md) convention — read by
Codex, Cursor, Aider, and other agent tools that don't specifically look for
`CLAUDE.md`. Keep this and `CLAUDE.md` in sync; if they drift, agents get conflicting
instructions and will guess wrong.

## Setup

```bash
[exact commands to get from a fresh clone to a runnable repo — no assumptions]
```

## Build & test

```bash
[build command]
[test command]
[lint command]
```

Run tests before proposing any change is complete. Do not report success without
running the test command and seeing it pass.

## Code style

- [Language/formatter — e.g. Prettier + ESLint, config in `.eslintrc`]
- [Type strictness — e.g. `strict: true` in tsconfig, no `any` without a comment explaining why]
- [Naming conventions specific to this repo]

## Pull requests

- Branch naming: [convention]
- One logical change per PR
- PR description must state: what changed, why, how it was tested
- [Any required labels, reviewers, or checks]

## What NOT to do

- Do not modify files in [protected paths] without explicit instruction
- Do not add dependencies without checking `package.json`/equivalent for an existing one that covers the need
- Do not change CI workflow files unless the task is explicitly about CI
- Do not commit secrets, API keys, or `.env` files — check `.gitignore` covers them

## Where to look first

| Task type | Start here |
|---|---|
| Bug fix | `tests/` for the failing case, then the relevant `src/` module |
| New feature | `docs/architecture.md`, then `CLAUDE.md` "Directory map" |
| Dependency update | `.github/dependabot.yml` for grouping rules already in place |
| CI issue | `.github/workflows/`, check recent Actions run logs first |
