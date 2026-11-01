#!/usr/bin/env python3
"""Inventory reusable CI/CD and DevOps assets from a MiseOS source tree.

The scanner is deterministic and read-only. It produces JSON, CSV, and Markdown
catalogs, plus lightweight workflow hygiene findings. It does not execute any
repository code or network requests.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Iterable

import yaml

WORKFLOW_SUFFIXES = {".yml", ".yaml", ".md"}
SCRIPT_SUFFIXES = {".py", ".js", ".mjs", ".cjs", ".ts", ".sh"}
KEYWORDS = re.compile(
    r"(ci|cd|deploy|release|workflow|action|runner|security|secret|policy|sbom|attest|"
    r"provenance|dependabot|codeql|pages|package|container|docker|observab|otel|"
    r"validate|verify|governance|reliability|queue|sync|evidence)", re.I
)
ACTION_REF = re.compile(r"\buses:\s*['\"]?([^\s'\"]+)['\"]?")
CURRENT_MAJORS = {
    "actions/checkout": 7,
    "actions/setup-node": 7,
    "actions/setup-python": 6,
    "actions/upload-artifact": 7,
    "actions/configure-pages": 6,
    "actions/upload-pages-artifact": 5,
    "actions/deploy-pages": 5,
    "github/codeql-action/init": 4,
    "github/codeql-action/analyze": 4,
    "actions/attest": 4,
    "actions/dependency-review-action": 5,
    "docker/login-action": 4,
    "docker/metadata-action": 6,
    "docker/build-push-action": 7,
}


@dataclass
class Asset:
    path: str
    source_group: str
    kind: str
    size_bytes: int
    sha256: str
    reusable_score: int
    status: str = "candidate"
    name: str = ""
    triggers: list[str] = field(default_factory=list)
    action_refs: list[str] = field(default_factory=list)
    findings: list[str] = field(default_factory=list)


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def source_group(rel: Path) -> str:
    return rel.parts[0] if rel.parts else "root"


def classify(rel: Path) -> tuple[str | None, int]:
    s = rel.as_posix()
    name = rel.name
    if "/.github/workflows/" in f"/{s}" and rel.suffix.lower() in WORKFLOW_SUFFIXES:
        return ("agentic-workflow" if rel.suffix.lower() == ".md" else "github-workflow", 95)
    if name in {"action.yml", "action.yaml"} or "/.github/actions/" in f"/{s}":
        return "github-action", 95
    if name == "dependabot.yml" or name == "CODEOWNERS" or name == "SECURITY.md":
        return "governance-security", 90
    if name in {"Dockerfile", "docker-compose.yml", "docker-compose.yaml", "Makefile"}:
        return "container-infrastructure", 80
    if name == "devcontainer.json" or "/.devcontainer/" in f"/{s}":
        return "developer-environment", 85
    if name.endswith(".manifest.json") or name in {"registry-catalog.manifest.json", "registry-catalog.schema.json"}:
        return "registry-manifest", 90
    if name == "package.json":
        return "package-manifest", 75
    if rel.suffix.lower() in SCRIPT_SUFFIXES and KEYWORDS.search(name):
        return "automation-script", 80
    if KEYWORDS.search(name) and rel.suffix.lower() in {".md", ".json", ".yaml", ".yml"}:
        return "devops-documentation", 55
    return None, 0


def yaml_workflow_metadata(path: Path, text: str) -> tuple[str, list[str], list[str], list[str]]:
    findings: list[str] = []
    name = ""
    triggers: list[str] = []
    refs = ACTION_REF.findall(text)
    try:
        data = yaml.load(text, Loader=yaml.BaseLoader)
        if not isinstance(data, dict):
            raise ValueError("top level is not a mapping")
        name = str(data.get("name", ""))
        on = data.get("on")
        if isinstance(on, dict):
            triggers = sorted(str(k) for k in on.keys())
        elif isinstance(on, list):
            triggers = sorted(str(x) for x in on)
        elif isinstance(on, str):
            triggers = [on]
        if not name:
            findings.append("workflow-missing-name")
        if not triggers:
            findings.append("workflow-missing-trigger")
        if "permissions" not in data:
            findings.append("workflow-missing-explicit-permissions")
        if not isinstance(data.get("jobs"), dict) or not data.get("jobs"):
            findings.append("workflow-missing-jobs")
    except Exception as exc:
        findings.append(f"invalid-workflow-yaml:{type(exc).__name__}")
        return name, triggers, refs, findings

    if "pull_request_target:" in text:
        findings.append("review-pull_request_target-security")
    if re.search(r"permissions:\s*write-all", text):
        findings.append("permissions-write-all")
    if re.search(r"secrets:\s*inherit", text):
        findings.append("reusable-workflow-inherits-all-secrets")
    if "if-no-files-found:" in text:
        for m in re.finditer(r"if-no-files-found:\s*['\"]?([^\n'\"]+)", text):
            value = m.group(1).strip()
            if value not in {"warn", "error", "ignore"}:
                findings.append(f"invalid-upload-artifact-if-no-files-found:{value[:40]}")
    for ref in refs:
        if ref.startswith("./") or ref.startswith("$/") or ref.startswith("docker://"):
            continue
        if "@" not in ref:
            findings.append(f"action-ref-without-version:{ref}")
            continue
        action, version = ref.rsplit("@", 1)
        if re.fullmatch(r"[0-9a-fA-F]{40}", version):
            continue
        major_match = re.fullmatch(r"v(\d+)(?:\.\d+\.\d+)?", version)
        if not major_match:
            findings.append(f"floating-or-nonstandard-action-ref:{ref}")
            continue
        expected = CURRENT_MAJORS.get(action)
        if expected and int(major_match.group(1)) < expected:
            findings.append(f"action-major-behind-current-baseline:{ref}->v{expected}")
    return name, triggers, refs, findings


def iter_assets(root: Path) -> Iterable[Asset]:
    for path in sorted(p for p in root.rglob("*") if p.is_file()):
        rel = path.relative_to(root)
        kind, score = classify(rel)
        if not kind:
            continue
        asset = Asset(
            path=rel.as_posix(),
            source_group=source_group(rel),
            kind=kind,
            size_bytes=path.stat().st_size,
            sha256=sha256(path),
            reusable_score=score,
        )
        if kind == "github-workflow":
            try:
                text = path.read_text(encoding="utf-8")
                asset.name, asset.triggers, asset.action_refs, asset.findings = yaml_workflow_metadata(path, text)
                if any(f.startswith("invalid-workflow-yaml") or f in {"workflow-missing-name", "workflow-missing-trigger", "workflow-missing-jobs"} for f in asset.findings):
                    asset.status = "quarantine"
                    asset.reusable_score = 10
                elif asset.findings:
                    asset.status = "review"
            except UnicodeDecodeError:
                asset.findings.append("non-utf8-workflow")
                asset.status = "quarantine"
                asset.reusable_score = 5
        elif kind == "registry-manifest":
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
                asset.name = str(data.get("name") or data.get("registry_id") or "")
                status = data.get("status")
                if status in {"active", "experimental", "deprecated", "disabled"}:
                    asset.status = str(status)
            except Exception:
                asset.findings.append("invalid-json")
                asset.status = "quarantine"
        yield asset


def write_outputs(assets: list[Asset], out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    payload = {
        "schema_version": "1.0.0",
        "asset_count": len(assets),
        "assets": [asdict(a) for a in assets],
    }
    (out_dir / "devops-assets.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    fields = ["path", "source_group", "kind", "size_bytes", "sha256", "reusable_score", "status", "name", "triggers", "action_refs", "findings"]
    with (out_dir / "devops-assets.csv").open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for a in assets:
            row = asdict(a)
            for key in ("triggers", "action_refs", "findings"):
                row[key] = " | ".join(row[key])
            w.writerow(row)

    by_kind: dict[str, int] = {}
    by_status: dict[str, int] = {}
    findings: dict[str, int] = {}
    for a in assets:
        by_kind[a.kind] = by_kind.get(a.kind, 0) + 1
        by_status[a.status] = by_status.get(a.status, 0) + 1
        for item in a.findings:
            findings[item] = findings.get(item, 0) + 1

    lines = [
        "# MiseOS DevOps Harvest Catalog",
        "",
        f"Scanned assets: **{len(assets)}**",
        "",
        "## Asset classes",
        "",
        "| Kind | Count |",
        "|---|---:|",
    ]
    lines += [f"| `{k}` | {v} |" for k, v in sorted(by_kind.items())]
    lines += ["", "## Status", "", "| Status | Count |", "|---|---:|"]
    lines += [f"| `{k}` | {v} |" for k, v in sorted(by_status.items())]
    lines += ["", "## Workflow hygiene findings", ""]
    if findings:
        lines += ["| Finding | Count |", "|---|---:|"]
        lines += [f"| `{k}` | {v} |" for k, v in sorted(findings.items())]
    else:
        lines.append("No findings.")
    lines += ["", "## Highest-value candidates", "", "| Score | Kind | Status | Asset |", "|---:|---|---|---|"]
    for a in sorted(assets, key=lambda x: (-x.reusable_score, x.path))[:80]:
        lines.append(f"| {a.reusable_score} | `{a.kind}` | `{a.status}` | `{a.path}` |")
    (out_dir / "HARVEST_REPORT.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("root", type=Path)
    p.add_argument("--out", type=Path, default=Path("catalog"))
    args = p.parse_args()
    assets = list(iter_assets(args.root.resolve()))
    write_outputs(assets, args.out.resolve())
    print(f"Harvested {len(assets)} DevOps assets into {args.out}")


if __name__ == "__main__":
    main()
