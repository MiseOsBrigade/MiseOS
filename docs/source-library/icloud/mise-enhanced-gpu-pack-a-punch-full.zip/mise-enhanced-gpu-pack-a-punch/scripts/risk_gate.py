#!/usr/bin/env python3
import argparse, json
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--context", default=".mise-evidence/context.json")
parser.add_argument("--allow-high-risk", action="store_true")
args = parser.parse_args()

context = json.loads(Path(args.context).read_text())
level = context.get("risk_level", "unknown")
if level == "high" and not args.allow_high_risk:
    print("Risk gate blocked this run.")
    print(json.dumps({
        "risk_score": context.get("risk_score"),
        "risk_level": level,
        "blocked_pattern_matches": context.get("blocked_pattern_matches", []),
        "secret_like_matches": context.get("secret_like_matches", []),
    }, indent=2))
    raise SystemExit(2)

print(f"Risk gate passed: {level}")
