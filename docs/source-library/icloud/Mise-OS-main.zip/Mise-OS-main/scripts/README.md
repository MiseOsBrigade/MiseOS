<div align="center">

<img src="../attached_assets/miseos_agents/02_kitchen_operations/Build-Kun.png" width="160" alt="Build Kun — Build Runner" />

# 🔧 The Prep Station — `scripts/`

**Patron brigade · Kitchen Operations** &nbsp;`#E97B22`
_Build · Schedule · Dispatch_

</div>

> _"Mise-en-place first. Then the line moves fast."_ — **Build Kun**, Build Runner

The **prep station** holds the workspace's tooling and automation — the small,
sharp scripts that keep the whole kitchen moving.

## What lives here

- `src/` — TypeScript scripts run across the workspace.
- `post-merge.sh` — reconciliation that runs after task merges (deps, migrations, setup).

## Run

```bash
pnpm --filter @workspace/scripts run <script>
```

## Brand

This station wears **Flame Orange** `#E97B22`. See the [Design Board](../docs/DESIGN-SYSTEM.md).

<div align="center"><sub><b>MiseOS</b> · Cook. Orchestrate. Deploy.</sub></div>
