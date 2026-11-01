# MiseOS Metric Workflow Platform

A secure integration of three layers:

1. **Corrected metric registry** — 22 definitions validated against the supplied Draft 2020-12 metric schema.
2. **Deterministic Node.js calculation service** — confidence-weighted observations, threshold classification, append-only JSONL storage, and automation eligibility gates.
3. **Clickable-character workflow surface** — inert canvas/image UI, Ed25519-signed hotspot manifests, metric-based governance gates, and a local workflow allowlist.

## Important boundary

No JavaScript is embedded in PNG data. Images are visual assets only. The application executes only audited modules listed in `workflow/registry.json`.

## Run

```bash
npm install
export MANIFEST_PUBLIC_KEY="$(cat secrets/dev-ed25519-public.pem)"
npm run validate:registry
npm test
npm start
```

Open `http://localhost:3000`.

## Calculate a metric

```bash
curl -X POST http://localhost:3000/api/metrics/calculate \
  -H 'content-type: application/json' \
  -d '{
    "metricId":"miseos.metric.registry_integrity",
    "inputs":{"valid_registry_records":23,"published_registry_records":23},
    "confidenceFactors":{"freshness":1,"completeness":1,"source_reliability":1,"calculation_reliability":1,"historical_stability":1,"independent_verification":1,"provenance_completeness":1},
    "window":{"start":"2026-07-20T00:00:00Z","end":"2026-07-20T23:59:59Z"},
    "dimensions":{"registry_type":"all"},
    "evidence":[{"uri":"miseos://evidence/registry-scan-001","sha256":"abc"}]
  }'
```

## Repaired definitions

- `agent_utilization`: restored threshold objects, source array, daily refresh, owner, and operational severity.
- `compute_utilization`: restored threshold objects, source array, hourly refresh, owner, and operational severity.
- `cost_per_verified_task`: restored dimensions and governance severity.
- `stakeholder_nps`: restored dimensions and governance severity.

## Governance

Automation is eligible only when the metric explicitly permits it, evidence exists when required, confidence meets the metric minimum, and the observation status is known. Critical failures are never masked by composite scores.
