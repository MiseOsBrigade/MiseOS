# MiseOS Master Roster Gallery

The Master Roster Gallery is a React + TypeScript + Vite workspace inside `apps/registry-console`.

## What it adds

- 75 validated Master Roster cards
- 5 departments with 15 cards each
- rarity tiers: Rare, Epic, Legendary, Legendary Genesis, Mythic
- searchable and filterable card UI
- copy-ready solo commands
- JSON and CSV exports
- registry manifest: `miseos.master-roster-gallery`

## Source data

```txt
registry/cards/master-roster-cards.json
registry/cards/master-roster-departments.json
apps/registry-console/src/data/master-roster.generated.ts
```

## Commands

```bash
pnpm cards:validate
pnpm cards:export
pnpm gallery:dev
pnpm gallery:build
```

## Command grammar

Every card receives a generated solo command:

```bash
mise roster run <card-slug> --dept <department-slug> --solo --emit report
```

Example:

```bash
mise roster run release-conductor --dept pipeline-masters --solo --emit report
```
