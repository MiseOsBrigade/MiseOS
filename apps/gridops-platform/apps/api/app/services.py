import hashlib, json
from pathlib import Path
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from .models import CanonicalItem, RecordKind, OutboxEvent

def canonical_json(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)

def evidence_hash(payload: dict) -> str:
    return hashlib.sha256(canonical_json(payload).encode()).hexdigest()

def queue_event(db: Session, subject: str, aggregate_type: str, aggregate_id: str, payload: dict):
    db.add(OutboxEvent(subject=subject, aggregate_type=aggregate_type, aggregate_id=aggregate_id, payload=payload))

def import_canonical(db: Session, path: str) -> dict:
    doc = json.loads(Path(path).read_text())
    characters = doc.get("characters", [])
    registries = doc.get("registry_manifests", doc.get("registry", []))
    imported = 0
    for item, kind in [(x, RecordKind.character_card) for x in characters] + [(x, RecordKind.registry_manifest) for x in registries]:
        item_id = item.get("id") or item.get("registry_id")
        slug = item.get("slug") or item_id.replace(".", "-")
        existing = db.get(CanonicalItem, item_id)
        values = dict(number=item.get("number"), slug=slug, name=item.get("name", slug), record_kind=kind,
                      department=item.get("department"), role=item.get("agent_function") or item.get("job_name") or item.get("type"),
                      rarity=item.get("rarity"), provenance=item.get("record_origin") or item.get("provenance"), payload=item)
        if existing:
            for k,v in values.items(): setattr(existing,k,v)
        else:
            db.add(CanonicalItem(id=item_id, **values))
        imported += 1
    db.commit()
    counts = db.execute(select(CanonicalItem.record_kind, func.count()).group_by(CanonicalItem.record_kind)).all()
    return {"imported": imported, "counts": {k.value: v for k,v in counts}}
