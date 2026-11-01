# MiseOS GridOps Releases 3–4

Graph-native knowledge intelligence and character-first operational world, layered onto Release 2 safe execution.

## Canonical boundary

**112 character agents + 23 registry manifests = 135 MiseOS ecosystem items.** Registry manifests remain infrastructure records and are never converted into character cards.

## Release 3

- Knowledge graph nodes and typed edges
- Deterministic vector embeddings with provider-compatible storage
- Governed memory lifecycle: proposed, approved, quarantined, expired
- Evidence-linked lineage records
- Semantic graph and workflow retrieval
- Evidence-backed agent performance scoring

## Release 4

- Spatial operational map
- Timeline and incident views
- Card-driven workforce UI
- Marketplace and subscription graph schemas
- 300-agent compatible Brigade framework
- Customer-configurable Brigade APIs

## Performance methodology

Runtime performance is separated from collectible-card lore stats. Scores require performance events and may link to Evidence Cards.

| Dimension | Weight |
|---|---:|
| Reliability | 24% |
| Quality | 20% |
| Speed | 12% |
| Safety | 24% |
| Teamwork | 12% |
| Learning | 8% |

Composite scores have a sample size and methodology version. Missing data stays zero rather than being fabricated. Future production scoring should add recency decay, confidence intervals, task difficulty normalization, and anti-gaming review.

## Character development model

Each character has four distinct layers:

1. **Identity:** name, visual system, lore, department, rarity.
2. **Capability:** tools, workflows, permissions, handoffs.
3. **Observed performance:** evidence-backed operational metrics.
4. **Development:** approved learning memories, certifications, new workflow proficiency, and lineage.

This keeps character IP durable while operational behavior evolves safely.

## Run

```bash
cp .env.example .env
docker compose up --build
curl -X POST http://localhost:8000/knowledge-graph/rebuild
```

Grid UI: http://localhost:4173
API docs: http://localhost:8000/docs

## Key APIs

- `POST /knowledge-graph/rebuild`
- `GET /knowledge-graph/nodes`
- `GET /knowledge-graph/edges`
- `GET /semantic-search?query=incident+recovery`
- `POST /memories`
- `POST /memories/{id}/approve`
- `POST /lineage`
- `POST /performance/events`
- `GET /performance/scores`
- `GET /world/map`
- `POST /incidents`
- `GET /timeline`
- `POST /marketplace/listings`
- `POST /brigades`

## Market definition

**MiseOS is a character-first operating system for autonomous software. Its Chef Agents are durable interfaces connecting workflows, repositories, evidence, education, community, and products, while GridOps turns their activity into a safe, observable living world.**

Blockchain, collectibles, subscriptions, and merchandise are optional distribution and ownership layers. They do not define the platform. Character identity, software utility, and verified performance do.
