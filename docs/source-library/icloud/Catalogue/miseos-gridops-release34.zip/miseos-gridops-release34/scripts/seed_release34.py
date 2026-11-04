
from apps.api.app.db import Base,engine,SessionLocal
from apps.api.app.intelligence import build_canonical_graph,seed_spatial_map,recompute_agent_score
from apps.api.app.models import CanonicalItem,AgentPerformanceEvent
from sqlalchemy import select
Base.metadata.create_all(engine)
with SessionLocal() as db:
 print(build_canonical_graph(db));print(seed_spatial_map(db))
 agents=db.execute(select(CanonicalItem).where(CanonicalItem.record_kind=='character_card').order_by(CanonicalItem.number).limit(12)).scalars().all()
 for a in agents:
  for metric,value in [('reliability',82),('quality',80),('speed',76),('safety',88),('teamwork',84),('learning',78)]:
   db.add(AgentPerformanceEvent(agent_id=a.id,metric=metric,value=value,weight=100,context={'seed':'release34'}))
  db.commit();recompute_agent_score(db,a.id)
