# MiseOS Mascot Reference

This repo uses the uploaded MiseOS / Mise Orchestra references as the character direction for the initial Repo Pet runtime.

## Visual language

- Black, cream, gold, orange, teal, matcha, and ink-blue palette.
- Chibi chef silhouettes with readable role props.
- Kitchen-as-DevOps metaphor: prepare, cook, orchestrate, deploy, scale, observe.
- Strong agent identity: each character owns a station, action, and operational purpose.

## Core 15 characters

1. **Kurogami Senpai** — Chef de Cuisine — master orchestrator.
2. **Tensho** — Expediter — pipeline and route speed.
3. **Mizu** — Prep Chef — queue prep and organization.
4. **Umami Code** — Saucier — API sauce and integrations.
5. **Kaji** — Grillardin — compute heat.
6. **Yume** — Pastry Chef — artifacts and polish.
7. **Iron Hashi** — Boucher — validation and strict standards.
8. **Null-chan** — Plongeur — cleanup and stale-state removal.
9. **Flash Riku** — Runner — fast delivery.
10. **Seira** — Sommelier — secrets and sensitive ingredients.
11. **Kuro Guard** — Steward — firewall and access control.
12. **Scale Oni** — Rotisseur — autoscaling and load pressure.
13. **Build-Kun** — Boulanger — container/image builds.
14. **Streama** — Poissonnier — data streams and continuous flow.
15. **Orchestra Core** — Chef Spirit — meta-orchestration.

## Runtime mapping

The roamer does not need image assets to run. Each character is represented by:

- `id`: CLI-safe identifier.
- `number`: roster number.
- `name`: display name.
- `title`: kitchen title.
- `department`: department key.
- `glyph`: role icon.
- `sprite`: current terminal symbol.
- `catchphrase`: README/card style line.
- `roamingBias`: weighted path-category preferences.
- `verbs`: action language shown while roaming.

Update `src/characters.js` when adding the full 75-agent gallery.
