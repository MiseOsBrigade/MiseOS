#!/usr/bin/env python3
"""Validate vendored skill packs as inert metadata."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

RISK_PATTERNS = (
    ("curl_pipe_shell", re.compile(r"curl\s+[^\n|]+\|\s*(?:bash|sh)", re.IGNORECASE)),
    ("wget_pipe_shell", re.compile(r"wget\s+[^\n|]+\|\s*(?:bash|sh)", re.IGNORECASE)),
    ("chmod_777", re.compile(r"chmod\s+777", re.IGNORECASE)),
    ("secret_literal", re.compile(r"(?i)(api[_-]?key|secret|password|token)\s*=\s*['\"][^'\"]{12,}")),
)


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate vendored skills without executing them")
    parser.add_argument("--root", default="vendor/nv-skills")
    parser.add_argument("--out", default=".mise_out/skill-pack-validation.json")
    parser.add_argument("--strict", action="store_true", help="fail on warning findings")
    args = parser.parse_args()

    root = Path(args.root)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    findings = []
    skills = sorted(root.rglob("SKILL.md")) if root.exists() else []
    components = sorted((root / "components.d").glob("*.yml")) if (root / "components.d").exists() else []

    if not root.exists():
        findings.append({"severity": "error", "rule": "root_missing", "message": f"skill pack root not found: {root}"})

    # "no_skills" is informational for empty vendor state — not a hard error
    # when the root exists; the indexer will produce a warning artifact instead.
    if root.exists() and not skills:
        findings.append({"severity": "info", "rule": "no_skills",
                          "message": "no SKILL.md files found; populate vendor/nv-skills/ via apply-upgrade.sh"})

    for path in sorted(root.rglob("*")) if root.exists() else []:
        if not path.is_file() or path.suffix.lower() not in {".md", ".yml", ".yaml", ".sh", ".py", ".json"}:
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
    has_info = any(item["severity"] == "info" for item in findings)
    print(json.dumps({"skill_count": len(skills), "component_count": len(components),
                      "finding_count": len(findings),
                      "has_errors": has_error, "has_warnings": has_warning, "has_info": has_info}))

    if has_error:
        return 1
    if args.strict and has_warning:
        return 1
    # Info-level findings (empty vendor state) do not affect exit code
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
