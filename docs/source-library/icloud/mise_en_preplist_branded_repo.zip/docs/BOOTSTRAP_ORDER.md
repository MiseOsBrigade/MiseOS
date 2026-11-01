# Bootstrap Order

This repo is intentionally staged so GitHub can expand it safely.

## Phase 1 — Basic GitHub setup

Commit these files first:

```text
README.md
.github/workflows/bootstrap-unzip.yml
.github/workflows/ci.yml
scripts/safe_unzip.py
bootstrap/payload.zip
bootstrap/payload-manifest.txt
```

## Phase 2 — Bootstrap workflow

The workflow performs this sequence:

```text
01 checkout repository
02 stop if .bootstrap/BOOTSTRAPPED exists and force is false
03 verify bootstrap/payload.zip exists
04 list zip contents
05 safely extract payload
06 write .bootstrap/BOOTSTRAPPED
07 install dependencies when package.json exists
08 run tests when a test script exists
09 commit expanded files
10 push expanded repository
```

## Phase 3 — Normal repo operation

After bootstrap, the repo behaves like a normal project:

```text
pull request → CI → npm install/npm ci → npm test
push to main → CI → npm install/npm ci → npm test
```

## Why CI may not auto-run from the bootstrap commit

GitHub prevents recursive workflow loops. A commit pushed by a workflow using `GITHUB_TOKEN` usually does not trigger another workflow run. That is why the bootstrap workflow runs the project tests before it commits the expanded files.
