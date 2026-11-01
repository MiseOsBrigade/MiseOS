from typing import Any, Literal
from uuid import UUID
from pydantic import BaseModel, Field

class RepositoryCreate(BaseModel):
    owner: str; name: str; default_branch: str = "main"; metadata_json: dict[str, Any] = Field(default_factory=dict)

class TaskCreate(BaseModel):
    title: str
    repository_id: UUID | None = None
    workflow_id: str | None = None
    workflow_version: str | None = None
    assigned_agent_id: str | None = None
    input_payload: dict[str, Any] = Field(default_factory=dict)

class EvidenceCreate(BaseModel):
    task_id: UUID | None = None
    agent_id: str | None = None
    claim: str
    certainty: Literal["confirmed", "inferred", "unknown", "contradicted"]
    action: str
    target: dict[str, Any] = Field(default_factory=dict)
    proof: list[dict[str, Any]] = Field(default_factory=list)
    policy_decision: dict[str, Any] = Field(default_factory=dict)
    signature: str | None = None

class RunCreate(BaseModel):
    workflow_id: str
    workflow_version: str = "1.0.0"
    task_id: UUID | None = None
    requested_risk_tier: int = Field(default=0, ge=0, le=4)
    input: dict = Field(default_factory=dict)

class ApprovalDecision(BaseModel):
    approver_id: str
    approver_role: str
    decision: Literal["approve", "reject"]
    reason: str | None = None

class GraphEdgeCreate(BaseModel):
    source_type: str
    source_id: str
    relationship: str
    target_type: str
    target_id: str
    properties: dict = Field(default_factory=dict)
