#!/usr/bin/env python3
import json, subprocess
from pathlib import Path

def exists_any(names):
    return any(Path(n).exists() for n in names)

def run(cmd):
    print(f"::group::{cmd}")
    proc = subprocess.run(cmd, shell=True)
    print("::endgroup::")
    return {"command": cmd, "returncode": proc.returncode}

stacks = {
    "python": (["pyproject.toml", "requirements.txt", "setup.py"], [
        "python -m pip install --upgrade pip",
        "if [ -f requirements.txt ]; then pip install -r requirements.txt; fi",
        "if [ -f pyproject.toml ]; then pip install -e . || true; fi",
        "if [ -d tests ]; then python -m pytest -q; else echo 'No Python tests found'; fi",
    ]),
    "node": (["package.json"], [
        "if [ -f package-lock.json ]; then npm ci; else npm install; fi",
        "npm test --if-present",
        "npm run build --if-present",
    ]),
    "go": (["go.mod"], ["go test ./..."]),
    "rust": (["Cargo.toml"], ["cargo test --all"]),
    "java": (["pom.xml", "build.gradle", "build.gradle.kts"], [
        "if [ -f pom.xml ]; then mvn -q test; fi",
        "if [ -f gradlew ]; then ./gradlew test; elif [ -f build.gradle ] || [ -f build.gradle.kts ]; then gradle test; fi",
    ]),
}
results = []
failures = 0
for name, (detect, commands) in stacks.items():
    if not exists_any(detect):
        results.append({"stack": name, "detected": False, "commands": []})
        continue
    cmd_results = []
    for cmd in commands:
        res = run(cmd)
        cmd_results.append(res)
        if res["returncode"] != 0:
            failures += 1
            break
    results.append({"stack": name, "detected": True, "commands": cmd_results})

Path(".mise-evidence").mkdir(exist_ok=True)
Path(".mise-evidence/quality-results.json").write_text(json.dumps({"results": results, "failures": failures}, indent=2))
raise SystemExit(1 if failures else 0)
