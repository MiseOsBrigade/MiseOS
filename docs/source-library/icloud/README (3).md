# @mise-os/brigade-gallery

React + TypeScript + Vite port of the MiseOS Brigade Card Gallery — a searchable,
filterable grid of chef-persona DevOps agent cards with copy-to-clipboard solo
commands.

## Why this exists

The original artifact was a single self-contained HTML file (Tailwind via CDN,
vanilla JS, global `rawMarkdown` string parsed at page load). This port turns
it into a typed, componentized module suited for `Mise-OS`'s React+Vite stack:

- **Data is validated, not just typed.** `src/data/brigade-roster.ts` parses
  every card through `BrigadeCardSchema.parse()` (Zod, `.strict()`) at module
  init — same convention as `mise-yaml.ts`'s `MiseConfigSchema`. A malformed
  entry throws at import time in dev/CI, not silently at render time in prod.
- **No runtime markdown parsing.** The original scanned a giant template
  string on every page load. That string has been parsed once and committed
  as a typed array — cheaper, and it makes diffs on roster changes reviewable.
- **Brand tokens replace the Tailwind CDN defaults.** `src/styles/tokens.css`
  carries the GoodShyt palette (Obsidian `#090D14`, Forest `#1C7552`, Copper
  `#C46C2D`, Cream `#E4DDD3`) and Space Grotesk in place of the original's
  Inter — Inter is off-brand for GoodShyt/Mise-OS.

## Structure

```
src/
  types/brigade.ts              Zod schema + BrigadeCard, BrigadeFilterState (MO-XXX dataset)
  types/master-roster.ts        Zod schema + Rarity/Department/MasterRosterCard/CommandNodeMember
  data/brigade-roster.ts        68 validated cards (MO-001..MO-072, gap-preserved)
  data/master-roster.ts         75 validated cards + 5 departments + Command Node
  hooks/useClipboard.ts         copy-to-clipboard with secure/insecure-context fallback
  hooks/useBrigadeFilter.ts     memoized search + brigade filter + per-brigade counts
  components/BrigadeCard.tsx
  components/BrigadeGallery.tsx
  components/MasterRosterCard.tsx
  components/MasterRosterGallery.tsx
  styles/tokens.css
  App.tsx                       tab switcher between both galleries
```

## Two roster systems, two schemas — now both wired in

Two roster sources were provided, and they're kept as **parallel** typed
modules rather than one merged schema — forcing one shape to serve two
unrelated lore systems (Brigades+tools vs. Departments+rarity) would mean a
pile of mutually-exclusive optional fields on every card:

1. **`brigade.ts` / `brigade-roster.ts`** — the MO-001..MO-072 dataset. Fully
   structured in source (id, brigade, role, focus, tool, slug, mode, color).
   68 unique cards; the id sequence skips `MO-034`–`MO-037`, preserved rather
   than silently renumbered since `mise card run <slug>` may already
   reference these exact ids downstream.

2. **`master-roster.ts`** (new) — the 75-card **Master Franchise Roster**
   from `Mise_Orchestra_Master_Roster.pdf`: 5 Departments (Pipeline Masters,
   Golden Paths, Guardians of Uptime, Vaultkeepers, The Infinite Ledger),
   6 rarity tiers (Common → Mythic), and a leadership **Command Node**
   (Orchestra Core, Kurogami Senpai, four Prime satellites) that sits above
   the numbered 1-75 and isn't part of that count.

   **Caveats worth a design-team pass before this ships anywhere
   customer-facing:**
   - The PDF is image-based, not text — every name, role, and rarity tier
     was transcribed by reading the rendered card art, not OCR'd. High
     confidence on department groupings/mottos/headquarters (clean section
     headers); lower confidence on a few individual rarity calls.
   - **Rarity is modeled as tier-scoped, not per-card.** The source roadmap
     page defines one frame color + star rating per tier; individual card
     art showed some 4-vs-5-star variance within the same tier. `RARITY_META`
     in `master-roster.ts` is the single source of truth for color/stars —
     more defensible than claiming exact per-card star counts read off
     stylized images.
   - **`buildMasterRosterCommand()` is synthesized**, not sourced. The PDF
     never shows CLI commands for this roster; the generated
     `mise roster run <slug> --dept <dept> --solo --emit report` string
     mirrors the MO-XXX dataset's existing grammar as a proposed convention.
   - `"Legendary Genesis"` cards (Yume Builder, Iron Hashi, Umami Code,
     Streama) are mapped to the `genesis-founder` rarity — matching the
     "Genesis Founder (Black/Gold — The Original 15)" tier named on the
     roadmap page, distinct from plain `legendary`.

`App.tsx` now renders both via a tab switcher (no router dependency added —
two views didn't justify one).

## Commands

```bash
npm ci
npm run dev       # local dev server
npm run build      # tsc -b && vite build
```
