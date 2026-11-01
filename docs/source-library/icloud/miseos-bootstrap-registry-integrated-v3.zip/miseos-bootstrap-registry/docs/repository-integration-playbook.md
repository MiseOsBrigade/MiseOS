# Repository Integration Playbook

## Goal

Integrate this package as the canonical `miseos-bootstrap-registry` repository before publishing any external packages.

## Phase 0 — Local validation

```bash
corepack enable
pnpm install
pnpm verify
pnpm integration:report
pnpm orchestra:summary
pnpm repo-pet:test
```

## Phase 1 — Create repository

Repository name:

```text
miseos-bootstrap-registry
```

Description:

```text
Bootstrap registry for MiseOS packages, containers, agents, workflows, policies, templates, analytics, and release metadata.
```

Recommended visibility at first: **private** or **internal** until package publishing is verified.

## Phase 2 — Push code

```bash
git init
git add .
git commit -m "feat: bootstrap MiseOS registry"
git branch -M main
git remote add origin git@github.com:Mise-OS/miseos-bootstrap-registry.git
git push -u origin main
```

## Phase 3 — Protect the bootloader

Enable:

- Require pull request before merge
- Require status checks
- Require `validate-registry`
- Require `scorecard`
- Require signed commits if available
- Restrict who can push to `main`

## Phase 4 — Publish later, not now

Do not publish npm packages until the GHCR runner succeeds. The runner becomes the known-good execution environment for future package checks.
