# MiseOS DevOps Harvest Catalog

Scanned assets: **117**

## Asset classes

| Kind | Count |
|---|---:|
| `automation-script` | 9 |
| `container-infrastructure` | 7 |
| `devops-documentation` | 25 |
| `github-workflow` | 26 |
| `governance-security` | 3 |
| `package-manifest` | 20 |
| `registry-manifest` | 27 |

## Status

| Status | Count |
|---|---:|
| `active` | 23 |
| `candidate` | 74 |
| `quarantine` | 4 |
| `review` | 16 |

## Workflow hygiene findings

| Finding | Count |
|---|---:|
| `action-major-behind-current-baseline:actions/checkout@v4->v7` | 12 |
| `action-major-behind-current-baseline:actions/configure-pages@v5->v6` | 4 |
| `action-major-behind-current-baseline:actions/setup-node@v4->v7` | 4 |
| `action-major-behind-current-baseline:actions/setup-node@v6->v7` | 4 |
| `action-major-behind-current-baseline:actions/setup-python@v5->v6` | 2 |
| `action-major-behind-current-baseline:actions/upload-artifact@v4->v7` | 2 |
| `action-major-behind-current-baseline:actions/upload-pages-artifact@v3->v5` | 4 |
| `action-major-behind-current-baseline:docker/build-push-action@v6->v7` | 1 |
| `action-major-behind-current-baseline:docker/login-action@v3->v4` | 1 |
| `action-major-behind-current-baseline:docker/metadata-action@v5->v6` | 1 |
| `invalid-upload-artifact-if-no-files-found:facilitate buiding/ coding files needed ` | 2 |
| `invalid-workflow-yaml:ScannerError` | 2 |
| `workflow-missing-explicit-permissions` | 6 |
| `workflow-missing-jobs` | 2 |
| `workflow-missing-name` | 2 |
| `workflow-missing-trigger` | 2 |

## Highest-value candidates

| Score | Kind | Status | Asset |
|---:|---|---|---|
| 95 | `github-workflow` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/.github/workflows/ci.yml` |
| 95 | `github-workflow` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/.github/workflows/codeql.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/.github/workflows/contracts-ci.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/.github/workflows/fileops-console-verify.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/.github/workflows/jekyll-gh-pages.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/.github/workflows/lineage-editor.yml` |
| 95 | `github-workflow` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/.github/workflows/pages.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/.github/workflows/static.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/.github/workflows/supermemory-validate.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/.github/workflows/validate.yml` |
| 95 | `github-workflow` | `candidate` | `MiseOS-main_2/MiseOS-main/.github/workflows/ci.yml` |
| 95 | `github-workflow` | `candidate` | `MiseOS-main_2/MiseOS-main/.github/workflows/codeql.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-main_2/MiseOS-main/.github/workflows/contracts-ci.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-main_2/MiseOS-main/.github/workflows/fileops-console-verify.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-main_2/MiseOS-main/.github/workflows/jekyll-gh-pages.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-main_2/MiseOS-main/.github/workflows/lineage-editor.yml` |
| 95 | `github-workflow` | `candidate` | `MiseOS-main_2/MiseOS-main/.github/workflows/pages.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-main_2/MiseOS-main/.github/workflows/static.yml` |
| 95 | `github-workflow` | `review` | `MiseOS-main_2/MiseOS-main/.github/workflows/validate.yml` |
| 95 | `github-workflow` | `review` | `mise_orchestra_trading_cards_pack/mise_orchestra_trading_cards/.github/workflows/validate-card-metadata.yml` |
| 95 | `github-workflow` | `review` | `miseos-registry-platform/miseos-registry-platform/.github/workflows/ci.yml` |
| 95 | `github-workflow` | `review` | `miseos-registry-platform/miseos-registry-platform/.github/workflows/container.yml` |
| 90 | `governance-security` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/.github/dependabot.yml` |
| 90 | `registry-manifest` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/registry/registry-catalog.manifest.json` |
| 90 | `governance-security` | `candidate` | `MiseOS-main_2/MiseOS-main/.github/dependabot.yml` |
| 90 | `registry-manifest` | `candidate` | `MiseOS-main_2/MiseOS-main/registry/registry-catalog.manifest.json` |
| 90 | `governance-security` | `candidate` | `miseos-registry-platform/miseos-registry-platform/SECURITY.md` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.agent-sdk.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.analytics-engine.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.attestation-gate.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.cli.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.docs-builder.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.docs-hub-template.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.gradle-plugin.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.maven-policy-adapter.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.nuget-client.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.orchestra-theme.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.policy-checker.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.policy-engine.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.registry-schema.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.release-sentinel.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.repo-pet.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.repo-reliability-kit.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.repo-steward.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.ruby-steward.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.runner.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.sbom-indexer.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.trust-graph.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.workflow-linter.manifest.json` |
| 90 | `registry-manifest` | `active` | `miseos-registry-platform/miseos-registry-platform/registry/manifests/miseos.workflow-pack.manifest.json` |
| 90 | `registry-manifest` | `candidate` | `miseos-registry-platform/miseos-registry-platform/registry/registry-catalog.manifest.json` |
| 90 | `registry-manifest` | `candidate` | `miseos-registry-platform/miseos-registry-platform/registry/registry-catalog.schema.json` |
| 80 | `automation-script` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/packages/miseos-fileops/scripts/lint-no-secrets.mjs` |
| 80 | `automation-script` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/scripts/deploy.cjs` |
| 80 | `automation-script` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/scripts/validate_repository.py` |
| 80 | `automation-script` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/supermemory/scripts/validate.mjs` |
| 80 | `automation-script` | `candidate` | `MiseOS-main_2/MiseOS-main/packages/miseos-fileops/scripts/lint-no-secrets.mjs` |
| 80 | `automation-script` | `candidate` | `MiseOS-main_2/MiseOS-main/scripts/deploy.cjs` |
| 80 | `automation-script` | `candidate` | `MiseOS-main_2/MiseOS-main/scripts/validate_repository.py` |
| 80 | `container-infrastructure` | `candidate` | `miseos-gridops-release1/miseos-gridops-release1/Makefile` |
| 80 | `container-infrastructure` | `candidate` | `miseos-gridops-release1/miseos-gridops-release1/apps/api/Dockerfile` |
| 80 | `container-infrastructure` | `candidate` | `miseos-gridops-release1/miseos-gridops-release1/apps/web/Dockerfile` |
| 80 | `container-infrastructure` | `candidate` | `miseos-gridops-release1/miseos-gridops-release1/docker-compose.yml` |
| 80 | `automation-script` | `candidate` | `miseos-gridops-release1/miseos-gridops-release1/scripts/verify_canonical.py` |
| 80 | `automation-script` | `candidate` | `miseos-gridops-release1/miseos-gridops-release1/tests/test_evidence_hash.py` |
| 80 | `container-infrastructure` | `candidate` | `miseos-registry-platform/miseos-registry-platform/Dockerfile` |
| 80 | `container-infrastructure` | `candidate` | `miseos-registry-platform/miseos-registry-platform/Makefile` |
| 80 | `container-infrastructure` | `candidate` | `miseos-registry-platform/miseos-registry-platform/docker-compose.yml` |
| 75 | `package-manifest` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/apps/shimeji-brigade/package.json` |
| 75 | `package-manifest` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/examples/aval-collectible-player/package.json` |
| 75 | `package-manifest` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/package.json` |
| 75 | `package-manifest` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/packages/lineage-editor/package.json` |
| 75 | `package-manifest` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/packages/miseos-fileops/package.json` |
| 75 | `package-manifest` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/packages/miseos-repo-pet/package.json` |
| 75 | `package-manifest` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/services/billing/package.json` |
| 75 | `package-manifest` | `candidate` | `MiseOS-Supermemory-Implementation/MiseOS-Supermemory-Implementation/supermemory/package.json` |
| 75 | `package-manifest` | `candidate` | `MiseOS-main_2/MiseOS-main/apps/shimeji-brigade/package.json` |
| 75 | `package-manifest` | `candidate` | `MiseOS-main_2/MiseOS-main/examples/aval-collectible-player/package.json` |
| 75 | `package-manifest` | `candidate` | `MiseOS-main_2/MiseOS-main/package.json` |
| 75 | `package-manifest` | `candidate` | `MiseOS-main_2/MiseOS-main/packages/lineage-editor/package.json` |
