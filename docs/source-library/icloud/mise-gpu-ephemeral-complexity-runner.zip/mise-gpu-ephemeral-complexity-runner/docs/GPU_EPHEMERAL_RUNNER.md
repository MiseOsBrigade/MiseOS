# GPU Ephemeral Runner Setup

This document explains the real hardware path behind the metaphor.

A GitHub Actions runner cannot run on free cosmic energy, zero-point extraction, or beyond-Planck computation. The production-safe version is:

```text
GitHub Actions event
  → CPU measurement job
  → risk gate
  → explicit GPU authorization
  → ephemeral self-hosted GPU runner
  → preflight
  → GPU smoke test
  → evidence artifact
```

## Required runner labels

Configure your self-hosted GPU runner with:

```text
self-hosted
linux
x64
gpu
mise-gpu-ephemeral
```

The workflow uses:

```yaml
runs-on: [self-hosted, linux, x64, gpu, mise-gpu-ephemeral]
```

## Minimum GPU host expectations

The GPU machine should have:

- Linux host.
- NVIDIA driver installed.
- `nvidia-smi` available.
- Python 3 available.
- Optional Docker.
- Optional NVIDIA Container Toolkit if you want containerized GPU jobs.

## Ephemeral operating model

Recommended flow:

```text
1. Start a fresh GPU runner VM/pod.
2. Register it to GitHub with ephemeral behavior.
3. Run exactly one job.
4. Upload evidence.
5. Destroy the VM/pod or fully wipe the workspace.
```

This avoids persistent residue, cross-job contamination, and secret drift.

## Kubernetes / ARC pattern

For scale:

```text
GitHub Actions Runner Controller
  → runner scale set
  → GPU node pool
  → NVIDIA device plugin / GPU runtime
  → one-job runner pods
```

Keep the runner namespace separate from the controller namespace.

## Docker GPU smoke

If your host supports Docker GPU containers:

```bash
docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
```

Set this in the workflow:

```yaml
MISE_GPU_CONTAINER_SMOKE: "true"
```

## Why GPU lane is gated

GPU runners are expensive and powerful. The workflow requires:

- Manual dispatch with `enable_gpu=true`, or
- PR label `gpu-ok`.

The measurement job can recommend GPU work, but it cannot silently spend GPU resources.
