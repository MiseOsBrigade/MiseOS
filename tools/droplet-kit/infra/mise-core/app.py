from __future__ import annotations
import json, os
from collections import Counter
from pathlib import Path
from typing import Any
from fastapi import FastAPI, HTTPException, Query

ROOT = Path(os.getenv("MISEOS_REPO_ROOT", "/srv/miseos-repo"))
CANDIDATES = (
    ROOT / "cards-catalog.json",
    ROOT / "data" / "cards-catalog.json",
    ROOT / "catalog" / "cards-catalog.json",
    ROOT / "public" / "cards-catalog.json",
)
app = FastAPI(title="MiseOS Character Intelligence Core", version="1.0.0")

def source() -> Path | None:
    return next((p for p in CANDIDATES if p.is_file()), None)

def records() -> tuple[Path, list[dict[str, Any]]]:
    path = source()
    if path is None:
        raise HTTPException(503, {"message":"Catalog not found","searched":[str(p) for p in CANDIDATES]})
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise HTTPException(500, f"Cannot read catalog: {exc}") from exc
    data = payload if isinstance(payload, list) else (
        payload.get("characters") or payload.get("records") or payload.get("items") or payload.get("cards")
        if isinstance(payload, dict) else None
    )
    if not isinstance(data, list):
        raise HTTPException(500, "Unsupported catalog shape")
    return path, [x for x in data if isinstance(x, dict)]

@app.get("/health")
def health():
    path = source()
    return {"status":"ok" if path else "degraded","service":"mise-core","catalog":str(path) if path else None}

@app.get("/v1/catalog/summary")
def summary():
    path, data = records()
    kinds = Counter(str(x.get("record_kind", "unknown")) for x in data)
    characters = kinds.get("character_card", 0) + kinds.get("character", 0)
    registry = kinds.get("registry_manifest", 0)
    ids = [x.get("card_id") or x.get("id") for x in data]
    duplicates = sorted(str(v) for v,c in Counter(v for v in ids if v).items() if c > 1)
    return {
        "source":str(path),"total_records":len(data),"character_records":characters,
        "registry_records":registry,"other_records":len(data)-characters-registry,
        "departments":dict(Counter(str(x.get("department","Unassigned")) for x in data)),
        "rarities":dict(Counter(str(x.get("rarity","Unassigned")) for x in data)),
        "duplicate_ids":duplicates,
    }

@app.get("/v1/catalog/characters")
def characters(q: str|None=Query(None,max_length=100), limit:int=Query(50,ge=1,le=200), offset:int=Query(0,ge=0)):
    path, data = records()
    data = [x for x in data if x.get("record_kind") in {"character","character_card",None}]
    if q:
        needle=q.casefold()
        data=[x for x in data if needle in " ".join(str(x.get(k,"")) for k in ("name","role","command","slug")).casefold()]
    return {"source":str(path),"total":len(data),"offset":offset,"limit":limit,"items":data[offset:offset+limit]}
