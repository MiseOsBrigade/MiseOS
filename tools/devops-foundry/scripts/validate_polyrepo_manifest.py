#!/usr/bin/env python3
from __future__ import annotations
import argparse, re, sys
from pathlib import Path
import yaml

SEMVER = re.compile(r"^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$")
SHA = re.compile(r"^(?:[0-9a-f]{40}|[0-9a-f]{64})$", re.I)
REPO = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")

p = argparse.ArgumentParser()
p.add_argument("manifest", type=Path)
p.add_argument("--allow-prerelease", action="store_true")
args = p.parse_args()
data = yaml.safe_load(args.manifest.read_text(encoding="utf-8"))
errors=[]
components = data.get("components") if isinstance(data, dict) else None
if not isinstance(components, dict) or not components:
    errors.append("components must be a non-empty mapping")
else:
    for name, item in components.items():
        if not isinstance(item, dict):
            errors.append(f"{name}: component must be a mapping"); continue
        repo=str(item.get("repo", "")); ref=str(item.get("ref", ""))
        if not REPO.fullmatch(repo): errors.append(f"{name}: invalid owner/repo: {repo}")
        immutable = bool(SHA.fullmatch(ref) or SEMVER.fullmatch(ref))
        if not immutable: errors.append(f"{name}: ref must be a commit SHA or semantic-version tag, got {ref!r}")
        if not args.allow_prerelease and '-' in ref and SEMVER.fullmatch(ref):
            errors.append(f"{name}: prerelease ref is not allowed for production manifest: {ref}")
if errors:
    for e in errors: print(f"ERROR: {e}", file=sys.stderr)
    raise SystemExit(1)
print(f"Validated {len(components)} immutable component references.")
