#!/usr/bin/env python3
"""Validate vendored skill packs without executing them."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

RISK_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("curl_pipe_shell", re.compile(r"curl\s+[^\n|]+\|\s*(?:bash|sh)", re.IGNORECASE)),
    ("wget_pipe_shell", re.compile(r"wget\s+[^\n|]+\|\s*(?:bash|sh)", re.IGNORECASE)),
    ("chmod_777", re.compile(r"chmod\s+777", re.IGNORECASE)),
    ("secret_literal", re.compile(r"(?i)(api[_-]?key|secret|password|token)\s*=\s*['\"][^'\"]{12,}")),
)


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate vendored skills as inert metadata")
    parser.add_argument("--root", default="vendor/nv-skills")
    parser.add_argument("--out", default=".mise_out/skill-pack-validation.json")
    parser.add_argument("--strict", action="store_true", help="fail on high-risk patterns")
    args = parser.parse_args()

    root = Path(args.root)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    findings: list[dict[str, str]] = []
    skills = sorted(root.rglob("SKILL.md")) if root.exists() else []
    components = sorted((root / "components.d").glob("*.yml")) if (root / "components.d").exists() else []

    if not root.exists():
        findings.append({"severity": "error", "rule": "root_missing", "path": str(root)})
    if not skills:
        findings.append({"severity": "error", "rule": "no_skills", "path": str(root)})

    for path in sorted(root.rglob("*")) if root.exists() else []:
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".md", ".yml", ".yaml", ".sh", ".py", ".json"}:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for rule, regex in RISK_PATTERNS:
            if regex.search(text):
                findings.append({"severity": "warning", "rule": rule, "path": path.relative_to(root).as_posix()})

    payload = {
        "schema": "mise.skill-pack-validation.v1",
        "root": str(root),
        "skill_count": len(skills),
        "component_count": len(components),
        "finding_count": len(findings),
        "findings": findings,
    }
    out.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"skill_count": len(skills), "component_count": len(components), "finding_count": len(findings)}))

    has_error = any(item["severity"] == "error" for item in findings)
    has_warning = any(item["severity"] == "warning" for item in findings)
    return 1 if has_error or (args.strict and has_warning) else 0


if __name__ == "__main__":
    raise SystemExit(main())
