# Mise Enhanced GPU Pack-a-Punch

A secure GitHub Actions enhancement pack for measuring change complexity, gating risk, running CPU quality checks, and optionally dispatching GPU jobs to an authorized ephemeral self-hosted runner.

## What this adds

- A0 Measurement Context: changed files, line delta, workflow edits, dependency edits, native/GPU code, scripts, and suspicious patterns.
- B1 Risk Gate: blocks unsafe changes before expensive or sensitive jobs run.
- C2 CPU Quality Stack: auto-detects Python, Node, Go, Rust, and Java checks.
- D3 GPU Complexity Stack: runs only when manually approved or PR-labeled.
- E4 Evidence Report: uploads JSON and Markdown audit evidence.

## Install

```bash
unzip mise-enhanced-gpu-pack-a-punch-full.zip
cd mise-enhanced-gpu-pack-a-punch

cp -R .github scripts docs examples README.md LICENSE .gitignore .editorconfig CONTRIBUTING.md SECURITY.md /path/to/your/repo/

cd /path/to/your/repo
git checkout -b ci/mise-enhanced-gpu-pack-a-punch
git add .github scripts docs examples README.md LICENSE .gitignore .editorconfig CONTRIBUTING.md SECURITY.md
git commit -m "Add Mise Enhanced GPU Pack-a-Punch runner"
git push -u origin ci/mise-enhanced-gpu-pack-a-punch
```

## GPU runner label

```text
self-hosted, linux, x64, gpu, mise-gpu-ephemeral
```

The GPU lane runs only with `workflow_dispatch` input `enable_gpu=true` or PR label `gpu-ok`.

## Safety boundaries

This workflow does not auto-merge, push commits, bypass branch protection, use `pull_request_target`, or run GPU jobs without authorization.
