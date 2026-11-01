#!/usr/bin/env python3
from __future__ import annotations

import fnmatch
import json
import os
import re
import subprocess
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any

ROOT = Path(os.environ.get("GITHUB_WORKSPACE", ".")).resolve()
POLICY_PATH = ROOT / ".github" / "mise" / "gpu-policy.json"
OUT_DIR = ROOT / "mise-evidence"
OUT_JSON = OUT_DIR / "mise-measurement.json"
OUT_MD = OUT_DIR / "mise-measurement.md"


@dataclass
class FileSignal:
    path: str
    exists: bool
    size_bytes: int
    categories: list[str]


@dataclass
class Measurement:
    repository: str
    event_name: str
    actor: str
    ref: str
    sha: str
    base_ref: str | None
    head_ref: str | None
    changed_files: list[str]
    file_signals: list[FileSignal]
    line_delta: int
    score: int
    risk_level: str
    gpu_recommended: bool
    review_required: bool
    blocked: bool
    reasons: list[str]
    detected_stack: list[str]


def run(cmd: list[str], *, check: bool = False) -> str:
    try:
        out = subprocess.run(
            cmd,
            cwd=ROOT,
            check=check,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        return out.stdout.strip()
    except Exception:
        return ""


def load_policy() -> dict[str, Any]:
    if POLICY_PATH.exists():
        return json.loads(POLICY_PATH.read_text(encoding="utf-8"))
    raise FileNotFoundError(f"Missing policy file: {POLICY_PATH}")


def get_changed_files() -> list[str]:
    base = os.environ.get("GITHUB_BASE_REF")
    candidates: list[list[str]] = []

    if base:
        run(["git", "fetch", "--no-tags", "--depth=50", "origin", base], check=False)
        candidates.append(["git", "diff", "--name-only", f"origin/{base}...HEAD"])

    candidates.append(["git", "diff", "--name-only", "HEAD~1...HEAD"])
    candidates.append(["git", "ls-files"])

    for cmd in candidates:
        output = run(cmd)
        files = [line.strip() for line in output.splitlines() if line.strip()]
        if files:
            return sorted(set(files))

    return []


def get_line_delta(files: list[str]) -> int:
    output = run(["git", "diff", "--numstat", "HEAD~1...HEAD"])
    total = 0
    for line in output.splitlines():
        parts = line.split("\t")
        if len(parts) >= 3:
            for value in parts[:2]:
                if value.isdigit():
                    total += int(value)
    if total == 0:
        total = len(files) * 20
    return total


def matches_any(path: str, patterns: list[str]) -> bool:
    normalized = path.replace("\\", "/")
    return any(fnmatch.fnmatch(normalized, pat) for pat in patterns)


def scan_text_for_blockers(path: Path, blocked_regex: list[str]) -> list[str]:
    if not path.exists() or not path.is_file():
        return []
    if path.stat().st_size > 1_000_000:
        return []
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return []
    hits: list[str] = []
    for pattern in blocked_regex:
        if re.search(pattern, text, flags=re.IGNORECASE):
            hits.append(pattern)
    return hits


def detect_stack() -> list[str]:
    stack: list[str] = []
    checks = {
        "python": ["pyproject.toml", "requirements.txt", "setup.py"],
        "node": ["package.json", "package-lock.json", "pnpm-lock.yaml", "yarn.lock"],
        "rust": ["Cargo.toml"],
        "go": ["go.mod"],
        "java": ["pom.xml", "build.gradle"],
        "cpp": ["CMakeLists.txt", "Makefile"],
        "docker": ["Dockerfile", "docker-compose.yml", "compose.yml"],
    }

    for name, files in checks.items():
        if any((ROOT / f).exists() for f in files):
            stack.append(name)

    for pat in ["**/*.cu", "**/*.cuh", "**/*cuda*", "**/*triton*"]:
        if list(ROOT.glob(pat)):
            stack.append("cuda")
            break

    return sorted(set(stack))


def score_files(policy: dict[str, Any], files: list[str]) -> tuple[int, list[FileSignal], list[str]]:
    weights = policy["complexity_weights"]
    patterns = policy["patterns"]
    blocked_regex = patterns.get("blocked_regex", [])
    score = 0
    reasons: list[str] = []
    signals: list[FileSignal] = []

    for f in files:
        p = ROOT / f
        categories: list[str] = []
        exists = p.exists()
        size = p.stat().st_size if exists and p.is_file() else 0

        score += weights["changed_file"]

        if size > 250_000:
            score += weights["large_file"]
            categories.append("large_file")

        if matches_any(f, patterns["workflow_files"]):
            score += weights["workflow_file"]
            categories.append("workflow_file")
            reasons.append(f"workflow-sensitive change: {f}")

        if matches_any(f, patterns["dependency_files"]):
            score += weights["dependency_manifest"]
            categories.append("dependency_manifest")
            reasons.append(f"dependency-sensitive change: {f}")

        if "lock" in Path(f).name.lower() or Path(f).name in {"go.sum", "Cargo.lock"}:
            score += weights["lockfile"]
            categories.append("lockfile")

        if matches_any(f, patterns["native_files"]):
            score += weights["native_code"]
            categories.append("native_code")

        if matches_any(f, patterns["gpu_files"]):
            score += weights["gpu_code"]
            categories.append("gpu_code")
            reasons.append(f"GPU-relevant file: {f}")

        if p.suffix in {".sh", ".bash", ".zsh", ".ps1", ".yml", ".yaml"}:
            score += weights["shell_or_script"]
            categories.append("shell_or_script")

        blockers = scan_text_for_blockers(p, blocked_regex)
        if blockers:
            categories.append("blocked_pattern")
            for b in blockers:
                score += weights["destructive_shell_pattern"]
                reasons.append(f"blocked pattern in {f}: {b}")

        signals.append(FileSignal(str(f), exists, size, sorted(set(categories))))

    return score, signals, reasons


def classify(score: int, policy: dict[str, Any], reasons: list[str], line_delta: int) -> tuple[str, bool, bool, bool, list[str], int]:
    weights = policy["complexity_weights"]
    thresholds = policy["thresholds"]
    total_score = score + (line_delta // 100) * weights["line_delta_per_100"]

    if line_delta >= 500:
        reasons.append(f"large line delta: {line_delta}")

    gpu_recommended = total_score >= thresholds["gpu_recommended"] or any("GPU-relevant file" in r for r in reasons)
    review_required = total_score >= thresholds["review_required"]
    blocked = total_score >= thresholds["block"] or any("blocked pattern" in r for r in reasons)

    if blocked:
        risk = "blocked"
    elif total_score >= thresholds["gpu_recommended"]:
        risk = "high"
    elif total_score >= thresholds["review_required"]:
        risk = "medium"
    else:
        risk = "low"

    return risk, gpu_recommended, review_required, blocked, sorted(set(reasons)), total_score


def write_outputs(m: Measurement) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(asdict(m), indent=2), encoding="utf-8")

    rows = "\n".join(
        f"| `{s.path}` | {', '.join(s.categories) or 'normal'} | {s.size_bytes} |"
        for s in m.file_signals[:80]
    )
    if not rows:
        rows = "| _none_ | _none_ | 0 |"

    reasons = "\n".join(f"- {r}" for r in m.reasons) or "- No elevated risk features detected."
    stack = ", ".join(m.detected_stack) or "unknown"

    md = f"""# Mise Measurement Evidence

| Field | Value |
|---|---|
| Repository | `{m.repository}` |
| Event | `{m.event_name}` |
| Actor | `{m.actor}` |
| Ref | `{m.ref}` |
| SHA | `{m.sha}` |
| Score | `{m.score}` |
| Risk | `{m.risk_level}` |
| GPU recommended | `{m.gpu_recommended}` |
| Review required | `{m.review_required}` |
| Blocked | `{m.blocked}` |
| Detected stack | `{stack}` |
| Line delta | `{m.line_delta}` |

## Reasons

{reasons}

## Changed file signals

| File | Categories | Size bytes |
|---|---:|---:|
{rows}
"""
    OUT_MD.write_text(md, encoding="utf-8")


def github_output(m: Measurement) -> None:
    out = os.environ.get("GITHUB_OUTPUT")
    if not out:
        return
    with open(out, "a", encoding="utf-8") as fh:
        fh.write(f"score={m.score}\n")
        fh.write(f"risk_level={m.risk_level}\n")
        fh.write(f"gpu_recommended={str(m.gpu_recommended).lower()}\n")
        fh.write(f"review_required={str(m.review_required).lower()}\n")
        fh.write(f"blocked={str(m.blocked).lower()}\n")
        fh.write(f"detected_stack={','.join(m.detected_stack)}\n")
        fh.write(f"evidence_json={OUT_JSON}\n")
        fh.write(f"evidence_md={OUT_MD}\n")


def main() -> int:
    policy = load_policy()
    files = get_changed_files()
    line_delta = get_line_delta(files)
    base_score, signals, reasons = score_files(policy, files)
    risk, gpu_recommended, review_required, blocked, reasons, total_score = classify(base_score, policy, reasons, line_delta)

    m = Measurement(
        repository=os.environ.get("GITHUB_REPOSITORY", "local"),
        event_name=os.environ.get("GITHUB_EVENT_NAME", "local"),
        actor=os.environ.get("GITHUB_ACTOR", "local"),
        ref=os.environ.get("GITHUB_REF", ""),
        sha=os.environ.get("GITHUB_SHA", run(["git", "rev-parse", "HEAD"])),
        base_ref=os.environ.get("GITHUB_BASE_REF") or None,
        head_ref=os.environ.get("GITHUB_HEAD_REF") or None,
        changed_files=files,
        file_signals=signals,
        line_delta=line_delta,
        score=total_score,
        risk_level=risk,
        gpu_recommended=gpu_recommended,
        review_required=review_required,
        blocked=blocked,
        reasons=reasons,
        detected_stack=detect_stack(),
    )

    write_outputs(m)
    github_output(m)

    print(json.dumps(asdict(m), indent=2))
    return 2 if blocked else 0


if __name__ == "__main__":
    raise SystemExit(main())
