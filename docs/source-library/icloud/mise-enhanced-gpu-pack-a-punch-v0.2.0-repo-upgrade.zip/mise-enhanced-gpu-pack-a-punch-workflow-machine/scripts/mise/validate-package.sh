#!/usr/bin/env bash
set -euo pipefail

node --check scripts/mise-utils.mjs
node --check scripts/mise-context.mjs
node --check scripts/mise-risk-gate.mjs
node --check scripts/mise-stack-graph.mjs
node --check scripts/mise-quality-runner.mjs
node --check scripts/mise-supply-chain.mjs
node --check scripts/mise-branch-advisor.mjs
node --check scripts/mise-report.mjs

python3 -m py_compile scripts/mise/complexity_measure.py scripts/mise/gpu_smoke_test.py scripts/mise/emit_evidence.py

python3 - <<'PY'
import json
from pathlib import Path
for p in [Path(".github/mise/mise-policy.json"), Path(".github/mise/gpu-policy.json"), Path("package.json")]:
    json.loads(p.read_text())
    print(f"ok json: {p}")
PY

echo "Validation passed."
