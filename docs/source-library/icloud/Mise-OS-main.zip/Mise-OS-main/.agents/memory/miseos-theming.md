---
name: MiseOS theming
description: Brand palette + the additive-tokens rule for the dashboard's Tailwind v4 theme.
---

# MiseOS brand palette & theming rule

Official brand hex (Umami Black `#0E0F10`, Gold Ladle `#D4AF37`, Broth Cream `#F6F1E7`, Flame Orange `#E97B22`, Ink Blue `#182A41`, Matcha Green `#2E8B4E`) live as HSL CSS vars in `artifacts/dashboard/src/index.css`.

**Rule: theming changes must be additive.** Add new semantic tokens (`--gold`, `--success`=matcha, `--warning`=amber/pending, `--info`=ink blue) in both `:root` and the `@theme inline` block (`--color-x: hsl(var(--x))`). Base `--background`/`--foreground` were retuned to Umami Black / Broth Cream.

**Never** retune `--chart-1..5` or the existing status colors — existing pages (overview station bars, approvals risk pills, comms) depend on them, and changing them regresses those pages. `--primary` stays Flame Orange.

**Why:** the architect flagged that global token churn risks silent visual regressions across pages that were not the focus of the change; additive tokens applied in the new surface avoid that.

## Tailwind v4 note
Opacity modifiers work on custom `hsl(var(--token))` colors — `bg-success/10`, `border-gold/40`, `text-info-foreground` all render correctly (Tailwind v4 wraps them in `color-mix`). No need to predefine alpha variants.
