# MiseOS Repository Ecosystem

> Separate, push-ready GitHub repositories packaged inside one folder.

This bundle turns the project-chat material into a structured MiseOS repository ecosystem. Each folder under `repos/` is intended to become its own GitHub repository, with code, docs, tests, GitHub Actions, security files, and branded identity.

## Included repositories

| # | Repository | Purpose |
|---|---|---|
| 01 | `miseos-org-health` | Organization-level `.github` defaults, profile, templates, and governance |
| 02 | `miseos-character-workflow-platform` | Safe clickable-character runtime with signed manifests and allowlisted workflows |
| 03 | `miseos-gridops-visualizer` | Circuit/city/sheet workflow visualization surface |
| 04 | `miseos-assets-studio` | 3D asset library, verifier, entitlement, and studio scaffold |
| 05 | `miseos-repo-steward-agent` | Autonomous repository steward prompt, checks, and CI repair agent package |
| 06 | `miseos-research-intelligence-engine` | Precision research, source validation, and market/academic evidence engine |
| 07 | `miseos-ai-model-registry` | AI model taxonomy, capability map, and safe routing registry |
| 08 | `miseos-brand-kit` | Brand tokens, character roster, CSS variables, and identity guidelines |

## Validate everything

```bash
bash scripts/validate-all.sh
```

## Push strategy

Create one GitHub repository per folder under `repos/`. Start with `miseos-org-health`, then publish the core platform, then the supporting packages.

## Safety rule

Character images and cards are visual-only. Click behavior comes from signed manifests and allowlisted workflows, not hidden code in PNG data.
