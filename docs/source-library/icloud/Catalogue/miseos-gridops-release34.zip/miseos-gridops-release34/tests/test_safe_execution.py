import json
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parents[1] / "apps" / "api"))

from app.execution import DeterministicExecutor, default_actions
from app.safe_execution import simulate, evaluate_policies

WORKFLOW = json.loads((Path(__file__).parents[1] / "workflows" / "operations.service-recovery.v1.json").read_text())


def test_deterministic_execution_repeats_identically():
    inputs = {"severity": "high", "repository": "MiseOsBrigade/MiseOS", "files": ["b.py", "a.py"]}
    executor = DeterministicExecutor(default_actions())
    first = executor.run(WORKFLOW, inputs)
    second = executor.run(WORKFLOW, inputs)
    assert first == second
    assert first["run_sha256"] == second["run_sha256"]
    assert [s["step_id"] for s in first["steps"]] == ["dispatch", "prioritize", "retrieve_runbook", "propose_change", "validate"]


def test_production_without_rollback_is_denied():
    inputs = {"severity": "critical", "files": ["apps/api/main.py"]}
    report = simulate(WORKFLOW, inputs, 4)
    policy = evaluate_policies(report, inputs)
    assert policy["decision"] == "deny"


def test_secret_file_is_denied():
    inputs = {"files": [".env.production"], "rollback_ref": "release-1"}
    report = simulate(WORKFLOW, inputs, 2)
    policy = evaluate_policies(report, inputs)
    assert policy["decision"] == "deny"


def test_pr_run_requires_approval():
    inputs = {"files": ["README.md"]}
    report = simulate(WORKFLOW, inputs, 3)
    policy = evaluate_policies(report, inputs)
    assert policy["decision"] == "require_approval"
