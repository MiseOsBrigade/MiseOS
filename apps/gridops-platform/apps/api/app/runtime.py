from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any
from sqlalchemy import select
from sqlalchemy.orm import Session
from .models import Workflow, WorkflowRun, RunStatus, Approval, ApprovalStatus, EvidenceCard, Certainty, GraphEdge
from .services import evidence_hash, queue_event

PROOF_TYPES = {"simulation_report", "execution_trace", "validation_report", "evidence_card"}

@dataclass(frozen=True)
class PolicyDecision:
    allowed: bool
    reason: str
    approval_required: bool = False

class PolicyEngine:
    def evaluate(self, *, requested_tier: int, actor_max_tier: int, evidence: set[str], action: str) -> PolicyDecision:
        if requested_tier > actor_max_tier:
            return PolicyDecision(False, "Actor may not self-promote beyond its authorized risk tier")
        if requested_tier >= 4 and not {"simulation_report", "tests_pass", "rollback_plan"}.issubset(evidence):
            return PolicyDecision(False, "Production execution requires simulation, tests, and rollback evidence")
        return PolicyDecision(True, "Policy requirements satisfied", approval_required=requested_tier >= 3 or action.endswith("production"))

class DeterministicWorkflowEngine:
    """State transitions are explicit and persisted; agent reasoning only supplies plans/inputs."""
    def __init__(self, policy: PolicyEngine | None = None): self.policy = policy or PolicyEngine()

    def start(self, db: Session, run: WorkflowRun, workflow: Workflow, actor_max_tier: int = 2) -> WorkflowRun:
        supplied = set(run.state.get("evidence", []))
        decision = self.policy.evaluate(requested_tier=run.requested_risk_tier, actor_max_tier=actor_max_tier, evidence=supplied, action="workflow.execute")
        run.state = {**run.state, "policy_decision": decision.__dict__}
        if not decision.allowed:
            run.status = RunStatus.blocked
        elif decision.approval_required:
            run.status = RunStatus.awaiting_approval
        else:
            run.status = RunStatus.running; run.started_at = datetime.now(timezone.utc)
        queue_event(db, "miseos.run.state_changed", "workflow_run", str(run.id), {"status": run.status.value})
        return run

    def advance(self, db: Session, run: WorkflowRun, workflow: Workflow) -> WorkflowRun:
        if run.status not in {RunStatus.running, RunStatus.validating}: return run
        steps = workflow.definition.get("spec", {}).get("steps", [])
        completed = list(run.state.get("completed_steps", []))
        next_step = next((s for s in steps if s["id"] not in completed), None)
        if next_step is None:
            required = set(workflow.definition.get("spec", {}).get("proofGate", {}).get("required", []))
            produced = set(run.state.get("evidence", []))
            if not required.issubset(produced):
                run.status = RunStatus.blocked
                run.state = {**run.state, "missing_proof": sorted(required-produced)}
                return run
            run.status = RunStatus.completed; run.completed_at = datetime.now(timezone.utc); run.current_step = None
            return run
        run.current_step = next_step["id"]
        completed.append(next_step["id"])
        outputs = dict(run.state.get("step_outputs", {})); outputs[next_step["id"]] = {"status":"completed", "action":next_step.get("action"), "at":datetime.now(timezone.utc).isoformat()}
        run.state = {**run.state, "completed_steps":completed, "step_outputs":outputs}
        if next_step.get("type") == "human_approval": run.status = RunStatus.awaiting_approval
        elif next_step["id"] == "validate": run.status = RunStatus.validating
        queue_event(db, "miseos.run.step_completed", "workflow_run", str(run.id), {"step":next_step["id"]})
        return run

def create_graph_edge(db: Session, **kwargs: Any) -> GraphEdge:
    edge = GraphEdge(**kwargs); db.add(edge); return edge
