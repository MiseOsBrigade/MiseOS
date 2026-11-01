# MiseOS GridOps Metrics Package

Machine-readable metric registry and dashboard configuration derived from the MiseOS evidence-driven operating framework.

## Canonical ecosystem boundary

**112 character agents + 23 registry manifests = 135 MiseOS ecosystem items.**

Registry manifests are products and infrastructure records, not character cards. Chef Brigade 300 is the expansion framework, not the current verified roster count.

## Contents

- `schemas/metric-definition.schema.json` — validates one metric definition.
- `schemas/metric-observation.schema.json` — validates measured observations and evidence.
- `schemas/gridops-dashboard.schema.json` — validates GridOps dashboard layouts.
- `schemas/alert-policy.schema.json` — validates metric-triggered governance policies.
- `registry/miseos-metric-registry.json` — canonical initial metric catalog.
- `registry/alert-policies.json` — critical default alert policies.
- `dashboards/portfolio-command.dashboard.json` — primary GridOps portfolio dashboard.
- `examples/metric-observation.example.json` — example confidence-bearing observation.
- `docs/implementation.md` — ingestion, calculation, and governance guidance.

## Design rules

1. A task is not successful until every required proof gate passes.
2. Every material metric includes provenance and a confidence score.
3. Low-confidence data remains visible as low confidence; it is not silently promoted.
4. Severe events remain independently visible and cannot be averaged away.
5. Automated responses require the metric's configured confidence threshold.
6. Human approval remains mandatory for irreversible, legal, financial, privacy, and high-impact actions.
7. Character metadata and registry metadata remain separate.

## Validation

Use any JSON Schema Draft 2020-12 validator.

```bash
npm install --save-dev ajv ajv-formats
```

Load each item from `registry/miseos-metric-registry.json` and validate it against `schemas/metric-definition.schema.json`. Validate the dashboard and observations against their corresponding schemas.

## Integration sequence

1. Emit normalized GridOps events.
2. Calculate observations by metric ID.
3. Attach provenance, source counts, and confidence factors.
4. Validate each observation.
5. Persist observations in an append-only metric store.
6. Render the dashboard configuration.
7. Evaluate alert policies.
8. Require acknowledgement for critical red states.
