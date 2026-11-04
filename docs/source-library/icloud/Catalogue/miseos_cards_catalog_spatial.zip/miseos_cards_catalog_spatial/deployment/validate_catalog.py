#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, sys
root=Path(__file__).resolve().parents[1]
metas=sorted((root/"metadata").glob("*.json"))
registry=json.loads((root/"registry/registry-manifests.json").read_text())
errors=[]
if len(metas)!=112: errors.append(f"Expected 112 metadata files, found {len(metas)}")
if len(registry)!=23: errors.append(f"Expected 23 registry manifests, found {len(registry)}")
for p in metas:
    m=json.loads(p.read_text())
    if m["identity"]["record_kind"]!="character_card": errors.append(f"{p.name}: invalid record kind")
    if not (root/m["image"]).exists(): errors.append(f"{p.name}: missing image {m['image']}")
    if len(m["stats"])!=6: errors.append(f"{p.name}: expected six stats")
    if not m["workflow"].get("proof_gate"): errors.append(f"{p.name}: missing proof gate")
print("PASS" if not errors else "FAIL", {"characters":len(metas),"registry":len(registry),"errors":len(errors)})
for e in errors: print("-",e)
sys.exit(1 if errors else 0)
