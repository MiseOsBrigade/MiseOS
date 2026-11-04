from __future__ import annotations

from typing import Any
from .execution import digest

SIMULATION_TIERS = {
    0: {"name": "ghost", "writes": False, "requires_approval": False},
    1: {"name": "dry_run", "writes": False, "requires_approval": False},
    2: {"name": "sandbox", "writes": True, "scope": "isolated", "requires_approval": False},
    3: {"name": "pr_run", "writes": True, "scope": "pull_request", "requires_approval": True},
    4: {"name": "production", "writes": True, "scope": "production", "requires_approval": True},
}


def simulate(workflow: dict[str, Any], inputs: dict[str, Any], tier: int) -> dict[str, Any]:
    if tier not in SIMULATION_TIERS:
        raise ValueError("simulation tier must be 0..4")
    affected = sorted(set(inputs.get("files", [])))
    risk = min(100, tier * 20 + len(affected) * 3 + (20 if inputs.get("severity") == "critical" else 0))
    report = {
        "tier": tier,
        "tier_name": SIMULATION_TIERS[tier]["name"],
        "workflow_sha256": digest(workflow),
        "input_sha256": digest(inputs),
        "affected_files": affected,
        "estimated_steps": len(workflow.get("steps", [])),
        "estimated_cost_usd": round(0.01 * len(workflow.get("steps", [])) * (tier + 1), 4),
        "risk_score": risk,
        "requires_approval": SIMULATION_TIERS[tier]["requires_approval"],
        "rollback_available": bool(inputs.get("rollback_ref") or tier < 4),
    }
    report["simulation_sha256"] = digest(report)
    return report


def evaluate_policies(simulation: dict[str, Any], inputs: dict[str, Any]) -> dict[str, Any]:
    reasons: list[str] = []
    decision = "allow"
    if simulation["tier"] >= 3:
        decision = "require_approval"
        reasons.append("PR and production writes require explicit approval")
    if simulation["tier"] == 4 and not simulation["rollback_available"]:
        decision = "deny"
        reasons.append("Production execution requires a rollback reference")
    if any(".env" in f or "secret" in f.lower() for f in simulation["affected_files"]):
        decision = "deny"
        reasons.append("Secret-bearing files are protected")
    if simulation["risk_score"] >= 90 and decision != "deny":
        decision = "require_approval"
        reasons.append("High-risk execution requires approval")
    result = {
        "decision": decision,
        "reasons": reasons,
        "policy_pack": "miseos.safe-execution.v1",
        "simulation_sha256": simulation["simulation_sha256"],
    }
    result["policy_sha256"] = digest(result)
    return result
