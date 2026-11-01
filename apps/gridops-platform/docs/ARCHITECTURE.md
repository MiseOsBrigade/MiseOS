# MiseOS GridOps Architecture

**112 character agents + 23 registry manifests = 135 MiseOS ecosystem items.**

The 300 target is a Brigade workforce target: 112 canonical character agents plus 188 future specialist agents. It is not the current ecosystem count, and registry manifests are never character cards.

## Runtime planes

1. PostgreSQL: transactional system of record, approvals, runs, evidence, outbox.
2. Knowledge graph: typed relationships and lineage; the included `graph_edges` table is a portable baseline and can be projected into Neo4j.
3. Reasoning graph: planning, routing, reflection, and human intervention.
4. Durable workflow runtime: deterministic state transitions, retries, timers, signals, and crash recovery.
5. Evidence Vault: content-addressed proof, policy decisions, signatures, and immutable event history.

## Safety invariants

- Agents cannot raise their own risk tier.
- Tier 3 and 4 operations require approval.
- Production requires simulation, test, rollback, and policy evidence.
- UNKNOWN or CONTRADICTED certainty blocks claims and actions.
- Completion requires the workflow proof gate to pass.
