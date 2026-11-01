
import hashlib, json, math, re
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from .models import (CanonicalItem, Workflow, GraphNode, GraphEdge, MemoryRecord, MemoryStatus,
 LineageRecord, AgentPerformanceEvent, AgentPerformanceScore, SpatialNode)

def canonical_json(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)

def sha(value):
    return hashlib.sha256(canonical_json(value).encode()).hexdigest()

def hash_embedding(text: str, dimensions: int = 96) -> list[float]:
    """Deterministic local embedding. Replace with provider embeddings without changing storage API."""
    vec=[0.0]*dimensions
    tokens=re.findall(r"[a-z0-9_\-]+", text.lower())
    for token in tokens:
        h=hashlib.sha256(token.encode()).digest()
        idx=int.from_bytes(h[:4], 'big') % dimensions
        sign=1.0 if h[4] & 1 else -1.0
        vec[idx]+=sign*(1.0 + h[5]/255.0)
    norm=math.sqrt(sum(v*v for v in vec)) or 1.0
    return [round(v/norm, 8) for v in vec]

def cosine(a,b):
    if not a or not b: return 0.0
    return sum(x*y for x,y in zip(a,b)) / ((math.sqrt(sum(x*x for x in a)) or 1)*(math.sqrt(sum(y*y for y in b)) or 1))

def upsert_node(db: Session, node_type, external_id, label, properties):
    content={"type":node_type,"external_id":external_id,"label":label,"properties":properties}
    digest=sha(content); text=f"{label} {canonical_json(properties)}"
    node=db.scalar(select(GraphNode).where(GraphNode.node_type==node_type, GraphNode.external_id==external_id))
    if not node:
        node=GraphNode(node_type=node_type, external_id=external_id, label=label, properties=properties,
                       embedding=hash_embedding(text), content_sha256=digest)
        db.add(node); db.flush()
    elif node.content_sha256 != digest:
        node.label=label; node.properties=properties; node.embedding=hash_embedding(text); node.content_sha256=digest
    return node

def build_canonical_graph(db: Session):
    nodes={}
    items=db.execute(select(CanonicalItem).order_by(CanonicalItem.id)).scalars().all()
    for item in items:
        props={"department":item.department,"role":item.role,"rarity":item.rarity,"record_kind":item.record_kind.value}
        nodes[item.id]=upsert_node(db, "canonical_item", item.id, item.name, props)
        if item.department:
            d=upsert_node(db,"department",item.department.lower().replace(' ','-'),item.department,{})
            edge=db.scalar(select(GraphEdge).where(GraphEdge.source_id==nodes[item.id].id,GraphEdge.relation=="MEMBER_OF",GraphEdge.target_id==d.id))
            if not edge: db.add(GraphEdge(source_id=nodes[item.id].id, relation="MEMBER_OF", target_id=d.id))
        wf=(item.payload or {}).get("workflow",{})
        for target_name in wf.get("synced_agents",[]):
            target=next((x for x in items if x.name==target_name),None)
            if target:
                t=nodes.get(target.id) or upsert_node(db,"canonical_item",target.id,target.name,{"department":target.department,"role":target.role})
                if not db.scalar(select(GraphEdge).where(GraphEdge.source_id==nodes[item.id].id,GraphEdge.relation=="HANDS_OFF_TO",GraphEdge.target_id==t.id)):
                    db.add(GraphEdge(source_id=nodes[item.id].id,relation="HANDS_OFF_TO",target_id=t.id))
    db.commit()
    return {"nodes":db.scalar(select(func.count()).select_from(GraphNode)),"edges":db.scalar(select(func.count()).select_from(GraphEdge))}

def semantic_search(db: Session, query: str, node_type: str|None=None, limit: int=10):
    qvec=hash_embedding(query)
    stmt=select(GraphNode)
    if node_type: stmt=stmt.where(GraphNode.node_type==node_type)
    rows=db.execute(stmt).scalars().all()
    ranked=sorted(((cosine(qvec,r.embedding),r) for r in rows), key=lambda x:(-x[0],x[1].external_id))[:limit]
    return [{"score":round(score,6),"id":str(r.id),"type":r.node_type,"external_id":r.external_id,"label":r.label,"properties":r.properties} for score,r in ranked]

def propose_memory(db: Session, scope, subject_id, memory_type, content, sensitivity="internal", retention_days=365, evidence_id=None):
    material={"scope":scope,"subject_id":subject_id,"memory_type":memory_type,"content":content,"evidence_id":str(evidence_id) if evidence_id else None}
    digest=sha(material)
    existing=db.scalar(select(MemoryRecord).where(MemoryRecord.content_sha256==digest))
    if existing: return existing
    rec=MemoryRecord(scope=scope,subject_id=subject_id,memory_type=memory_type,content=content,sensitivity=sensitivity,
                     retention_days=retention_days,source_evidence_id=evidence_id,content_sha256=digest,
                     embedding=hash_embedding(canonical_json(content)),expires_at=datetime.now(timezone.utc)+timedelta(days=retention_days))
    db.add(rec); db.commit(); db.refresh(rec); return rec

def approve_memory(db: Session, rec: MemoryRecord):
    if rec.status != MemoryStatus.proposed: return rec
    rec.status=MemoryStatus.approved; rec.approved_at=datetime.now(timezone.utc); db.commit(); db.refresh(rec); return rec

def record_lineage(db: Session, entity_type, entity_id, parent_type, parent_id, relation="derived_from", transformation=None, evidence_id=None):
    material={"entity_type":entity_type,"entity_id":entity_id,"parent_type":parent_type,"parent_id":parent_id,"relation":relation,"transformation":transformation or {},"evidence_id":str(evidence_id) if evidence_id else None}
    digest=sha(material)
    existing=db.scalar(select(LineageRecord).where(LineageRecord.lineage_sha256==digest))
    if existing: return existing
    row=LineageRecord(**{k:v for k,v in material.items() if k!="evidence_id"},evidence_id=evidence_id,lineage_sha256=digest)
    db.add(row); db.commit(); db.refresh(row); return row

METRICS=("reliability","quality","speed","safety","teamwork","learning")
def recompute_agent_score(db: Session, agent_id: str):
    events=db.execute(select(AgentPerformanceEvent).where(AgentPerformanceEvent.agent_id==agent_id)).scalars().all()
    buckets=defaultdict(list)
    for e in events:
        buckets[e.metric].append((e.value,e.weight))
    values={}
    for m in METRICS:
        vals=buckets[m]
        values[m]=round(sum(v*w for v,w in vals)/sum(w for _,w in vals)) if vals else 0
    # Safety and reliability receive higher weight. Scores are evidence-backed, not card lore stats.
    composite=round(values["reliability"]*.24+values["quality"]*.20+values["speed"]*.12+values["safety"]*.24+values["teamwork"]*.12+values["learning"]*.08)
    row=db.get(AgentPerformanceScore,agent_id)
    if not row: row=AgentPerformanceScore(agent_id=agent_id); db.add(row)
    for k,v in values.items(): setattr(row,k,v)
    row.composite=composite; row.sample_size=len(events); row.methodology_version="miseos.performance.v1"
    db.commit(); db.refresh(row); return row

def seed_spatial_map(db: Session):
    zones={"Pipeline Kitchen":(0,0),"Platform Kitchen":(100,0),"Reliability Kitchen":(200,0),"Security Kitchen":(0,100),"Data & Insight Kitchen":(100,100),"Operations Kitchen":(200,100)}
    items=db.execute(select(CanonicalItem).where(CanonicalItem.record_kind=="character_card").order_by(CanonicalItem.number)).scalars().all()
    counts=defaultdict(int)
    for item in items:
        base=zones.get(item.department,(300,100)); i=counts[item.department]; counts[item.department]+=1
        row=db.scalar(select(SpatialNode).where(SpatialNode.object_type=="agent",SpatialNode.object_id==item.id))
        if not row:
            db.add(SpatialNode(object_type="agent",object_id=item.id,zone=item.department or "Unassigned",x=base[0]+(i%8)*10,y=base[1]+(i//8)*10,z=0,status="ready",metadata_json={"name":item.name,"role":item.role,"rarity":item.rarity}))
    db.commit(); return {"spatial_nodes":db.scalar(select(func.count()).select_from(SpatialNode))}
