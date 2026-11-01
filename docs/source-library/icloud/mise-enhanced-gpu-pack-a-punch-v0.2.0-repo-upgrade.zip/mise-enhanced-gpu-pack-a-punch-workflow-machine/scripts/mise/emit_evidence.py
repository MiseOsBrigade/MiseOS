#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

out = Path("mise-evidence")
out.mkdir(exist_ok=True)
measurement = out / "mise-measurement.json"
gpu_smoke = out / "gpu-smoke-test.json"
gpu_query = out / "gpu-query.csv"

lines = ["# Mise GPU Complexity Evidence", ""]

if measurement.exists():
    m = json.loads(measurement.read_text(encoding="utf-8"))
    lines += [
        "## Measurement",
        "",
        f"- Score: `{m.get('score')}`",
        f"- Risk: `{m.get('risk_level')}`",
        f"- GPU recommended: `{m.get('gpu_recommended')}`",
        f"- Review required: `{m.get('review_required')}`",
        f"- Blocked: `{m.get('blocked')}`",
        f"- Stack: `{', '.join(m.get('detected_stack') or [])}`",
        "",
    ]
    reasons = m.get("reasons") or []
    lines += ["## Reasons", ""]
    lines += [f"- {r}" for r in reasons] or ["- No elevated risk."]
    lines.append("")

if gpu_query.exists():
    lines += ["## GPU Query", "", "```csv", gpu_query.read_text(encoding="utf-8").strip(), "```", ""]

if gpu_smoke.exists():
    lines += ["## GPU Smoke Test", "", "```json", gpu_smoke.read_text(encoding="utf-8").strip(), "```", ""]

(out / "Mise-GPU-EVIDENCE.md").write_text("\n".join(lines), encoding="utf-8")
print(out / "Mise-GPU-EVIDENCE.md")
