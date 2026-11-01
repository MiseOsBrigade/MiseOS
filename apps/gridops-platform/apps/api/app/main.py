import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from .db import Base, engine, get_db
from .config import settings
from .models import CanonicalItem, Repository, Task, EvidenceCard, Certainty, Workflow, WorkflowRun, RunStatus, Approval, ApprovalStatus, GraphEdge
from .schemas import RepositoryCreate, TaskCreate, EvidenceCreate, RunCreate, ApprovalDecision, GraphEdgeCreate
from .services import import_canonical, evidence_hash, queue_event
from .events import outbox_publisher
from .runtime import DeterministicWorkflowEngine

stop_event = asyncio.Event()

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    with next(get_db()) as db:
        if db.scalar(select(func.count()).select_from(CanonicalItem)) == 0:
            import_canonical(db, settings.canonical_data_path)
    task = asyncio.create_task(outbox_publisher(stop_event))
    yield
    stop_event.set(); await task

app = FastAPI(title="MiseOS GridOps Release 1", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
def health(db: Session = Depends(get_db)):
    return {"status":"ok", "canonical_items": db.scalar(select(func.count()).select_from(CanonicalItem))}

@app.post("/admin/import-canonical")
def import_data(db: Session = Depends(get_db)):
    return import_canonical(db, settings.canonical_data_path)

@app.get("/grid/summary")
def summary(db: Session = Depends(get_db)):
    kinds = db.execute(select(CanonicalItem.record_kind, func.count()).group_by(CanonicalItem.record_kind)).all()
    departments = db.execute(select(CanonicalItem.department, func.count()).where(CanonicalItem.department.is_not(None)).group_by(CanonicalItem.department).order_by(CanonicalItem.department)).all()
    return {"items": {k.value:v for k,v in kinds}, "departments": [{"name":k,"count":v} for k,v in departments],
            "repositories": db.scalar(select(func.count()).select_from(Repository)), "tasks": db.scalar(select(func.count()).select_from(Task)),
            "evidence": db.scalar(select(func.count()).select_from(EvidenceCard))}

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
    digest = evidence_hash(material)
    if db.scalar(select(EvidenceCard).where(EvidenceCard.sha256 == digest)):
        raise HTTPException(409, "Evidence already exists")
    card = EvidenceCard(**body.model_dump(), certainty=Certainty(body.certainty), sha256=digest)
    db.add(card); db.flush()
    queue_event(db, "miseos.evidence.recorded", "evidence", str(card.id), {"id":str(card.id),"sha256":digest,"certainty":body.certainty})
    db.commit(); db.refresh(card); return card

@app.get("/evidence")
def evidence(db: Session = Depends(get_db)):
    return db.execute(select(EvidenceCard).order_by(EvidenceCard.created_at.desc()).limit(200)).scalars().all()


engine_runtime = DeterministicWorkflowEngine()

@app.post("/runs", status_code=201)
def create_run(body: RunCreate, db: Session = Depends(get_db)):
    workflow = db.get(Workflow, (body.workflow_id, body.workflow_version))
    if workflow is None:
        raise HTTPException(404, "Workflow version not found")
    run = WorkflowRun(workflow_id=body.workflow_id, workflow_version=body.workflow_version,
                      task_id=body.task_id, requested_risk_tier=body.requested_risk_tier,
                      risk_tier=0, state={"input": body.input, "evidence": []})
    db.add(run); db.flush(); engine_runtime.start(db, run, workflow)
    db.commit(); db.refresh(run); return run

@app.post("/runs/{run_id}/advance")
def advance_run(run_id: str, db: Session = Depends(get_db)):
    run = db.get(WorkflowRun, run_id)
    if run is None: raise HTTPException(404, "Run not found")
    workflow = db.get(Workflow, (run.workflow_id, run.workflow_version))
    engine_runtime.advance(db, run, workflow); db.commit(); db.refresh(run); return run

@app.get("/runs")
def runs(db: Session = Depends(get_db)):
    return db.execute(select(WorkflowRun).order_by(WorkflowRun.created_at.desc()).limit(200)).scalars().all()

@app.post("/runs/{run_id}/approvals", status_code=201)
def request_approval(run_id: str, db: Session = Depends(get_db)):
    run = db.get(WorkflowRun, run_id)
    if run is None: raise HTTPException(404, "Run not found")
    approval = Approval(run_id=run.id, action="workflow.execute", requester="miseos.system",
        approvers=[{"role":"service_owner"},{"role":"security_reviewer"}], threshold="all",
        evidence_required=["simulation_pass","tests_pass","rollback_plan"])
    db.add(approval); db.commit(); db.refresh(approval); return approval

@app.post("/approvals/{approval_id}/decide")
def decide_approval(approval_id: str, body: ApprovalDecision, db: Session = Depends(get_db)):
    approval = db.get(Approval, approval_id)
    if approval is None: raise HTTPException(404, "Approval not found")
    decisions = [*approval.decisions, body.model_dump()]
    approval.decisions = decisions
    if body.decision == "reject": approval.status = ApprovalStatus.rejected
    else:
        required = {a["role"] for a in approval.approvers}
        approved = {d["approver_role"] for d in decisions if d["decision"] == "approve"}
        if required.issubset(approved):
            approval.status = ApprovalStatus.approved
            run = db.get(WorkflowRun, approval.run_id); run.status = RunStatus.running; run.risk_tier = run.requested_risk_tier
    db.commit(); db.refresh(approval); return approval

@app.post("/graph/edges", status_code=201)
def add_edge(body: GraphEdgeCreate, db: Session = Depends(get_db)):
    edge = GraphEdge(**body.model_dump()); db.add(edge); db.commit(); db.refresh(edge); return edge

@app.get("/graph/neighbors/{node_type}/{node_id}")
def neighbors(node_type: str, node_id: str, db: Session = Depends(get_db)):
    rows = db.execute(select(GraphEdge).where(
        ((GraphEdge.source_type == node_type) & (GraphEdge.source_id == node_id)) |
        ((GraphEdge.target_type == node_type) & (GraphEdge.target_id == node_id))
    )).scalars().all()
    return rows
