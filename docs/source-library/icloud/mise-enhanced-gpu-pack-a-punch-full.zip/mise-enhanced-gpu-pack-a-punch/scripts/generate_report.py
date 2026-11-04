#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path

def read_json(path, default):
    p = Path(path)
    return json.loads(p.read_text()) if p.exists() else default

context = read_json(".mise-evidence/context.json", {})
quality = read_json(".mise-evidence/quality-results.json", {"results": [], "failures": None})

lines = [
    "# Mise Enhanced GPU Pack-a-Punch Evidence Report",
    "",
    f"Generated: {datetime.now(timezone.utc).isoformat()}",
    "",
    "## Risk",
    "",
    f"- Level: `{context.get('risk_level', 'unknown')}`",
    f"- Score: `{context.get('risk_score', 'unknown')}`",
    f"- Changed files: `{len(context.get('changed_files', []))}`",
    f"- Changed lines: `{context.get('changed_line_count', 'unknown')}`",
    "",
    "## Signals",
    "",
]
for key in ["workflow", "dependency", "script", "native_or_gpu", "docker"]:
    lines.append(f"- {key}: `{len(context.get('categories', {}).get(key, []))}`")
lines += [
    "",
    "## Pattern matches",
    "",
    f"- Blocked pattern matches: `{len(context.get('blocked_pattern_matches', []))}`",
    f"- Secret-like matches: `{len(context.get('secret_like_matches', []))}`",
    "",
    "## Quality stack",
    "",
    f"- Failures: `{quality.get('failures')}`",
]
for item in quality.get("results", []):
    lines.append(f"- {item.get('stack')}: detected=`{item.get('detected')}`")
lines += ["", "## Changed files", ""]
for name in context.get("changed_files", []):
    lines.append(f"- `{name}`")

Path(".mise-evidence").mkdir(exist_ok=True)
Path(".mise-evidence/evidence-report.md").write_text("\n".join(lines) + "\n")
print(".mise-evidence/evidence-report.md")
