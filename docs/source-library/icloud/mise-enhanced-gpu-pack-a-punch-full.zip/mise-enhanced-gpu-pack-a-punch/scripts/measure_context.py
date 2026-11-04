#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, re, subprocess
from pathlib import Path
from typing import Any

def run(cmd: list[str]) -> str:
    proc = subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return proc.stdout.strip() if proc.returncode == 0 else ""

def changed_files(base: str, head: str) -> list[str]:
    return [x for x in run(["git", "diff", "--name-only", base, head]).splitlines() if x.strip()]

def diff_text(base: str, head: str) -> str:
    return run(["git", "diff", "--unified=0", base, head])

def changed_line_count(base: str, head: str) -> int:
    total = 0
    for line in run(["git", "diff", "--numstat", base, head]).splitlines():
        parts = line.split("\t")
        if len(parts) >= 2:
            total += (int(parts[0]) if parts[0].isdigit() else 0) + (int(parts[1]) if parts[1].isdigit() else 0)
    return total

def classify(files: list[str]) -> dict[str, list[str]]:
    cats = {k: [] for k in ["workflow", "dependency", "script", "native_or_gpu", "docker"]}
    dep = {"package.json","package-lock.json","pnpm-lock.yaml","yarn.lock","requirements.txt","pyproject.toml","poetry.lock","go.mod","go.sum","Cargo.toml","Cargo.lock","pom.xml","build.gradle","build.gradle.kts"}
    for name in files:
        p = Path(name)
        suffix = p.suffix.lower()
        if name.startswith(".github/workflows/"):
            cats["workflow"].append(name)
        if p.name in dep:
            cats["dependency"].append(name)
        if suffix in {".sh",".bash",".ps1",".py",".js",".ts"} or name.startswith("scripts/"):
            cats["script"].append(name)
        if suffix in {".cu",".cuh",".cpp",".cc",".c",".h",".hpp",".rs"} or "cuda" in name.lower() or "gpu" in name.lower():
            cats["native_or_gpu"].append(name)
        if p.name == "Dockerfile" or name.startswith("docker/") or p.name.startswith("docker-compose"):
            cats["docker"].append(name)
    return cats

def matches(patterns: list[str], text: str) -> list[str]:
    return [pat for pat in patterns if re.search(pat, text, flags=re.IGNORECASE | re.MULTILINE)]

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", required=True)
    parser.add_argument("--head", required=True)
    parser.add_argument("--policy", default=".github/mise/mise-policy.json")
    parser.add_argument("--out", default=".mise-evidence/context.json")
    args = parser.parse_args()

    policy: dict[str, Any] = json.loads(Path(args.policy).read_text())
    files = changed_files(args.base, args.head)
    lines = changed_line_count(args.base, args.head)
    patch = diff_text(args.base, args.head)
    cats = classify(files)
    risk = policy["risk"]
    w = risk["weights"]
    secret_hits = matches(risk.get("secret_like_patterns", []), patch)
    blocked_hits = matches(risk.get("blocked_patterns", []), patch)

    score = (
        len(files) * w["changed_file"]
        + (lines // 50) * w["changed_line_bucket"]
        + len(cats["workflow"]) * w["workflow_file"]
        + len(cats["dependency"]) * w["dependency_file"]
        + len(cats["script"]) * w["script_file"]
        + len(cats["native_or_gpu"]) * w["native_or_gpu_file"]
        + len(cats["docker"]) * w["docker_file"]
        + len(secret_hits) * w["secret_like_pattern"]
        + len(blocked_hits) * w["destructive_pattern"]
    )
    level = "high" if score >= risk["high_threshold"] else "medium" if score >= risk["medium_threshold"] else "low"
    result = {
        "base": args.base,
        "head": args.head,
        "changed_files": files,
        "changed_line_count": lines,
        "categories": cats,
        "secret_like_matches": secret_hits,
        "blocked_pattern_matches": blocked_hits,
        "risk_score": score,
        "risk_level": level,
    }
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(result, indent=2))
    print(json.dumps(result, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
