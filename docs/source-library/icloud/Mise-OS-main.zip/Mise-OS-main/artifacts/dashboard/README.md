<div align="center">

<img src="../../attached_assets/miseos_agents/01_executive_chefs/Orchestra-Core.png" width="160" alt="Orchestra Core — Chief Orchestrator" />

# 🎛️ MiseOS — Control Plane

**Patron brigade · Executive Chefs** &nbsp;`#D4AF37`
_Leadership & Orchestration_

</div>

> _"I don't cook the dishes. I make sure every station does."_ — **Orchestra Core**, Chief Orchestrator

The **Control Plane** is the head chef's station — the web app where the whole
brigade comes into view. Landing, brigades, kitchen grid, and ecosystem, all in one
calm pane of glass.

## What lives here

A **React + Vite** single-page app (routing via `wouter`, Tailwind v4) that renders:

- **Landing** — the MiseOS story and the orchestra at a glance.
- **Brigade** — all 7 groups and 75 agents, sourced from [`src/lib/brigade-data.ts`](src/lib/brigade-data.ts).
- **Kitchen** — the live Grid OS workspace (projects, tasks, sources, claims, tools).
- **Ecosystem** — integrations and the wider world.

## Run this station

```bash
pnpm --filter @workspace/dashboard run dev
```

## Brand

This station wears **Gold Ladle** `#D4AF37`. Palette, type, and motion are defined in
the [Design Board](../../docs/DESIGN-SYSTEM.md).

<div align="center"><sub><b>MiseOS</b> · Cook. Orchestrate. Deploy.</sub></div>
