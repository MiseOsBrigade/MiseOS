# CLAUDE.md — @goodshyt/mise-orchestra

## Why

DevOps config drift kills velocity. Teams need a single, human-readable
file that expresses their standards, checked automatically on every PR —
but never blocking anything until the team consciously opts in.
`mise-orchestra init` drops that file into any repo in under 10 seconds.

## What

A TypeScript/Node CLI that scaffolds the Mise DevOps Orchestra config
system into a target repository. Two files, zero overwriting without
consent, always advisory-first.

Core outputs:
- `mise.yaml` — all Orchestra policy in one place
- `.github/workflows/mise-orchestra.yml` — advisory GitHub Actions check

## How

```
src/
  cli.ts               Commander entry point + flag validation
  commands/init.ts     Top-level command: detect → build → write → report
  schema/mise-schema.ts  Zod .strict() schemas + parseMiseFile helper
  detect/profile.ts    Marker-file heuristic → RepoProfile
  detect/environment.ts  .git/config reader → MiseEnvironment
  templates/
    mise-yaml.ts       buildMiseConfig() + renderMiseYaml()
    workflow.ts        renderWorkflow() — GitHub Actions YAML
    explainer.ts       renderExplainer() — docs/mise-orchestra.md
  utils/
    safe-write.ts      safeWrite() — no-overwrite + dry-run contract
    git.ts             isGitRepo() + warnIfUncommittedChanges()
tests/                 Vitest — profile, yaml, safe-write, init integration
```

## Progressive disclosure

**Adding a new profile:**
1. Add the literal to `RepoProfile` in `mise-schema.ts`
2. Add a `case` in `defaultPoliciesForProfile()` in `mise-yaml.ts`
3. Add heuristic signals in `detectRepoProfile()` in `profile.ts`
4. Add test cases in `tests/profile.test.ts`

**Adding a new module:**
1. Add the key + default to `ModulesSchema` in `mise-schema.ts`
2. Wire the default in `buildMiseConfig()` in `mise-yaml.ts`
3. Add the rendered line in `renderMiseYaml()`

**Adding a new forge (environment):**
1. Add the literal to `MiseEnvironment` in `mise-schema.ts`
2. Add URL pattern in `detectEnvironment()` in `environment.ts`
3. Add workflow renderer in `templates/` if needed
4. Gate on environment in `commands/init.ts`

## Constraints

- TypeScript 5+ ESM NodeNext — no CommonJS
- Zod `.strict()` on every schema — no silent extra keys
- Exact dependency pinning — no `^` or `~`
- `actions/checkout@v6` in all generated workflows
- `mode` is always `advisory` out of `init` — enforced is the user's call
- `--dry-run` must never touch disk under any code path
