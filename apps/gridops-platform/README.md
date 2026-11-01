# MiseOS GridOps — Release 1: Operational Truth

Production-oriented foundation for the GridOps Playground:

- PostgreSQL system of record
- deterministic import of 112 Character Agents + 23 Registry Manifests
- agent, workflow, repository, task, evidence and transactional-outbox schemas
- NATS JetStream event bus
- Evidence Vault with canonical SHA-256 evidence hashing
- basic searchable Grid UI

## Run

```bash
cp .env.example .env
docker compose up --build
```

Open:

- Grid UI: `http://localhost:4173`
- API docs: `http://localhost:8000/docs`
- NATS monitoring: `http://localhost:8222`

The API automatically creates the schema and imports the canonical 135-item dataset on first boot.

## Verify canonical data

```bash
make verify
```

Expected result: 112 character agents, 23 registry manifests, 135 unique IDs.

## Evidence rule

An Evidence Card stores a claim, certainty state, action, target, proof array, policy decision, optional signature, and canonical SHA-256 digest. Duplicate evidence bundles are rejected.

## Event subjects

- `miseos.repository.created`
- `miseos.task.created`
- `miseos.evidence.recorded`

Database writes and event publication are decoupled through the transactional outbox table so events can be retried without losing the underlying state change.
