# MiseOS Agentic GitHub Environment

This package implements a safe ChatGPT/OpenAI to GitHub agent bridge.

## Operating model

```text
Prompt / task
  -> Agent Bridge API
  -> OpenAI planner/reviewer
  -> GitHub App installation token
  -> guarded branch write
  -> pull request
  -> human review
```

## Production posture

```bash
AGENT_MODE=assisted
CREATE_PR_BY_DEFAULT=true
ALLOW_DIRECT_PUSH=false
REQUIRE_HUMAN_APPROVAL=true
DRY_RUN=false
```

## Safe launch posture

```bash
AGENT_MODE=advisory
CREATE_PR_BY_DEFAULT=true
ALLOW_DIRECT_PUSH=false
REQUIRE_HUMAN_APPROVAL=true
DRY_RUN=true
```

## Required secrets

- OPENAI_API_KEY
- GITHUB_APP_PRIVATE_KEY_B64
- GITHUB_WEBHOOK_SECRET
- INTERNAL_API_SECRET
- ADMIN_API_SECRET
- DATABASE_URL
- CLOUDFLARE_API_TOKEN, only if deploying to Cloudflare

## Required variables

- GITHUB_APP_ID
- GITHUB_APP_INSTALLATION_ID
- GITHUB_OWNER
- GITHUB_REPO
- GITHUB_DEFAULT_BRANCH
- AGENT_MODE
- CREATE_PR_BY_DEFAULT
- REQUIRE_HUMAN_APPROVAL

## MiseOS governance

The current deterministic gate uses:

- ECTI minimum score
- CSM minimum score
- STL maximum score
- KAQ minimum score

The production version should replace `src/governance.ts` with a fuller policy evaluator.
