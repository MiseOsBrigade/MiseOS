import asyncio
import json
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from uuid import UUID

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, func, text
from sqlalchemy.orm import Session

from .db import Base, engine, get_db
from .config import settings
from .models import (
    CanonicalItem, Repository, Task, EvidenceCard, Certainty,
    WorkflowRun, WorkflowRunStatus, ApprovalRequest, ApprovalStatus,
    GraphNode, GraphEdge, MemoryRecord, MemoryStatus, LineageRecord, AgentPerformanceEvent, AgentPerformanceScore,
    SpatialNode, Incident, TimelineEvent, MarketplaceListing, CustomerSubscription, Brigade, BrigadeMember,
)
from .schemas import (RepositoryCreate, TaskCreate, EvidenceCreate, WorkflowRunCreate, ApprovalDecision,
 MemoryCreate, LineageCreate, PerformanceEventCreate, IncidentCreate, BrigadeCreate, MarketplaceCreate)
from .services import import_canonical, evidence_hash, queue_event
from .events import outbox_publisher
from .execution import DeterministicExecutor, default_actions, digest
from .safe_execution import simulate, evaluate_policies
from .intelligence import (build_canonical_graph, semantic_search, propose_memory, approve_memory, record_lineage,
 recompute_agent_score, seed_spatial_map, sha)

stop_event = asyncio.Event()


def load_workflow() -> dict:
    return json.loads(Path(settings.workflow_path).read_text())


def record_execution_evidence(db: Session, run: WorkflowRun) -> EvidenceCard:
    proof = [
        {"type": "workflow_definition", "sha256": run.execution_transcript["workflow_sha256"]},
        {"type": "workflow_input", "sha256": run.execution_transcript["input_sha256"]},
        {"type": "execution_transcript", "sha256": run.execution_transcript["run_sha256"]},
        {"type": "simulation_report", "sha256": run.simulation_report["simulation_sha256"]},
        {"type": "policy_result", "sha256": run.policy_result["policy_sha256"]},
    ]
    material = {
        "task_id": None,
        "agent_id": "miseos.character.076",
        "claim": "Workflow executed deterministically and completed",
        "certainty": "confirmed",
        "action": "workflow.execute",
        "target": {"workflow_run_id": str(run.id), "workflow_id": run.workflow_id},
        "proof": proof,
        "policy_decision": run.policy_result,
    }
    evidence_sha = evidence_hash(material)
    existing = db.scalar(select(EvidenceCard).where(EvidenceCard.sha256 == evidence_sha))
    if existing:
        return existing
    card = EvidenceCard(
        agent_id=material["agent_id"], claim=material["claim"], certainty=Certainty.confirmed,
        action=material["action"], target=material["target"], proof=proof,
        policy_decision=run.policy_result, sha256=evidence_sha,
    )
    db.add(card); db.flush()
    queue_event(db, "miseos.evidence.recorded", "evidence", str(card.id), {
        "id": str(card.id), "sha256": evidence_sha, "workflow_run_id": str(run.id), "certainty": "confirmed"
    })
    return card


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    # PostgreSQL enforces append-only Evidence Vault records at the database layer.
    if engine.dialect.name == "postgresql":
        with engine.begin() as connection:
            connection.execute(text("""
            CREATE OR REPLACE FUNCTION miseos_prevent_evidence_mutation()
            RETURNS trigger AS $$ BEGIN
              RAISE EXCEPTION 'Evidence Vault records are immutable';
            END; $$ LANGUAGE plpgsql;
            """))
            connection.execute(text("DROP TRIGGER IF EXISTS evidence_cards_no_update ON evidence_cards"))
            connection.execute(text("DROP TRIGGER IF EXISTS evidence_cards_no_delete ON evidence_cards"))
            connection.execute(text("""CREATE TRIGGER evidence_cards_no_update BEFORE UPDATE ON evidence_cards
              FOR EACH ROW EXECUTE FUNCTION miseos_prevent_evidence_mutation()"""))
            connection.execute(text("""CREATE TRIGGER evidence_cards_no_delete BEFORE DELETE ON evidence_cards
              FOR EACH ROW EXECUTE FUNCTION miseos_prevent_evidence_mutation()"""))
    with next(get_db()) as db:
        if db.scalar(select(func.count()).select_from(CanonicalItem)) == 0:
            import_canonical(db, settings.canonical_data_path)
    task = asyncio.create_task(outbox_publisher(stop_event))
    yield
    stop_event.set(); await task

app = FastAPI(title="MiseOS GridOps Release 3–4 — Knowledge Intelligence & GridOps World", version="4.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
def health(db: Session = Depends(get_db)):
    return {
        "status": "ok", "release": 4,
        "canonical_items": db.scalar(select(func.count()).select_from(CanonicalItem)),
        "workflow_runs": db.scalar(select(func.count()).select_from(WorkflowRun)),
        "evidence_cards": db.scalar(select(func.count()).select_from(EvidenceCard)),
    }

@app.post("/admin/import-canonical")
def import_data(db: Session = Depends(get_db)):
    return import_canonical(db, settings.canonical_data_path)

@app.get("/grid/summary")
def summary(db: Session = Depends(get_db)):
    kinds = db.execute(select(CanonicalItem.record_kind, func.count()).group_by(CanonicalItem.record_kind)).all()
    departments = db.execute(select(CanonicalItem.department, func.count()).where(CanonicalItem.department.is_not(None)).group_by(CanonicalItem.department).order_by(CanonicalItem.department)).all()
    return {
        "items": {k.value:v for k,v in kinds}, "departments": [{"name":k,"count":v} for k,v in departments],
        "repositories": db.scalar(select(func.count()).select_from(Repository)),
        "tasks": db.scalar(select(func.count()).select_from(Task)),
        "evidence": db.scalar(select(func.count()).select_from(EvidenceCard)),
        "workflow_runs": db.scalar(select(func.count()).select_from(WorkflowRun)),
        "approvals_pending": db.scalar(select(func.count()).select_from(ApprovalRequest).where(ApprovalRequest.status == ApprovalStatus.pending)),
    }

@app.get("/agents")
def agents(department: str | None = None, db: Session = Depends(get_db)):
    q = select(CanonicalItem).where(CanonicalItem.record_kind == "character_card")
    if department: q = q.where(CanonicalItem.department == department)
    rows = db.execute(q.order_by(CanonicalItem.number)).scalars().all()
    return [{"id":r.id,"number":r.number,"name":r.name,"slug":r.slug,"department":r.department,"role":r.role,"rarity":r.rarity,"payload":r.payload} for r in rows]

@app.get("/registry")
def registry(db: Session = Depends(get_db)):
    rows = db.execute(select(CanonicalItem).where(CanonicalItem.record_kind == "registry_manifest").order_by(CanonicalItem.name)).scalars().all()
    return [{"id":r.id,"name":r.name,"slug":r.slug,"role":r.role,"payload":r.payload} for r in rows]

@app.post("/repositories", status_code=201)
def create_repository(body: RepositoryCreate, db: Session = Depends(get_db)):
    repo = Repository(**body.model_dump()); db.add(repo); db.flush()
    queue_event(db, "miseos.repository.created", "repository", str(repo.id), body.model_dump())
    db.commit(); db.refresh(repo); return repo

@app.get("/repositories")
def repositories(db: Session = Depends(get_db)):
    return db.execute(select(Repository).order_by(Repository.created_at.desc())).scalars().all()

@app.post("/tasks", status_code=201)
def create_task(body: TaskCreate, db: Session = Depends(get_db)):
    task = Task(**body.model_dump()); db.add(task); db.flush()
    queue_event(db, "miseos.task.created", "task", str(task.id), {**body.model_dump(mode="json"), "id":str(task.id)})
    db.commit(); db.refresh(task); return task

@app.get("/tasks")
def tasks(db: Session = Depends(get_db)):
    return db.execute(select(Task).order_by(Task.created_at.desc()).limit(200)).scalars().all()

@app.post("/evidence", status_code=201)
def create_evidence(body: EvidenceCreate, db: Session = Depends(get_db)):
    material = body.model_dump(mode="json", exclude={"signature"})
    evidence_sha = evidence_hash(material)
    if db.scalar(select(EvidenceCard).where(EvidenceCard.sha256 == evidence_sha)):
        raise HTTPException(409, "Evidence already exists")
    card = EvidenceCard(**body.model_dump(), certainty=Certainty(body.certainty), sha256=evidence_sha)
    db.add(card); db.flush()
    queue_event(db, "miseos.evidence.recorded", "evidence", str(card.id), {"id":str(card.id),"sha256":evidence_sha,"certainty":body.certainty})
    db.commit(); db.refresh(card); return card

@app.get("/evidence")
def evidence(db: Session = Depends(get_db)):
    return db.execute(select(EvidenceCard).order_by(EvidenceCard.created_at.desc()).limit(200)).scalars().all()

@app.post("/workflow-runs", status_code=201)
def create_workflow_run(body: WorkflowRunCreate, db: Session = Depends(get_db)):
    workflow = load_workflow()
    if body.workflow_id != workflow["id"] or body.workflow_version != workflow["version"]:
        raise HTTPException(404, "Workflow version not found")
    simulation = simulate(workflow, body.input_payload, body.simulation_tier)
    policy = evaluate_policies(simulation, body.input_payload)
    status = WorkflowRunStatus.simulated
    if policy["decision"] == "deny": status = WorkflowRunStatus.denied
    elif policy["decision"] == "require_approval": status = WorkflowRunStatus.approval_pending
    run = WorkflowRun(
        workflow_id=body.workflow_id, workflow_version=body.workflow_version,
        simulation_tier=body.simulation_tier, input_payload=body.input_payload,
        simulation_report=simulation, policy_result=policy, status=status,
        deterministic_sha256=digest({"workflow": workflow, "input": body.input_payload, "simulation": simulation, "policy": policy}),
    )
    db.add(run); db.flush()
    if status == WorkflowRunStatus.approval_pending:
        db.add(ApprovalRequest(workflow_run_id=run.id, requested_by="policy-engine", reason="Safe execution approval required"))
    queue_event(db, "miseos.workflow.simulated", "workflow_run", str(run.id), {"id": str(run.id), "status": status.value})
    db.commit(); db.refresh(run); return run

@app.get("/workflow-runs")
def workflow_runs(db: Session = Depends(get_db)):
    return db.execute(select(WorkflowRun).order_by(WorkflowRun.created_at.desc()).limit(200)).scalars().all()

@app.get("/workflow-runs/{run_id}")
def workflow_run(run_id: UUID, db: Session = Depends(get_db)):
    run = db.get(WorkflowRun, run_id)
    if not run: raise HTTPException(404, "Workflow run not found")
    return run

@app.post("/workflow-runs/{run_id}/execute")
def execute_workflow(run_id: UUID, db: Session = Depends(get_db)):
    run = db.get(WorkflowRun, run_id)
    if not run: raise HTTPException(404, "Workflow run not found")
    if run.policy_result.get("decision") == "deny": raise HTTPException(403, "Policy denied execution")
    if run.status == WorkflowRunStatus.approval_pending: raise HTTPException(409, "Approval is required")
    if run.status == WorkflowRunStatus.completed:
        return {"run": run, "idempotent_replay": True}
    workflow = load_workflow()
    executor = DeterministicExecutor(default_actions())
    run.status = WorkflowRunStatus.executing
    transcript = executor.run(workflow, run.input_payload)
    run.execution_transcript = transcript
    run.deterministic_sha256 = transcript["run_sha256"]
    run.status = WorkflowRunStatus.completed
    card = record_execution_evidence(db, run)
    queue_event(db, "miseos.workflow.completed", "workflow_run", str(run.id), {
        "id": str(run.id), "run_sha256": transcript["run_sha256"], "evidence_id": str(card.id)
    })
    db.commit(); db.refresh(run); db.refresh(card)
    return {"run": run, "evidence": card, "idempotent_replay": False}

@app.get("/approvals")
def approvals(db: Session = Depends(get_db)):
    return db.execute(select(ApprovalRequest).order_by(ApprovalRequest.created_at.desc()).limit(200)).scalars().all()

@app.post("/approvals/{approval_id}/decision")
def decide_approval(approval_id: UUID, body: ApprovalDecision, db: Session = Depends(get_db)):
    approval = db.get(ApprovalRequest, approval_id)
    if not approval: raise HTTPException(404, "Approval not found")
    if approval.status != ApprovalStatus.pending: raise HTTPException(409, "Approval already decided")
    run = db.get(WorkflowRun, approval.workflow_run_id)
    approval.status = ApprovalStatus.approved if body.approve else ApprovalStatus.rejected
    approval.decided_by = body.decided_by
    approval.reason = body.reason
    approval.decided_at = datetime.now(timezone.utc)
    approval.evidence_sha256 = digest({
        "approval_id": str(approval.id), "run_id": str(run.id), "approved": body.approve,
        "decided_by": body.decided_by, "reason": body.reason,
    })
    run.status = WorkflowRunStatus.approved if body.approve else WorkflowRunStatus.denied
    queue_event(db, "miseos.approval.decided", "approval", str(approval.id), {
        "id": str(approval.id), "approved": body.approve, "run_id": str(run.id), "sha256": approval.evidence_sha256
    })
    db.commit(); db.refresh(approval); return approval


@app.post("/knowledge-graph/rebuild")
def rebuild_graph(db: Session = Depends(get_db)):
    result=build_canonical_graph(db); seed_spatial_map(db)
    queue_event(db,"miseos.graph.rebuilt","knowledge_graph","canonical",result); db.commit(); return result

@app.get("/knowledge-graph/nodes")
def graph_nodes(node_type: str|None=None, limit:int=200, db:Session=Depends(get_db)):
    q=select(GraphNode)
    if node_type: q=q.where(GraphNode.node_type==node_type)
    return db.execute(q.order_by(GraphNode.node_type,GraphNode.label).limit(min(limit,1000))).scalars().all()

@app.get("/knowledge-graph/edges")
def graph_edges(relation: str|None=None, limit:int=500, db:Session=Depends(get_db)):
    q=select(GraphEdge)
    if relation: q=q.where(GraphEdge.relation==relation)
    return db.execute(q.order_by(GraphEdge.created_at).limit(min(limit,2000))).scalars().all()

@app.get("/semantic-search")
def semantic(query:str,node_type:str|None=None,limit:int=10,db:Session=Depends(get_db)):
    return semantic_search(db,query,node_type,min(limit,50))

@app.post("/memories",status_code=201)
def create_memory(body:MemoryCreate,db:Session=Depends(get_db)):
    rec=propose_memory(db,**body.model_dump()); queue_event(db,"miseos.memory.proposed","memory",str(rec.id),{"id":str(rec.id),"sha256":rec.content_sha256}); db.commit(); return rec

@app.get("/memories")
def memories(status:str|None=None,subject_id:str|None=None,db:Session=Depends(get_db)):
    q=select(MemoryRecord)
    if status: q=q.where(MemoryRecord.status==status)
    if subject_id: q=q.where(MemoryRecord.subject_id==subject_id)
    return db.execute(q.order_by(MemoryRecord.created_at.desc()).limit(500)).scalars().all()

@app.post("/memories/{memory_id}/approve")
def memory_approve(memory_id:UUID,db:Session=Depends(get_db)):
    rec=db.get(MemoryRecord,memory_id)
    if not rec: raise HTTPException(404,"Memory not found")
    result=approve_memory(db,rec); queue_event(db,"miseos.memory.approved","memory",str(rec.id),{"id":str(rec.id)}); db.commit(); return result

@app.post("/lineage",status_code=201)
def create_lineage(body:LineageCreate,db:Session=Depends(get_db)):
    row=record_lineage(db,**body.model_dump()); queue_event(db,"miseos.lineage.recorded","lineage",str(row.id),{"id":str(row.id),"sha256":row.lineage_sha256}); db.commit(); return row

@app.get("/lineage/{entity_type}/{entity_id}")
def get_lineage(entity_type:str,entity_id:str,db:Session=Depends(get_db)):
    return db.execute(select(LineageRecord).where(LineageRecord.entity_type==entity_type,LineageRecord.entity_id==entity_id).order_by(LineageRecord.created_at)).scalars().all()

@app.post("/performance/events",status_code=201)
def performance_event(body:PerformanceEventCreate,db:Session=Depends(get_db)):
    if body.metric not in {"reliability","quality","speed","safety","teamwork","learning"}: raise HTTPException(422,"Unsupported metric")
    if not db.get(CanonicalItem,body.agent_id): raise HTTPException(404,"Agent not found")
    row=AgentPerformanceEvent(**body.model_dump()); db.add(row); db.commit(); db.refresh(row)
    score=recompute_agent_score(db,body.agent_id); queue_event(db,"miseos.agent.performance.updated","agent",body.agent_id,{"composite":score.composite,"sample_size":score.sample_size}); db.commit()
    return {"event":row,"score":score}

@app.get("/performance/scores")
def performance_scores(department:str|None=None,db:Session=Depends(get_db)):
    q=select(AgentPerformanceScore,CanonicalItem).join(CanonicalItem,CanonicalItem.id==AgentPerformanceScore.agent_id)
    if department:q=q.where(CanonicalItem.department==department)
    rows=db.execute(q.order_by(AgentPerformanceScore.composite.desc(),CanonicalItem.name)).all()
    return [{"agent_id":s.agent_id,"name":a.name,"department":a.department,"role":a.role,"composite":s.composite,"reliability":s.reliability,"quality":s.quality,"speed":s.speed,"safety":s.safety,"teamwork":s.teamwork,"learning":s.learning,"sample_size":s.sample_size,"methodology_version":s.methodology_version} for s,a in rows]

@app.get("/world/map")
def world_map(db:Session=Depends(get_db)):
    return db.execute(select(SpatialNode).order_by(SpatialNode.zone,SpatialNode.y,SpatialNode.x)).scalars().all()

@app.post("/incidents",status_code=201)
def create_incident(body:IncidentCreate,db:Session=Depends(get_db)):
    row=Incident(**body.model_dump()); db.add(row); db.flush()
    tl=TimelineEvent(event_type="incident.created",aggregate_type="incident",aggregate_id=str(row.id),title=row.title,payload={"severity":row.severity,"status":row.status}); db.add(tl)
    queue_event(db,"miseos.incident.created","incident",str(row.id),{"id":str(row.id),"severity":row.severity}); db.commit(); db.refresh(row); return row

@app.get("/incidents")
def incidents(db:Session=Depends(get_db)):
    return db.execute(select(Incident).order_by(Incident.started_at.desc()).limit(500)).scalars().all()

@app.get("/timeline")
def timeline(aggregate_type:str|None=None,aggregate_id:str|None=None,db:Session=Depends(get_db)):
    q=select(TimelineEvent)
    if aggregate_type:q=q.where(TimelineEvent.aggregate_type==aggregate_type)
    if aggregate_id:q=q.where(TimelineEvent.aggregate_id==aggregate_id)
    return db.execute(q.order_by(TimelineEvent.occurred_at.desc()).limit(1000)).scalars().all()

@app.post("/marketplace/listings",status_code=201)
def create_listing(body:MarketplaceCreate,db:Session=Depends(get_db)):
    row=MarketplaceListing(**body.model_dump()); db.add(row); db.commit(); db.refresh(row); return row

@app.get("/marketplace/listings")
def listings(db:Session=Depends(get_db)):
    return db.execute(select(MarketplaceListing).order_by(MarketplaceListing.name)).scalars().all()

@app.post("/brigades",status_code=201)
def create_brigade(body:BrigadeCreate,db:Session=Depends(get_db)):
    missing=[a for a in body.agent_ids if not db.get(CanonicalItem,a)]
    if missing: raise HTTPException(422,{"missing_agents":missing})
    row=Brigade(customer_id=body.customer_id,name=body.name,purpose=body.purpose,configuration=body.configuration); db.add(row); db.flush()
    for i,agent_id in enumerate(body.agent_ids): db.add(BrigadeMember(brigade_id=row.id,agent_id=agent_id,role="member" if i else "lead",priority=(i+1)*10))
    queue_event(db,"miseos.brigade.created","brigade",str(row.id),{"id":str(row.id),"agent_count":len(body.agent_ids)}); db.commit(); db.refresh(row); return row

@app.get("/brigades")
def brigades(customer_id:str|None=None,db:Session=Depends(get_db)):
    q=select(Brigade)
    if customer_id:q=q.where(Brigade.customer_id==customer_id)
    rows=db.execute(q.order_by(Brigade.created_at.desc())).scalars().all()
    return [{"id":str(r.id),"customer_id":r.customer_id,"name":r.name,"purpose":r.purpose,"configuration":r.configuration,"members":db.scalar(select(func.count()).select_from(BrigadeMember).where(BrigadeMember.brigade_id==r.id))} for r in rows]
