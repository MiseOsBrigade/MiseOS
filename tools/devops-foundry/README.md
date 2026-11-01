# MiseOS DevOps Foundry

A harvested and normalized CI/CD + DevOps toolkit assembled from the MiseOS project corpus.

## What was found

The scanner identified 117 DevOps-relevant files across the uploaded project archives, representing 90 unique content hashes after de-duplication. The strongest reusable core is the 23-item MiseOS registry platform: policy checks, release gates, repository stewardship, SBOM indexing, workflow linting, trust analytics, an allowlisted runner, and workflow generation.

The project also contains GitHub Actions for CI, CodeQL, Pages, contract validation, metadata validation, container publication, and domain-specific release/synchronization flows; Docker/Compose infrastructure; repository validation scripts; Dependabot configuration; and evidence-integrity tests.

## Validated reusable additions in this bundle

- `actions/repo-health`: zero-dependency Node 24 action based on MiseOS Repo Steward behavior.
- `actions/release-sentinel`: zero-dependency Node 24 release gate based on MiseOS Release Sentinel.
- `templates/workflows/ci-node.yml`: current Node CI baseline.
- `templates/workflows/reusable-node-ci.yml`: cross-repository reusable CI interface.
- `templates/workflows/codeql.yml`: CodeQL v4 security scanning.
- `templates/workflows/pages-static.yml`: current Pages artifact/deploy pattern.
- `templates/workflows/container-ghcr-attested.yml`: GHCR publication plus GitHub artifact attestation.
- `templates/workflows/npm-github-package.yml`: npm publication to GitHub Packages.
- `templates/workflows/dependency-review.yml`: pull-request dependency review.
- `templates/workflows/repo-governance.yml`: MiseOS repository baseline gate.
- `templates/workflows/release-preflight.yml`: deterministic release preflight.
- `templates/agentic/*.md`: bounded gh-aw source examples for triage, CI diagnosis, and docs drift.
- `templates/devcontainer/devcontainer.json`: repeatable Codespaces/dev-container baseline.
- `vendor/miseos-registry-core`: the original 23-capability executable registry baseline and manifests.
- `scripts/harvest_miseos_devops.py`: repeatable project-wide scraper/auditor.

## Important audit findings

Two duplicated project workflows are quarantined by the scanner because a Logfire setup prompt was saved with a `.yml` extension even though it is not YAML. Two copies of `validate.yml` also contain an invalid `actions/upload-artifact` `if-no-files-found` value. Multiple older workflows use action majors that have newer current major releases, while other MiseOS workflows are already on the newer majors.

These findings are preserved in `catalog/HARVEST_REPORT.md` and `catalog/devops-assets.json`; the reusable templates in this bundle do not carry those defects forward.

## Security model

Use least privilege, explicit `permissions`, protected branches/rulesets, CODEOWNERS, environment protection for production, trusted identities instead of broad PATs when possible, reviewable PR-only automation, and artifact/release attestations for distributable outputs. Treat agentic workflow prompts and issue/PR content as untrusted data.

GitHub Agentic Workflows remain preview functionality; compile their Markdown sources with `gh aw compile` in the target repository and inspect the generated `.lock.yml` before enabling them.

## Run the harvester

```bash
python3 scripts/harvest_miseos_devops.py /path/to/extracted-project --out catalog
```

## Validate local actions

```bash
node --check actions/repo-health/dist/index.js
node --check actions/release-sentinel/dist/index.js
```

## Recommended rollout

1. Standardize deterministic CI/security/release workflows first.
2. Publish shared reusable workflows as a versioned platform interface.
3. Add GHCR/npm Packages and artifact attestations.
4. Add repository governance and reliability scoring.
5. Introduce gh-aw agentic workflows only after deterministic guardrails, explicit safe outputs, and audit practices are established.
