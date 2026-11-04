#!/usr/bin/env bash
set -euo pipefail

mkdir -p mise-evidence

echo "## GPU Runner Preflight" | tee mise-evidence/gpu-preflight.md
echo "" | tee -a mise-evidence/gpu-preflight.md
echo "- Host: $(hostname)" | tee -a mise-evidence/gpu-preflight.md
echo "- Kernel: $(uname -a)" | tee -a mise-evidence/gpu-preflight.md
echo "- Date UTC: $(date -u +%FT%TZ)" | tee -a mise-evidence/gpu-preflight.md

if ! command -v nvidia-smi >/dev/null 2>&1; then
  echo "::error::nvidia-smi not found. This runner is not GPU-ready."
  echo "- nvidia-smi: missing" | tee -a mise-evidence/gpu-preflight.md
  exit 1
fi

echo "- nvidia-smi: present" | tee -a mise-evidence/gpu-preflight.md
nvidia-smi | tee mise-evidence/nvidia-smi.txt

echo "" | tee -a mise-evidence/gpu-preflight.md
echo "### GPU Query" | tee -a mise-evidence/gpu-preflight.md
nvidia-smi --query-gpu=index,name,driver_version,memory.total,memory.free,temperature.gpu,utilization.gpu --format=csv,noheader | tee mise-evidence/gpu-query.csv

if command -v docker >/dev/null 2>&1; then
  echo "- docker: present" | tee -a mise-evidence/gpu-preflight.md
  docker version --format '{{.Server.Version}}' | tee mise-evidence/docker-version.txt || true
else
  echo "- docker: missing" | tee -a mise-evidence/gpu-preflight.md
fi

echo "GPU preflight complete."
