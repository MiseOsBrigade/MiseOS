import enum
import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum, Integer, JSON, Boolean, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .db import Base

class RecordKind(str, enum.Enum):
    character_card = "character_card"
    registry_manifest = "registry_manifest"

class TaskStatus(str, enum.Enum):
    queued = "queued"; running = "running"; blocked = "blocked"; completed = "completed"; failed = "failed"

class Certainty(str, enum.Enum):
    confirmed = "confirmed"; inferred = "inferred"; unknown = "unknown"; contradicted = "contradicted"

class CanonicalItem(Base):
    __tablename__ = "canonical_items"
    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    number: Mapped[int | None] = mapped_column(Integer)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200), index=True)
    record_kind: Mapped[RecordKind] = mapped_column(Enum(RecordKind), index=True)
    department: Mapped[str | None] = mapped_column(String(120), index=True)
    role: Mapped[str | None] = mapped_column(String(200))
    rarity: Mapped[str | None] = mapped_column(String(80))
    provenance: Mapped[str | None] = mapped_column(String(120))
    payload: Mapped[dict] = mapped_column(JSON)
    imported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

class Repository(Base):
    __tablename__ = "repositories"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    owner: Mapped[str] = mapped_column(String(120))
    name: Mapped[str] = mapped_column(String(160))
    default_branch: Mapped[str] = mapped_column(String(120), default="main")
    status: Mapped[str] = mapped_column(String(40), default="unknown", index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    __table_args__ = (UniqueConstraint("owner", "name", name="uq_repository_owner_name"),)

class Workflow(Base):
    __tablename__ = "workflows"
    id: Mapped[str] = mapped_column(String(160), primary_key=True)
    version: Mapped[str] = mapped_column(String(40), primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    department: Mapped[str | None] = mapped_column(String(120), index=True)
    definition: Mapped[dict] = mapped_column(JSON)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(240))
    status: Mapped[TaskStatus] = mapped_column(Enum(TaskStatus), default=TaskStatus.queued, index=True)
    repository_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("repositories.id"))
    workflow_id: Mapped[str | None] = mapped_column(String(160))
    workflow_version: Mapped[str | None] = mapped_column(String(40))
    assigned_agent_id: Mapped[str | None] = mapped_column(ForeignKey("canonical_items.id"), index=True)
    input_payload: Mapped[dict] = mapped_column(JSON, default=dict)
    output_payload: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class EvidenceCard(Base):
    __tablename__ = "evidence_cards"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    task_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("tasks.id"), index=True)
    agent_id: Mapped[str | None] = mapped_column(ForeignKey("canonical_items.id"), index=True)
    claim: Mapped[str] = mapped_column(Text)
    certainty: Mapped[Certainty] = mapped_column(Enum(Certainty), index=True)
    action: Mapped[str] = mapped_column(String(200))
    target: Mapped[dict] = mapped_column(JSON, default=dict)
    proof: Mapped[list] = mapped_column(JSON, default=list)
    policy_decision: Mapped[dict] = mapped_column(JSON, default=dict)
    sha256: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    signature: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

class OutboxEvent(Base):
    __tablename__ = "outbox_events"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    subject: Mapped[str] = mapped_column(String(240), index=True)
    aggregate_type: Mapped[str] = mapped_column(String(120))
    aggregate_id: Mapped[str] = mapped_column(String(160))
    payload: Mapped[dict] = mapped_column(JSON)
    published: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

Index("ix_tasks_workflow", Task.workflow_id, Task.workflow_version)

class RiskTier(int, enum.Enum):
    observe = 0
    ghost = 1
    dry_run = 2
    sandbox = 3
    production = 4

class RunStatus(str, enum.Enum):
    planned = "planned"; awaiting_approval = "awaiting_approval"; running = "running"; validating = "validating"; completed = "completed"; failed = "failed"; blocked = "blocked"; rolled_back = "rolled_back"

class ApprovalStatus(str, enum.Enum):
    pending = "pending"; approved = "approved"; rejected = "rejected"; expired = "expired"

class WorkflowRun(Base):
    __tablename__ = "workflow_runs"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    workflow_id: Mapped[str] = mapped_column(String(160), index=True)
    workflow_version: Mapped[str] = mapped_column(String(40))
    task_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("tasks.id"), index=True)
    status: Mapped[RunStatus] = mapped_column(Enum(RunStatus), default=RunStatus.planned, index=True)
    risk_tier: Mapped[int] = mapped_column(Integer, default=0)
    requested_risk_tier: Mapped[int] = mapped_column(Integer, default=0)
    current_step: Mapped[str | None] = mapped_column(String(160))
    state: Mapped[dict] = mapped_column(JSON, default=dict)
    trace_id: Mapped[str | None] = mapped_column(String(64), index=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

class Policy(Base):
    __tablename__ = "policies"
    id: Mapped[str] = mapped_column(String(180), primary_key=True)
    version: Mapped[str] = mapped_column(String(40), primary_key=True)
    effect: Mapped[str] = mapped_column(String(20), default="deny")
    definition: Mapped[dict] = mapped_column(JSON)
    active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

class Approval(Base):
    __tablename__ = "approvals"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    run_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("workflow_runs.id"), index=True)
    action: Mapped[str] = mapped_column(String(200), index=True)
    requester: Mapped[str] = mapped_column(String(160))
    approvers: Mapped[list] = mapped_column(JSON, default=list)
    threshold: Mapped[str] = mapped_column(String(32), default="all")
    evidence_required: Mapped[list] = mapped_column(JSON, default=list)
    decisions: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[ApprovalStatus] = mapped_column(Enum(ApprovalStatus), default=ApprovalStatus.pending, index=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    decided_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

class GraphEdge(Base):
    __tablename__ = "graph_edges"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    source_type: Mapped[str] = mapped_column(String(80), index=True)
    source_id: Mapped[str] = mapped_column(String(180), index=True)
    relationship: Mapped[str] = mapped_column(String(120), index=True)
    target_type: Mapped[str] = mapped_column(String(80), index=True)
    target_id: Mapped[str] = mapped_column(String(180), index=True)
    properties: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    __table_args__ = (UniqueConstraint("source_type","source_id","relationship","target_type","target_id",name="uq_graph_edge"),)
