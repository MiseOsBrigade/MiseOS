# Mise GPU Ephemeral Complexity Runner

A secure, GPU-aware GitHub Actions environment for routing repository work by measured complexity.

This pack upgrades the repo runner from a basic CI lane into a **measurement → risk gate → CPU/GPU routing → evidence reporting** machine.

The cosmic / quantum language is treated as an architecture metaphor:

- **Measurement context** = repository state, changed files, risk features, dependency changes, workflow changes.
- **Complexity processor** = deterministic score that decides whether GPU work is recommended.
- **Ephemeral runner** = disposable self-hosted GPU runner for heavy jobs.
- **Evidence mesh** = JSON + Markdown report artifacts for auditability.
- **No free-energy / Planck-scale claims** = physical runner execution still happens on real CPU/GPU hardware.

## What it adds

```text
.github/
  workflows/
    mise-gpu-complexity-runner.yml
    mise-gpu-reusable-job.yml
  mise/
    gpu-policy.json
scripts/
  mise/
    complexity_measure.py
    gpu_preflight.sh
    gpu_smoke_test.py
    emit_evidence.py
docs/
  GPU_EPHEMERAL_RUNNER.md
  ARCHITECTURE.md
```

## Safe default behavior

- CPU quality and risk analysis runs on normal `ubuntu-latest`.
- GPU jobs only run when manually enabled or explicitly labeled.
- No `pull_request_target`.
- No auto-merge.
- No bot pushes.
- No long-lived cloud credentials required.
- Uses least-privilege permissions.
- Emits artifacts instead of mutating the repo.

## Install

```bash
cp -R .github scripts docs /path/to/repo/
cd /path/to/repo

git checkout -b ci/mise-gpu-ephemeral-runner
git add .github scripts docs
git commit -m "Add Mise GPU ephemeral complexity runner"
git push -u origin ci/mise-gpu-ephemeral-runner
```

## Configure runner label

The GPU job expects a self-hosted runner with labels:

```text
self-hosted, linux, x64, gpu, mise-gpu-ephemeral
```

You can change the label in:

```text
.github/workflows/mise-gpu-complexity-runner.yml
```

## Trigger GPU lane

Manual:

```text
Actions → Mise GPU Complexity Runner → Run workflow → enable_gpu=true
```

Pull request:

Add the PR label:

```text
gpu-ok
```

The CPU measurement job can recommend GPU work, but the GPU lane still requires explicit permission.
