# Implementation Guide

## 1. Event envelope

All source adapters should emit a common envelope:

```json
{
  "event_id": "evt_...",
  "event_type": "workflow.step.verified",
  "occurred_at": "2026-07-18T00:00:00Z",
  "producer": "gridops",
  "environment": "production",
  "actor": {
    "kind": "agent",
    "id": "agent_..."
  },
  "subject": {
    "kind": "workflow",
    "id": "workflow_..."
  },
  "correlation_id": "mission_...",
  "causation_id": "evt_parent_...",
  "payload": {},
  "evidence": {
    "provenance_uri": "miseos://evidence/...",
    "artifact_hashes": []
  }
}
```

## 2. Metric calculation service

The calculation service should:

- read metric definitions by `metric_id`;
- query normalized events for the configured window;
- calculate numerator, denominator, aggregation, and dimensions;
- calculate the seven confidence factors;
- produce a schema-valid observation;
- classify the value as green, amber, red, or unknown;
- persist both inputs and calculation version.

Metric calculations must be deterministic for the same evidence snapshot.

## 3. Confidence calculation

```text
confidence =
  freshness × 0.15
+ completeness × 0.20
+ source_reliability × 0.20
+ calculation_reliability × 0.15
+ historical_stability × 0.10
+ independent_verification × 0.10
+ provenance_completeness × 0.10
```

Do not infer missing confidence factors as perfect. Missing factors should reduce confidence or make the observation invalid.

## 4. Storage model

Recommended logical tables:

- `metric_definitions`
- `metric_observations`
- `metric_evidence_links`
- `dashboard_definitions`
- `alert_policies`
- `alert_instances`
- `alert_acknowledgements`
- `calculation_runs`
- `event_envelopes`

Observations should be append-only. Corrections should supersede prior observations rather than mutating historical evidence.

## 5. Dashboard behavior

Every widget should expose:

- current value;
- confidence;
- trend;
- status;
- last refresh time;
- source systems;
- provenance drilldown;
- dimensions;
- threshold definition.

Critical red states require an acknowledgement record and must remain visible until resolved or formally superseded.

## 6. Governance enforcement

Automation may run only when:

- the metric permits automated action;
- observation confidence meets `minimum_for_automation`;
- evidence is complete;
- the proposed response is within an approved permission envelope;
- the action is reversible or explicitly approved.

Never allow an aggregate score to suppress a critical policy, security, registry, memory, payment, or entitlement failure.

## 7. Initial adapters

Recommended first adapters:

1. GitHub and GitHub Actions
2. GridOps workflow events
3. Logfire/OpenTelemetry
4. DigitalOcean infrastructure
5. Supermemory
6. Registry Platform
7. Policy Engine
8. Stripe
9. QuickNode

## 8. Rollout

- Phase 1: shadow calculations, no automation.
- Phase 2: operator-reviewed alerts.
- Phase 3: reversible automated remediation.
- Phase 4: bounded autonomous responses for high-confidence metrics.
