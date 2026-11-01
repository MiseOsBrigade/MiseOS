# MiseOS Metric + Clickable Workflow Architecture

```mermaid
flowchart LR
  U[User] --> C[Canvas Character UI]
  C --> M[Signed Character Manifest]
  C --> API[MiseOS API]
  API --> MV[Ed25519 Manifest Verifier]
  API --> MG[Metric Governance Gate]
  MG --> MR[Corrected Metric Registry]
  MG --> OS[Append-only Observations]
  API --> WR[Allowlisted Workflow Registry]
  WR --> WX[Bounded Workflow Executor]
  WX --> EV[Evidence / Audit Event]
```

The PNG remains inert. The signed manifest declares hotspots and metric gates; the registry defines governance thresholds; the executor permits only local allowlisted modules.
