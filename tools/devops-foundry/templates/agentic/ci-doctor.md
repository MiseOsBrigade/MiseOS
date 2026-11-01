---
on:
  workflow_dispatch:
permissions:
  contents: read
  actions: read
  issues: read
  copilot-requests: write
network: defaults
tools:
  github:
    toolsets: [actions, issues]
safe-outputs:
  create-issue:
engine: copilot
---

# MiseOS CI Doctor

Inspect the most recent failed CI workflow run in this repository. Correlate failed jobs and logs, separate primary failures from follow-on failures, and identify the smallest likely remediation.

Create an issue only when the failure is reproducible or actionable. Include the failing workflow/job, relevant error excerpts in paraphrase, likely root cause, confidence level, and a bounded remediation checklist. Never expose secrets or tokens from logs.
