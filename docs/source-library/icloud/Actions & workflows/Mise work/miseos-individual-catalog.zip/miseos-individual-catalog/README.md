# MiseOS Individually Installable GitHub Catalog

**55 selectable items** generated from the validated MiseOS DevOps Foundry.

Use this package when you want to add one MiseOS workflow, Action, agentic source, platform primitive, registry capability, catalog, or quality control at a time.

## Install one item

```bash
./list-items.sh
./install-item.sh workflow-node-ci /path/to/repo
```

Existing files are not overwritten unless you explicitly set `MISEOS_FORCE=1`.

For direct terminal pasting, open `COPY_PASTE_IMPLEMENTATION.md`; every item has a self-contained block that writes the exact target paths.

## Catalog

### action

| Item ID | Title | Files |
|---|---|---:|
| `action-repo-health` | Repo Health Action | 2 |
| `action-release-sentinel` | Release Sentinel Action | 2 |

### agentic

| Item ID | Title | Files |
|---|---|---:|
| `agent-issue-triage` | Issue Triage gh-aw Source | 1 |
| `agent-ci-doctor` | CI Doctor gh-aw Source | 1 |
| `agent-docs-updater` | Documentation Updater gh-aw Source | 1 |

### catalog

| Item ID | Title | Files |
|---|---|---:|
| `catalog-machine-inventory` | Machine-Readable DevOps Inventory | 4 |
| `catalog-harvest-report` | Harvest Audit Report | 2 |

### platform

| Item ID | Title | Files |
|---|---|---:|
| `primitive-codeowners` | CODEOWNERS | 1 |
| `primitive-dependabot` | Dependabot | 1 |
| `primitive-ruleset-baseline` | Ruleset Baseline | 1 |
| `primitive-devcontainer` | Dev Container / Codespaces | 1 |
| `primitive-polyrepo-release` | Polyrepo Release Manifest | 1 |
| `primitive-changeset-convention` | Cross-Repository Change-Set Convention | 1 |
| `primitive-observability` | OpenTelemetry + Logfire Collector | 2 |
| `primitive-release-integrity` | Release Integrity Guidance | 1 |
| `primitive-adoption-roadmap` | DevOps Adoption Roadmap | 1 |

### quality

| Item ID | Title | Files |
|---|---|---:|
| `quality-bundle-validator` | Foundry Bundle Validator | 1 |
| `quality-polyrepo-validator` | Polyrepo Validator | 1 |

### registry

| Item ID | Title | Files |
|---|---|---:|
| `registry-core-shared` | MiseOS Registry Shared Runtime | 11 |
| `registry-schema` | MiseOS Registry Schema | 1 |
| `registry-catalog` | MiseOS Registry Catalog | 1 |

### registry-capability

| Item ID | Title | Files |
|---|---|---:|
| `registry-agent-sdk` | MiseOS Agent SDK | 1 |
| `registry-analytics-engine` | MiseOS Analytics Engine | 1 |
| `registry-attestation-gate` | MiseOS Attestation Gate | 1 |
| `registry-cli` | MiseOS CLI | 1 |
| `registry-docs-builder` | MiseOS Docs Builder | 1 |
| `registry-docs-hub-template` | MiseOS Docs Hub Template | 1 |
| `registry-gradle-plugin` | MiseOS Gradle Plugin | 1 |
| `registry-maven-policy-adapter` | MiseOS Maven Policy Adapter | 1 |
| `registry-nuget-client` | MiseOS NuGet Client | 1 |
| `registry-orchestra-theme` | Mise Orchestra Theme | 1 |
| `registry-policy-checker` | MiseOS Policy Checker | 1 |
| `registry-policy-engine` | MiseOS Policy Engine | 1 |
| `registry-registry-schema` | MiseOS Registry Schema | 1 |
| `registry-release-sentinel` | MiseOS Release Sentinel | 1 |
| `registry-repo-pet` | MiseOS Repo Pet | 1 |
| `registry-repo-reliability-kit` | MiseOS Repo Reliability Kit | 1 |
| `registry-repo-steward` | MiseOS Repo Steward | 1 |
| `registry-ruby-steward` | MiseOS Ruby Steward | 1 |
| `registry-runner` | MiseOS Runner | 1 |
| `registry-sbom-indexer` | MiseOS SBOM Indexer | 1 |
| `registry-trust-graph` | MiseOS Trust Graph | 1 |
| `registry-workflow-linter` | MiseOS Workflow Linter | 1 |
| `registry-workflow-pack` | MiseOS Workflow Pack | 1 |

### tooling

| Item ID | Title | Files |
|---|---|---:|
| `tool-project-harvester` | MiseOS DevOps Project Harvester | 2 |

### workflow

| Item ID | Title | Files |
|---|---|---:|
| `workflow-node-ci` | Node CI | 1 |
| `workflow-reusable-node-ci` | Reusable Node CI | 1 |
| `workflow-codeql` | CodeQL | 1 |
| `workflow-dependency-review` | Dependency Review | 1 |
| `workflow-pages-static` | GitHub Pages | 1 |
| `workflow-npm-github-package` | npm GitHub Packages | 1 |
| `workflow-ghcr-attested` | GHCR + Provenance Attestation | 1 |
| `workflow-repo-governance` | Repository Governance | 3 |
| `workflow-release-preflight` | Release Preflight | 3 |
| `workflow-polyrepo-manifest` | Polyrepo Manifest Validation | 3 |

## Registry dependency model

The 23 registry capability manifests are individually selectable, but they intentionally share the original TypeScript runtime. Install `registry-core-shared` and `registry-schema` once, then add any capability manifest you need. Install `registry-catalog` if you also want the original aggregate 23-item catalog.

## Source integrity

The package copies implementation files from the validated MiseOS DevOps Foundry rather than silently regenerating their content. The installer layer only controls placement and overwrite behavior.
