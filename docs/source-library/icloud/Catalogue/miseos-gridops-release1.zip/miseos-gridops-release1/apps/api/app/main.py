import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from .db import Base, engine, get_db
from .config import settings
from .models import CanonicalItem, Repository, Task, EvidenceCard, Certainty
from .schemas import RepositoryCreate, TaskCreate, EvidenceCreate
from .services import import_canonical, evidence_hash, queue_event
from .events import outbox_publisher

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
