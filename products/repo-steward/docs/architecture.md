# Architecture

MiseOS Repo Steward separates model recommendations from policy-controlled execution.

```mermaid
flowchart TD
  U[Developer / Operator] --> C[CLI, API, Dashboard]
  C --> O[Orchestration Control Plane]
  O --> P[Policy and Risk Engine]
  O --> M[Model Gateway]
  O --> R[Repository Intelligence]
  P -->|Tier 1| E[Execute]
  P -->|Tier 2| PR[Open Pull Request]
  P -->|Tier 3| H[Human Approval]
  E --> A[Audit Ledger]
  PR --> A
  H --> A
```

Recommended hosted stack: Next.js, TypeScript or FastAPI, PostgreSQL, Vault, OpenTelemetry, Docker, Kubernetes, and a GitHub App. The open-core package remains provider-neutral.
