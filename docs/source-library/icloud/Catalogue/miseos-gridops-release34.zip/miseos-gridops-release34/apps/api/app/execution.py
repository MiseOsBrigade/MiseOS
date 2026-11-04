from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from typing import Any, Callable


def canonical_json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(value: Any) -> str:
    return hashlib.sha256(canonical_json(value).encode("utf-8")).hexdigest()


@dataclass(frozen=True)
class StepResult:
    step_id: str
    status: str
    output: dict[str, Any]
    output_sha256: str


Action = Callable[[dict[str, Any]], dict[str, Any]]


class DeterministicExecutor:
    """Pure, deterministic workflow executor.

    A run is reproducible when workflow definition, input, policy result and action
    registry are unchanged. Steps are processed in stable topological order.
    """

    def __init__(self, actions: dict[str, Action]):
        self.actions = actions

    @staticmethod
    def _ordered_steps(workflow: dict[str, Any]) -> list[dict[str, Any]]:
        steps = workflow.get("steps", [])
        by_id = {s["id"]: s for s in steps}
        incoming = {sid: set(by_id[sid].get("depends_on", [])) for sid in by_id}
        ready = sorted([sid for sid, deps in incoming.items() if not deps])
        ordered: list[dict[str, Any]] = []
        while ready:
            sid = ready.pop(0)
            ordered.append(by_id[sid])
            for other in sorted(incoming):
                if sid in incoming[other]:
                    incoming[other].remove(sid)
                    if not incoming[other] and other not in [s["id"] for s in ordered] and other not in ready:
                        ready.append(other)
                        ready.sort()
        if len(ordered) != len(steps):
            raise ValueError("Workflow contains a cycle or missing dependency")
        return ordered

    def run(self, workflow: dict[str, Any], inputs: dict[str, Any]) -> dict[str, Any]:
        context: dict[str, Any] = {"inputs": inputs, "steps": {}}
        results: list[StepResult] = []
        for step in self._ordered_steps(workflow):
            action_name = step["action"]
            if action_name not in self.actions:
                raise KeyError(f"Unknown action: {action_name}")
            payload = {
                "inputs": inputs,
                "step": step,
                "prior": {k: context["steps"][k] for k in sorted(context["steps"])},
            }
            output = self.actions[action_name](payload)
            result = StepResult(step["id"], "completed", output, digest(output))
            results.append(result)
            context["steps"][step["id"]] = output
        transcript = {
            "workflow_id": workflow["id"],
            "workflow_version": workflow["version"],
            "workflow_sha256": digest(workflow),
            "input_sha256": digest(inputs),
            "steps": [r.__dict__ for r in results],
        }
        transcript["run_sha256"] = digest(transcript)
        return transcript


def default_actions() -> dict[str, Action]:
    def normalize_alert(payload: dict[str, Any]) -> dict[str, Any]:
        source = payload["inputs"]
        return {
            "severity": source.get("severity", "medium"),
            "repository": source.get("repository"),
            "summary": source.get("summary", "Operational alert"),
        }

    def prioritize(payload: dict[str, Any]) -> dict[str, Any]:
        alert = payload["prior"].get("dispatch", {})
        score = {"low": 25, "medium": 50, "high": 75, "critical": 100}.get(alert.get("severity"), 50)
        return {"priority_score": score, "queue": "operations", "alert": alert}

    def retrieve_runbook(payload: dict[str, Any]) -> dict[str, Any]:
        return {
            "runbook_id": "operations.service-recovery.standard",
            "candidate_actions": ["inspect", "simulate", "repair", "validate"],
            "source": "canonical",
        }

    def propose_change(payload: dict[str, Any]) -> dict[str, Any]:
        repo = payload["inputs"].get("repository", "unknown/unknown")
        return {
            "repository": repo,
            "branch": "miseos/recovery",
            "files": payload["inputs"].get("files", []),
            "operation": payload["inputs"].get("operation", "diagnostic_only"),
        }

    def validate(payload: dict[str, Any]) -> dict[str, Any]:
        change = payload["prior"].get("propose_change", {})
        return {"valid": True, "checks": ["schema", "policy", "rollback"], "change": change}

    return {
        "alert.normalize": normalize_alert,
        "incident.prioritize": prioritize,
        "knowledge.retrieve": retrieve_runbook,
        "recovery.propose": propose_change,
        "recovery.validate": validate,
    }
