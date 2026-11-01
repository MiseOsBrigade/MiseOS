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

class WorkflowRunStatus(str, enum.Enum):
    draft = "draft"; simulated = "simulated"; approval_pending = "approval_pending"; approved = "approved"; denied = "denied"; executing = "executing"; completed = "completed"; failed = "failed"

class ApprovalStatus(str, enum.Enum):
    pending = "pending"; approved = "approved"; rejected = "rejected"; expired = "expired"

class WorkflowRun(Base):
    __tablename__ = "workflow_runs"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    workflow_id: Mapped[str] = mapped_column(String(160), index=True)
    workflow_version: Mapped[str] = mapped_column(String(40))
    status: Mapped[WorkflowRunStatus] = mapped_column(Enum(WorkflowRunStatus), default=WorkflowRunStatus.draft, index=True)
    simulation_tier: Mapped[int] = mapped_column(Integer, default=0)
    input_payload: Mapped[dict] = mapped_column(JSON, default=dict)
    simulation_report: Mapped[dict] = mapped_column(JSON, default=dict)
    policy_result: Mapped[dict] = mapped_column(JSON, default=dict)
    execution_transcript: Mapped[dict] = mapped_column(JSON, default=dict)
    deterministic_sha256: Mapped[str | None] = mapped_column(String(64), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class ApprovalRequest(Base):
    __tablename__ = "approval_requests"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    workflow_run_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("workflow_runs.id"), index=True)
    status: Mapped[ApprovalStatus] = mapped_column(Enum(ApprovalStatus), default=ApprovalStatus.pending, index=True)
    requested_by: Mapped[str] = mapped_column(String(160), default="system")
    decided_by: Mapped[str | None] = mapped_column(String(160))
    reason: Mapped[str | None] = mapped_column(Text)
    evidence_sha256: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    decided_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class MemoryStatus(str, enum.Enum):
    proposed = "proposed"; approved = "approved"; quarantined = "quarantined"; expired = "expired"

class GraphNode(Base):
    __tablename__ = "graph_nodes"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    node_type: Mapped[str] = mapped_column(String(80), index=True)
    external_id: Mapped[str] = mapped_column(String(200), index=True)
    label: Mapped[str] = mapped_column(String(240), index=True)
    properties: Mapped[dict] = mapped_column(JSON, default=dict)
    embedding: Mapped[list] = mapped_column(JSON, default=list)
    embedding_model: Mapped[str] = mapped_column(String(120), default="miseos.hash-embedding.v1")
    content_sha256: Mapped[str] = mapped_column(String(64), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    __table_args__ = (UniqueConstraint("node_type", "external_id", name="uq_graph_node_external"),)

class GraphEdge(Base):
    __tablename__ = "graph_edges"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    source_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("graph_nodes.id"), index=True)
    relation: Mapped[str] = mapped_column(String(120), index=True)
    target_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("graph_nodes.id"), index=True)
    properties: Mapped[dict] = mapped_column(JSON, default=dict)
    evidence_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("evidence_cards.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    __table_args__ = (UniqueConstraint("source_id", "relation", "target_id", name="uq_graph_edge"),)

class MemoryRecord(Base):
    __tablename__ = "memory_records"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    scope: Mapped[str] = mapped_column(String(80), index=True)
    subject_id: Mapped[str] = mapped_column(String(200), index=True)
    memory_type: Mapped[str] = mapped_column(String(100), index=True)
    content: Mapped[dict] = mapped_column(JSON)
    status: Mapped[MemoryStatus] = mapped_column(Enum(MemoryStatus), default=MemoryStatus.proposed, index=True)
    sensitivity: Mapped[str] = mapped_column(String(40), default="internal", index=True)
    retention_days: Mapped[int] = mapped_column(Integer, default=365)
    source_evidence_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("evidence_cards.id"))
    supersedes_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("memory_records.id"))
    content_sha256: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    embedding: Mapped[list] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

class LineageRecord(Base):
    __tablename__ = "lineage_records"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    entity_type: Mapped[str] = mapped_column(String(80), index=True)
    entity_id: Mapped[str] = mapped_column(String(200), index=True)
    parent_type: Mapped[str] = mapped_column(String(80), index=True)
    parent_id: Mapped[str] = mapped_column(String(200), index=True)
    relation: Mapped[str] = mapped_column(String(100), default="derived_from")
    transformation: Mapped[dict] = mapped_column(JSON, default=dict)
    evidence_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("evidence_cards.id"))
    lineage_sha256: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

class AgentPerformanceEvent(Base):
    __tablename__ = "agent_performance_events"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    agent_id: Mapped[str] = mapped_column(ForeignKey("canonical_items.id"), index=True)
    workflow_run_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("workflow_runs.id"), index=True)
    metric: Mapped[str] = mapped_column(String(100), index=True)
    value: Mapped[int] = mapped_column(Integer)
    weight: Mapped[int] = mapped_column(Integer, default=100)
    context: Mapped[dict] = mapped_column(JSON, default=dict)
    evidence_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("evidence_cards.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

class AgentPerformanceScore(Base):
    __tablename__ = "agent_performance_scores"
    agent_id: Mapped[str] = mapped_column(ForeignKey("canonical_items.id"), primary_key=True)
    reliability: Mapped[int] = mapped_column(Integer, default=0)
    quality: Mapped[int] = mapped_column(Integer, default=0)
    speed: Mapped[int] = mapped_column(Integer, default=0)
    safety: Mapped[int] = mapped_column(Integer, default=0)
    teamwork: Mapped[int] = mapped_column(Integer, default=0)
    learning: Mapped[int] = mapped_column(Integer, default=0)
    composite: Mapped[int] = mapped_column(Integer, default=0, index=True)
    sample_size: Mapped[int] = mapped_column(Integer, default=0)
    methodology_version: Mapped[str] = mapped_column(String(40), default="miseos.performance.v1")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class SpatialNode(Base):
    __tablename__ = "spatial_nodes"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    object_type: Mapped[str] = mapped_column(String(80), index=True)
    object_id: Mapped[str] = mapped_column(String(200), index=True)
    zone: Mapped[str] = mapped_column(String(100), index=True)
    x: Mapped[int] = mapped_column(Integer, default=0)
    y: Mapped[int] = mapped_column(Integer, default=0)
    z: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(40), default="healthy", index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
    __table_args__ = (UniqueConstraint("object_type", "object_id", name="uq_spatial_object"),)

class Incident(Base):
    __tablename__ = "incidents"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(240))
    severity: Mapped[str] = mapped_column(String(40), index=True)
    status: Mapped[str] = mapped_column(String(40), default="open", index=True)
    repository_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("repositories.id"))
    commander_agent_id: Mapped[str | None] = mapped_column(ForeignKey("canonical_items.id"))
    workflow_run_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("workflow_runs.id"))
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)

class TimelineEvent(Base):
    __tablename__ = "timeline_events"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    event_type: Mapped[str] = mapped_column(String(100), index=True)
    aggregate_type: Mapped[str] = mapped_column(String(100), index=True)
    aggregate_id: Mapped[str] = mapped_column(String(200), index=True)
    title: Mapped[str] = mapped_column(String(240))
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    evidence_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("evidence_cards.id"))
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, index=True)

class MarketplaceListing(Base):
    __tablename__ = "marketplace_listings"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    listing_type: Mapped[str] = mapped_column(String(80), index=True)
    item_id: Mapped[str] = mapped_column(String(200), index=True)
    name: Mapped[str] = mapped_column(String(240))
    status: Mapped[str] = mapped_column(String(40), default="draft", index=True)
    price_cents: Mapped[int] = mapped_column(Integer, default=0)
    currency: Mapped[str] = mapped_column(String(12), default="usd")
    entitlement: Mapped[dict] = mapped_column(JSON, default=dict)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)

class CustomerSubscription(Base):
    __tablename__ = "customer_subscriptions"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    customer_id: Mapped[str] = mapped_column(String(200), index=True)
    listing_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("marketplace_listings.id"), index=True)
    status: Mapped[str] = mapped_column(String(40), default="active", index=True)
    provider: Mapped[str] = mapped_column(String(40), default="stripe")
    provider_subscription_id: Mapped[str | None] = mapped_column(String(200), unique=True)
    configuration: Mapped[dict] = mapped_column(JSON, default=dict)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

class Brigade(Base):
    __tablename__ = "brigades"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    customer_id: Mapped[str] = mapped_column(String(200), index=True)
    name: Mapped[str] = mapped_column(String(240))
    purpose: Mapped[str] = mapped_column(Text)
    configuration: Mapped[dict] = mapped_column(JSON, default=dict)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

class BrigadeMember(Base):
    __tablename__ = "brigade_members"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    brigade_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("brigades.id"), index=True)
    agent_id: Mapped[str] = mapped_column(ForeignKey("canonical_items.id"), index=True)
    role: Mapped[str] = mapped_column(String(160))
    priority: Mapped[int] = mapped_column(Integer, default=100)
    configuration: Mapped[dict] = mapped_column(JSON, default=dict)
    __table_args__ = (UniqueConstraint("brigade_id", "agent_id", name="uq_brigade_agent"),)
