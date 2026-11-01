# Recommended MiseOS CI/CD + DevOps Tool Catalog

This catalog separates source-backed executable baselines from newly normalized GitHub delivery surfaces.

## Core executable registry capabilities

| Registry ID | Surface | DevOps use | Suggested GitHub integration |
|---|---|---|---|
| `miseos.agent-sdk` | SDK | Typed agent definitions and permission metadata | Agent package generation / policy review |
| `miseos.analytics-engine` | Analytics | Deterministic descriptive statistics | Workflow telemetry summaries |
| `miseos.attestation-gate` | Policy | HMAC-SHA256 verification baseline | Internal non-GitHub attestation checks |
| `miseos.cli` | Package | Operator command surface | Codespaces / local developer CLI |
| `miseos.docs-builder` | Container | Bounded Markdown generation | Docs CI / PR output |
| `miseos.docs-hub-template` | Template | MkDocs-ready documentation bootstrap | GitHub Pages documentation hubs |
| `miseos.gradle-plugin` | Package | Gradle Java policy audit | JVM CI gate |
| `miseos.maven-policy-adapter` | Package | POM policy essentials | Maven dependency/policy gate |
| `miseos.nuget-client` | SDK | PackageReference indexing | .NET dependency inventory |
| `miseos.policy-checker` | Container | Policy evaluation facade | Reusable policy workflow |
| `miseos.policy-engine` | Policy | Declarative exists/equals/includes/max rules | Repository/org policy checks |
| `miseos.registry-schema` | Schema | Registry manifest boundary validation | Catalog CI |
| `miseos.release-sentinel` | Agent | SemVer/changelog/license release gates | Release preflight action |
| `miseos.repo-steward` | Agent | Governance-file health | Repo onboarding / health action |
| `miseos.ruby-steward` | Package | Gemspec essentials/dependencies | Ruby CI gate |
| `miseos.runner` | Container | Allowlisted registry task execution | Restricted executor |
| `miseos.sbom-indexer` | Agent | CycloneDX/SPDX component indexing | SBOM ingestion / compliance data |
| `miseos.trust-graph` | Analytics | Degree/isolation analytics | Dependency/trust graph reporting |
| `miseos.workflow-linter` | Agent | GitHub Actions structure audit | PR workflow policy gate |
| `miseos.workflow-pack` | Workflow | Generates validation workflow | Repo bootstrap |
| `miseos.repo-pet` | Agent | Maps health score to status | Developer-facing repository health UI |
| `miseos.repo-reliability-kit` | Workflow | Weighted reliability score | Org scorecards / dashboards |
| `miseos.orchestra-theme` | Theme | Shared UI tokens | Pages / internal developer portal |

All 23 are marked `active` in the harvested registry catalog, but they are explicitly described by the source as executable *baseline* capabilities. Treat them as building blocks, not a claim of enterprise certification.

## GitHub-native normalized surfaces added here

| Tool | Type | Purpose |
|---|---|---|
| `actions/repo-health` | JavaScript Action | Deterministic governance-file score |
| `actions/release-sentinel` | JavaScript Action | SemVer + changelog + license release gate |
| `ci-node.yml` | Workflow | Standard Node 24 CI |
| `reusable-node-ci.yml` | Reusable workflow | Versioned cross-repo CI contract |
| `codeql.yml` | Workflow | CodeQL v4 scanning |
| `dependency-review.yml` | Workflow | Pull-request dependency review |
| `pages-static.yml` | Workflow | GitHub Pages deployment |
| `npm-github-package.yml` | Workflow | GitHub Packages npm publication |
| `container-ghcr-attested.yml` | Workflow | GHCR publish + provenance attestation |
| `repo-governance.yml` | Workflow | Baseline repository governance gate |
| `release-preflight.yml` | Workflow | Release readiness gate |
| `issue-triage.md` | gh-aw source | Bounded issue clarification |
| `ci-doctor.md` | gh-aw source | AI-assisted CI failure diagnosis |
| `docs-updater.md` | gh-aw source | Documentation drift PRs |
| `devcontainer.json` | Dev container | Repeatable Codespaces workbench |

## GitHub Well-Architected pillar mapping

- **Productivity:** CLI, workflow pack, reusable CI, dev container, docs builder, agent SDK.
- **Collaboration:** repo steward, docs hub, issue triage, docs updater, Pages.
- **Application Security:** CodeQL, dependency review, policy engine/checker, workflow linter, SBOM indexer, attested containers.
- **Governance:** release sentinel, repo reliability kit, registry schema, allowlisted runner, environment-gated release patterns.
- **Architecture:** registry platform, trust graph, analytics engine, GridOps evidence/canonical validation, containerized deployment.
