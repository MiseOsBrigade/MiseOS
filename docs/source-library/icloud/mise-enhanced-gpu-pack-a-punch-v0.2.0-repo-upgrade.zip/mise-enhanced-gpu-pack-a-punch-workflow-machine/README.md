# Mise Enhanced GPU Pack-a-Punch Workflow Machine

A reusable GitHub Actions environment that stacks repository signals into one auditable CI processor:

- **A0 Measurement Context** — captures event, actor, branch, changed files, line delta, and stack coordinates.
- **B1 Risk Gate** — blocks secret-like material, destructive shell patterns, risky workflow changes, and fork workflow edits.
- **C2 Quality Stack** — runs repo-native lint, test, build, and syntax checks only when the project supports them.
- **D3 Supply Chain Scan** — audits dependency risk without mutating the repository.
- **E4 Branch Advisor** — recommends the next branch to review without auto-merging.
- **F5 Evidence Report** — emits Markdown/JSON evidence artifacts and an optional PR comment.
- **GPU Complexity Lane** — optional self-hosted runner lane for CUDA/GPU smoke checks and GPU-marked tests.

## Design boundary

The “quantum / cosmic / Pack-a-Punch” language is used as a system metaphor: measurement, gates, coordinates, coherence, and evidence. The implementation is normal, auditable GitHub Actions code. It does **not** claim to access unlimited energy, run beyond Planck units, or compute from particles in the cosmos. For real performance, it routes heavy work to actual GPU hardware through trusted ephemeral self-hosted runner labels.

## Quick install

```bash
unzip mise-enhanced-gpu-pack-a-punch-workflow-machine.zip
cd mise-enhanced-gpu-pack-a-punch-workflow-machine
./install.sh /path/to/your/repo
```

Then commit the installed files:

```bash
cd /path/to/your/repo
git checkout -b ci/mise-enhanced-gpu-pack-a-punch
git add .github scripts docs examples
git commit -m "Add Mise enhanced GPU Pack-a-Punch workflow machine"
git push -u origin ci/mise-enhanced-gpu-pack-a-punch
```

## Main workflows

| File | Purpose |
|---|---|
| `.github/workflows/mise-pack-a-punch.yml` | Reusable and direct workflow for measurement, risk, quality, supply-chain, branch advice, and report output. |
| `.github/workflows/mise-gpu-complexity-runner.yml` | Optional GPU complexity workflow that uses CPU preflight first and only runs GPU jobs when manually enabled or PR-labeled. |
| `.github/workflows/mise-stack-consumer.example.yml` | Example workflow that calls the Pack-a-Punch workflow as a reusable workflow. |
| `.github/workflows/mise-gpu-reusable-job.yml` | Reusable GPU job example for repositories that already have a trusted GPU runner pool. |

## Secure runner mode

Default mode uses GitHub-hosted Ubuntu:

```yaml
with:
  runner: ubuntu-latest
```

GPU mode requires a self-hosted runner with all labels below:

```yaml
runs-on: [self-hosted, linux, x64, gpu, mise-gpu-ephemeral]
```

Use that label only for disposable or strongly isolated GPU machines. Do not attach long-lived, broadly shared runners to untrusted repositories.

## GPU trigger policy

The GPU lane only runs when one of these is true:

1. Manual `workflow_dispatch` with `enable_gpu=true`.
2. Pull request has the `gpu-ok` label.

This keeps expensive GPU hardware out of normal CI and prevents arbitrary PRs from reaching privileged compute.

## Local validation

```bash
npm run validate
```

This checks JavaScript module syntax and Python script compilation.

## Files installed

```text
.github/mise/mise-policy.json
.github/mise/gpu-policy.json
.github/workflows/mise-pack-a-punch.yml
.github/workflows/mise-gpu-complexity-runner.yml
.github/workflows/mise-stack-consumer.example.yml
.github/workflows/mise-gpu-reusable-job.yml
scripts/*.mjs
scripts/mise/*.py
scripts/mise/*.sh
docs/
examples/
```

## What it intentionally does not do

It does not auto-merge, auto-commit, bypass branch protection, use `pull_request_target`, run privileged fork code, or create recursive bot pushes.


## v0.2.0 Skill-Pack Upgrade

This package now includes the uploaded `skills-main.zip` as a vendored skill catalog under `vendor/nv-skills/`.

The skill pack is not auto-executed. Mise indexes it, validates it, and uses it as an auditable routing layer for GPU, CUDA, TensorRT, NeMo, RAG, video, and workflow-specific guidance.

```bash
npm run skill:index
npm run skill:validate
node scripts/mise-skill-router.mjs .mise_out/skill-pack-index.json cuda gpu
```

New files:

- `vendor/nv-skills/` — uploaded skill catalog and upstream license.
- `scripts/mise/skill_pack_index.py` — deterministic skill/component indexer.
- `scripts/mise/validate_skill_pack.py` — non-executing trust-boundary validator.
- `scripts/mise-skill-router.mjs` — skill recommendation helper.
- `.github/workflows/mise-skill-pack-index.yml` — CI evidence lane.
- `.github/mise/skill-pack-policy.json` — skill-pack trust policy.
