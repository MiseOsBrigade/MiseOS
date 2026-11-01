# CLAUDE.md

> Fill in the bracketed sections. Delete this template comment block when done.
> Format: Why → What → How → Progressive Disclosure. Keep this file under 100 lines —
> anything longer belongs in `docs/` and should be linked, not pasted, from here.

## Why this repo exists

[One paragraph. What problem does this solve, for whom, and why does it exist as its
own repo rather than a folder inside something bigger?]

## What this is

- **Type:** [library / CLI / service / monorepo package]
- **Language/runtime:** [e.g. TypeScript 5+, ESM, NodeNext]
- **Entry point:** [e.g. `src/index.ts`, `bin/cli.js`]
- **Owns:** [the specific responsibility this repo has — be precise, not aspirational]
- **Does not own:** [explicitly out of scope, so an agent doesn't "helpfully" expand it]

## How it's built

- Package manager: [npm / pnpm / etc.] — **exact pinning, no `^`/`~` in dependencies**
- Install: `npm ci` (never `npm install` in CI or for agents)
- Validation schema: [e.g. Zod `.strict()` — reject unknown keys, don't silently drop them]
- Build: `[command]`
- Test: `[command]` — [N] tests currently passing, keep it that way
- Lint/format: `[command]`
- CI: see `.github/workflows/` — [ci-node.yml / ci-python.yml / etc.], runs on every PR

## Directory map

```
src/
  [dir]/     — [one line: what lives here]
  [dir]/     — [one line: what lives here]
tests/       — [unit / integration split if any]
docs/        — human-readable docs, not agent instructions (those live here)
```

## Conventions an agent must follow

- [e.g. All GitHub Actions pinned to major version tags only — `actions/checkout@v6`, not `@v6.0.1` or a SHA]
- [e.g. No new dependencies without checking if one already in the tree covers it]
- [e.g. Commit messages: conventional commits, imperative mood]
- [Add your actual house rules here — this section is the whole point of the file]

## Progressive disclosure

Start here. If you need more:
- Architecture rationale → `docs/architecture.md`
- Release process → `docs/release-checklist.md`
- Incident/on-call → `docs/incident-template.md`
- Full contributor guide (humans) → `CONTRIBUTING.md`

Do not read the entire `docs/` tree by default — follow links from here only when the
task actually requires that depth. This file should be sufficient for 80% of tasks.

## Known gotchas

[The things that aren't obvious from reading the code — the stuff a human teammate
would tell a new hire in their first week. This is the highest-value section in the
file and the one most people skip. Don't skip it.]
