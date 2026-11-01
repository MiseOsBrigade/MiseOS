# Architecture

Mise Enhanced GPU Pack-a-Punch is a stacked workflow processor.

```mermaid
flowchart LR
  A0[A0 Measurement Context] --> B1[B1 Risk Gate]
  B1 --> C2[C2 Quality Stack]
  B1 --> D3[D3 Supply Chain Scan]
  B1 --> E4[E4 Branch Advisor]
  C2 --> F5[F5 Evidence Report]
  D3 --> F5
  E4 --> F5
  B1 --> F5

  A0 --> G0[GPU Recommendation]
  G0 --> G1{Manual enable or gpu-ok label?}
  G1 -->|yes| G2[Ephemeral GPU Runner]
  G1 -->|no| G3[CPU-only path]
  G2 --> G4[GPU Evidence]
```

## Signal model

The system treats a repository like a measurement network:

| Coordinate | Meaning |
|---|---|
| A0 | Measure context before action. |
| B1 | Gate irreversible or risky changes. |
| C2 | Validate the changed repository with native tooling. |
| D3 | Surface dependency and supply-chain risk. |
| E4 | Advise branch/review ordering. |
| F5 | Preserve evidence for humans and agents. |

## Implementation model

- Node scripts perform repository measurement, policy checks, quality routing, supply-chain summaries, branch advice, and report generation.
- Python scripts perform complexity scoring, GPU preflight evidence, and GPU smoke tests.
- JSON policy files keep thresholds and sensitive path rules outside workflow YAML.
- Artifacts are uploaded as Markdown/JSON evidence instead of being committed back into the repository.
