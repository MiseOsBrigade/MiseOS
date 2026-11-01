# Mise Enhanced GPU Pack-a-Punch

[![Mise Skill Pack Index](https://github.com/DeontewattsV1/Mise-Enhanced-GPU-Pack-a-Punch/actions/workflows/mise-skill-pack-index.yml/badge.svg)](https://github.com/DeontewattsV1/Mise-Enhanced-GPU-Pack-a-Punch/actions/workflows/mise-skill-pack-index.yml)
[![SemVer](https://img.shields.io/badge/SemVer-0.2.0-blue?style=flat-square&logo=semver)](CHANGELOG.md)
[![GPU Lane](https://img.shields.io/badge/GPU_Lane-Manual--Approval-yellow?style=flat-square&logo=gpu&logoColor=00d4ff)](docs/SKILL-PACK-INTEGRATION.md)
[![Trust Boundary](https://img.shields.io/badge/Trust-Metadata--Only-green?style=flat-square&logo=shield)](docs/SKILL-PACK-INTEGRATION.md)

Reusable GitHub Actions stack for risk gates, quality orchestration, supply-chain checks, branch advice, optional ephemeral GPU complexity lanes, and an auditable skill-pack routing layer.

## What this adds

- **A0 Measurement Context** — changed files, line delta, workflow edits, dependency edits, native/GPU code, scripts, and suspicious patterns.
- **B1 Risk Gate** — blocks unsafe changes before expensive or sensitive jobs run.
- **C2 CPU Quality Stack** — auto-detects Python, Node, Go, Rust, and Java checks.
- **D3 GPU Complexity Stack** — runs only when manually approved or PR-labeled.
- **E4 Skill-Pack Index** — indexes vendored `SKILL.md` files and component manifests without executing them.
- **F5 Evidence Report** — uploads JSON and Markdown audit evidence.

## v0.2.0 upgrade

This branch adds repo-safe scaffolding for the uploaded `skills-main.zip` pack. The full local upgrade artifact vendors the uploaded pack under `vendor/nv-skills/`; this repository branch adds the CI, trust policy, scripts, and manifest summary needed to review that import safely before merging the full pack.

## Install

```bash
unzip mise-enhanced-gpu-pack-a-punch-v0.2.0-repo-upgrade.zip
cd mise-enhanced-gpu-pack-a-punch-workflow-machine
./apply-upgrade.sh /path/to/your/repo
```

Then create a review branch:

```bash
cd /path/to/your/repo
git checkout -b ci/mise-enhanced-gpu-pack-a-punch-v0.2.0
git add .github scripts docs examples schemas vendor package.json README.md CHANGELOG.md
git commit -m "Upgrade Mise GPU Pack-a-Punch with skill-pack indexing"
git push -u origin ci/mise-enhanced-gpu-pack-a-punch-v0.2.0
```

## Local validation

```bash
python scripts/mise/skill_pack_index.py --root vendor/nv-skills --out-dir .mise_out --fail-on-empty
python scripts/mise/validate_skill_pack.py --root vendor/nv-skills --out .mise_out/skill-pack-validation.json
node scripts/mise-skill-router.mjs .mise_out/skill-pack-index.json cuda gpu
```

## GPU runner label

```text
self-hosted, linux, x64, gpu, mise-gpu-ephemeral
```

The GPU lane runs only with `workflow_dispatch` input `enable_gpu=true` or PR label `gpu-ok`.

## Safety boundaries

This workflow does not auto-merge, push commits, bypass branch protection, use `pull_request_target`, or run GPU jobs without authorization. Vendored skill content is indexed and validated as metadata; it is not executed by default.
