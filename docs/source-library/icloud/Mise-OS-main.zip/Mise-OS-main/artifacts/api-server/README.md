<div align="center">

<img src="../../attached_assets/miseos_agents/03_service_layer/Umami-Code.png" width="160" alt="Umami Code — API Responder" />

# 🍽️ The Pass — API Server

**Patron brigade · Service Layer** &nbsp;`#2E8B4E`
_Runtime · Cache · Delivery_

</div>

> _"Order up. Every response, hot and on time."_ — **Umami Code**, API Responder

This is **the pass** — where the kitchen hands finished work to the dining room.
The API server serves the MiseOS data the rest of the brigade relies on: the
**Knowledge Grid** (projects, tasks, sources, claims, tools) and the brigade roster.

## What lives here

- `src/data/` — the seeded **Grid OS** dataset. Every claim ties to evidence; every
  record carries **status + confidence** so the grid stays trustworthy.
- API routes serializing that data to the dashboard and other clients.

> Contract first: shapes are defined in [`lib/api-spec`](../../lib/README.md) and
> consumed through generated clients. Match route serialization to the spec.

## Run this station

```bash
pnpm --filter @workspace/api-server run dev
```

## Brand

This station wears **Matcha Green** `#2E8B4E`. See the [Design Board](../../docs/DESIGN-SYSTEM.md).

<div align="center"><sub><b>MiseOS</b> · Cook. Orchestrate. Deploy.</sub></div>
