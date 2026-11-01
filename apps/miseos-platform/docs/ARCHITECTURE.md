# MiseOS GridOps Architecture

## Product boundary

GridOps is a repository operations control plane. The static playground demonstrates the interaction model; production execution must run through scoped identities, permission checks, validation runners, and immutable evidence records.

## System layers

### 1. Experience layer

- Grid view for linked operational records
- Graph view for dependencies and workflow topology
- World view for spatial repository visualization
- Timeline view for execution replay and audit history

### 2. Application layer

- Workspace and tenant management
- Repository inventory
- Task and workflow engine
- Agent registry
- Tool capability registry
- Model router
- Simulation service
- Billing and usage metering

### 3. Data layer

- PostgreSQL for canonical structured records
- Object storage for logs, artifacts, and source snapshots
- pgvector or Qdrant for semantic retrieval
- Optional graph projection for dependency traversal
- Append-only evidence and action ledgers

### 4. Agent runtime

Every mission follows:

```text
Inspect -> Plan -> Authorize -> Execute -> Validate -> Report -> Archive Evidence
```

Agents receive a task-scoped capability token rather than a broad user credential. The runtime must enforce path, repository, tool, action, cost, and time limits.

### 5. Integration layer

- GitHub App for repository reads, branches, pull requests, checks, and comments
- CI providers for run status, logs, and artifacts
- Package registries for version and publication state
- Linear or issue trackers for work synchronization
- Google Sheets/Excel imports and exports as peripheral interfaces

## Core entities

- `repos`
- `tasks`
- `agents`
- `tools`
- `workflows`
- `workflow_runs`
- `evidence`
- `packages`
- `secret_events`
- `rag_chunks`
- `model_routes`
- `approval_requests`

## Retrieval design

Retrieval must preserve structure rather than flattening all sources indiscriminately.

Supported chunk levels:

- cell
- row
- table block
- document section
- file
- issue or pull request
- workflow run
- evidence bundle

Recommended retrieval sequence:

1. Apply tenant and repository authorization filters.
2. Parse user intent and task type.
3. Run structured SQL filters.
4. Run lexical and vector retrieval.
5. Expand dependency or evidence links.
6. Rerank candidates.
7. Reject stale or unauthorized evidence.
8. Return source identifiers with the generated answer.

## Certainty protocol

- `CONFIRMED`: direct observed output exists.
- `INFERRED`: indirect evidence supports the claim.
- `UNKNOWN`: no sufficient proof exists.

A model response cannot promote itself from `INFERRED` or `UNKNOWN` to `CONFIRMED`. Only an observed validator result may do so.

## Permission tiers

### Read only

Repository metadata, files, logs, tasks, and evidence.

### Suggest

Plans, comments, reports, issue drafts, and virtual diffs.

### PR only

Branches, commits, and pull requests. No direct merge.

### Safe write

Approved low-risk file categories under explicit policy.

### Release assist

Prepare tags, changelogs, artifacts, and release plans. Publishing requires an approval gate.

## Permanently blocked autonomous actions

- reveal raw secrets;
- bypass branch protection;
- disable checks to manufacture a passing status;
- force-push protected branches;
- rewrite shared history without task-specific approval;
- rotate production credentials without approval;
- mutate billing or production infrastructure outside an approved workflow;
- merge when required validation is not confirmed.

## MVP services

```text
apps/web                 Next.js dashboard and playground
apps/worker              GitHub and workflow execution service
packages/grid-engine     schemas, filters, views, formulas
packages/agent-core      mission lifecycle and permissions
packages/evidence-engine certainty and audit records
packages/rag-engine      ingestion, retrieval, citations
packages/model-router    task-to-model routing and budgets
packages/ui-kit          shared MiseOS interface components
```

## Production roadmap

1. Static interactive proof
2. GitHub App repository ingestion
3. PostgreSQL canonical data model
4. Evidence-backed RAG search
5. Ghost, dry-run, sandbox, and PR execution modes
6. Team workspaces and RBAC
7. Package and release governance
8. Spatial Repo City and execution replay
9. Usage metering and paid plans
