# GPU Runner Setup

The GPU job expects a self-hosted runner with these labels:

```text
self-hosted, linux, x64, gpu, mise-gpu-ephemeral
```

Use an ephemeral runner model where each runner handles one job and is then destroyed or recycled.

## Minimum requirements

- Linux x64 machine
- NVIDIA GPU
- NVIDIA driver installed
- `nvidia-smi` available
- GitHub Actions runner registered with the labels above

## Optional container support

For containerized GPU jobs, install NVIDIA Container Toolkit and verify:

```bash
docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
```
