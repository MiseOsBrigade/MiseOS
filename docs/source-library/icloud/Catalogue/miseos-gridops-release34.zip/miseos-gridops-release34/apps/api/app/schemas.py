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

class WorkflowRunCreate(BaseModel):
    workflow_id: str = "operations.service-recovery"
    workflow_version: str = "1.0.0"
    simulation_tier: int = Field(default=0, ge=0, le=4)
    input_payload: dict[str, Any] = Field(default_factory=dict)

class ApprovalDecision(BaseModel):
    decided_by: str
    approve: bool
    reason: str | None = None


class MemoryCreate(BaseModel):
    scope: str
    subject_id: str
    memory_type: str
    content: dict
    sensitivity: str = "internal"
    retention_days: int = 365
    source_evidence_id: UUID | None = None

class LineageCreate(BaseModel):
    entity_type: str
    entity_id: str
    parent_type: str
    parent_id: str
    relation: str = "derived_from"
    transformation: dict = {}
    evidence_id: UUID | None = None

class PerformanceEventCreate(BaseModel):
    agent_id: str
    workflow_run_id: UUID | None = None
    metric: str
    value: int = Field(ge=0, le=100)
    weight: int = Field(default=100, ge=1, le=1000)
    context: dict = {}
    evidence_id: UUID | None = None

class IncidentCreate(BaseModel):
    title: str
    severity: str
    repository_id: UUID | None = None
    commander_agent_id: str | None = None
    workflow_run_id: UUID | None = None
    metadata_json: dict = {}

class BrigadeCreate(BaseModel):
    customer_id: str
    name: str
    purpose: str
    agent_ids: list[str]
    configuration: dict = {}

class MarketplaceCreate(BaseModel):
    listing_type: str
    item_id: str
    name: str
    price_cents: int = Field(default=0, ge=0)
    currency: str = "usd"
    entitlement: dict = {}
    metadata_json: dict = {}
