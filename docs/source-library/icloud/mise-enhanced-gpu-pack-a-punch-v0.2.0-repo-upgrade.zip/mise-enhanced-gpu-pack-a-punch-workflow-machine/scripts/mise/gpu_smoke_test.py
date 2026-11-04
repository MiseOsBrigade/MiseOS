#!/usr/bin/env python3
from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path
from typing import Any

OUT = Path("mise-evidence")
OUT.mkdir(exist_ok=True)
report: dict[str, Any] = {
    "nvidia_smi": False,
    "frameworks": {},
    "status": "unknown",
}


def run(cmd: list[str]) -> tuple[int, str, str]:
    p = subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return p.returncode, p.stdout, p.stderr


if shutil.which("nvidia-smi"):
    code, stdout, stderr = run(["nvidia-smi", "--query-gpu=name,memory.total,driver_version", "--format=csv,noheader"])
    report["nvidia_smi"] = code == 0
    report["nvidia_smi_stdout"] = stdout.strip()
    report["nvidia_smi_stderr"] = stderr.strip()

try:
    import torch  # type: ignore

    available = bool(torch.cuda.is_available())
    framework_report: dict[str, Any] = {
        "installed": True,
        "cuda_available": available,
        "version": getattr(torch, "__version__", "unknown"),
    }
    if available:
        x = torch.arange(0, 1024, device="cuda", dtype=torch.float32)
        y = (x * x).sum().item()
        framework_report["test_sum"] = y
        framework_report["device_name"] = torch.cuda.get_device_name(0)
    report["frameworks"]["torch"] = framework_report
except Exception as exc:
    report["frameworks"]["torch"] = {"installed": False, "error": str(exc)}

try:
    import cupy as cp  # type: ignore

    x = cp.arange(1024, dtype=cp.float32)
    y = float(cp.sum(x * x).get())
    report["frameworks"]["cupy"] = {"installed": True, "test_sum": y}
except Exception as exc:
    report["frameworks"]["cupy"] = {"installed": False, "error": str(exc)}

try:
    from numba import cuda  # type: ignore

    report["frameworks"]["numba_cuda"] = {"installed": True, "available": bool(cuda.is_available())}
except Exception as exc:
    report["frameworks"]["numba_cuda"] = {"installed": False, "error": str(exc)}

gpu_ok = report["nvidia_smi"] and any(
    isinstance(v, dict) and (v.get("cuda_available") or v.get("available") or v.get("test_sum") is not None)
    for v in report["frameworks"].values()
)

report["status"] = "gpu_hardware_ok" if report["nvidia_smi"] else "gpu_hardware_missing"
report["python_gpu_framework_ready"] = bool(gpu_ok)

(OUT / "gpu-smoke-test.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report, indent=2))

if not report["nvidia_smi"]:
    raise SystemExit(1)
