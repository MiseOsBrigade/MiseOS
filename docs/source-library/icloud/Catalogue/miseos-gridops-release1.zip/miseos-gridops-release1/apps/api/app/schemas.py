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
