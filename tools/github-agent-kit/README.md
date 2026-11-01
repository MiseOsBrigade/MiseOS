# MiseOS GitHub Agent Kit

A safe agentic environment for ChatGPT/OpenAI to GitHub automation.

## What it does

- Accepts agent tasks through `/agent/plan` and `/agent/run`
- Uses a GitHub App instead of a permanent PAT
- Creates guarded branches and pull requests
- Blocks dangerous paths and direct-push behavior
- Includes MiseOS governance gates: ECTI, CSM, STL, KAQ
- Starts in dry-run mode by default

## Install

```bash
npm install
cp .env.example .env
npm run dev
```

## Health check

```bash
curl http://localhost:8787/health
```

## Plan a repo change

```bash
curl -X POST http://localhost:8787/agent/plan \
  -H "Authorization: Bearer $INTERNAL_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"task":"Add docs for the MiseOS agentic GitHub environment."}'
```

## Run a guarded PR task

```bash
curl -X POST http://localhost:8787/agent/run \
  -H "Authorization: Bearer $INTERNAL_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Add agentic GitHub workflow docs",
    "title": "[MiseOS Agent] Add agentic workflow docs",
    "files": [
      {
        "path": "docs/agentic-github-workflow.md",
        "content": "# Agentic GitHub Workflow\n\nSafe branch-first automation.\n"
      }
    ]
  }'
```

## Signature

Every agent has a role. Every role has purpose. Every repo deserves stewardship.
