# Ephemeral GPU runners

## Purpose

The GPU lane exists for workloads that genuinely need CUDA/GPU hardware: model tests, tensor kernels, image/video compute, simulation checks, or GPU-specific integration tests.

## Required runner labels

```yaml
runs-on: [self-hosted, linux, x64, gpu, mise-gpu-ephemeral]
```

## Minimum host expectations

- Linux x64 host.
- NVIDIA driver installed when using NVIDIA GPUs.
- `nvidia-smi` available for preflight.
- Python 3 available.
- Optional Docker with NVIDIA Container Toolkit for container smoke tests.

## Trigger controls

GPU work is intentionally opt-in:

- manual dispatch: `enable_gpu=true`
- PR label: `gpu-ok`

## Recommended production posture

Use disposable runners when possible. A long-lived self-hosted GPU box should be locked to trusted repositories and isolated from secrets, internal networks, and unrelated workloads.
