# MiseOS Bootstrap Registry

Analytics-ready bootstrap registry for MiseOS packages, containers, agents, workflows, policies, templates, and release metadata.

## Boot sequence

```txt
registry → runtime → CLI → policy engine → release sentinel → analytics → autonomous updates
```

## First-class artifacts

| Layer | Artifact |
|---|---|
| Repository | `miseos-bootstrap-registry` |
| Primary package | `@mise-os/cli` |
| Primary container | `ghcr.io/mise-os/miseos-runner` |
| Primary automation | `@mise-os/release-sentinel` |
| Governance layer | `@mise-os/policy-engine` |

## Commands

```bash
corepack enable
pnpm install
pnpm validate
pnpm analytics
pnpm dashboard
pnpm export
pnpm scope:check
pnpm verify
```

## Publishing lanes

| Lane | Registry | MiseOS namespace |
|---|---|---|
| Container / OCI | `ghcr.io` | `ghcr.io/mise-os/*` |
| npm | GitHub npm registry | `@mise-os/*` |
| NuGet | GitHub NuGet registry | `MiseOS.*` |
| RubyGems | GitHub RubyGems registry | `miseos-*` |
| Maven | GitHub Maven registry | `dev.miseos:*` |
| Gradle | GitHub Maven/Gradle lane | `dev.miseos.*` |

## Registry questions

Every manifest answers:

1. What is this?
2. What does it do?
3. Who owns it?
4. What permissions does it need?
5. What package registry hosts it?
6. What changed since the last version?
7. Is it safe to use?
8. Can an agent execute it without guessing?

## Analytics outputs

```txt
reports/registry-analytics.json
reports/registry-analytics.md
reports/registry-risk-matrix.csv
reports/registry-catalog.csv
analytics/registry-metrics.json
analytics/capability-map.json
analytics/package-graph.mmd
docs/registry-dashboard.md
dist/miseos-registry-index.json
dist/miseos-registry-catalog.csv
```

## Safety posture

This registry is advisory-first. Mutation-capable workflows use explicit GitHub Actions permissions and should remain review-gated until the package has stable releases, SBOMs, provenance attestations, and clean analytics history.


---

## MiseOS Git Command Layer

The CLI now supports MiseOS-flavored Git commands while preserving Git underneath.

```bash
miseos repo status
miseos prep stage .
miseos prep commit -m "feat: add registry command layer"
miseos sync pull origin main
miseos dispatch push origin main
miseos hold stash "pause current work"
miseos undo commit HEAD
miseos trace log
```

Dangerous commands are guarded:

```bash
miseos rewind hard HEAD~1 --confirm-hard
miseos align rebase main --confirm-rewrite
miseos dispatch force-push origin feature/x --confirm-force
```

See `docs/miseos-git-command-guide.md` and `registry/git-command-map.json`.
