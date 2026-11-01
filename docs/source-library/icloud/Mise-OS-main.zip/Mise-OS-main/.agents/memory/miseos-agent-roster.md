---
name: MiseOS agent roster count
description: The official MiseOS agent count is 75, duplicated across two hardcoded sources that must stay in lockstep.
---

# MiseOS agent roster = 75, in two places

The official, brand-canonical agent count is **75** — tagline "75 specialized agents.
7 brigades. One orchestra." All brand/launch copy (gallery header, brand board, launch
film) hardcodes "75", so the roster data must equal 75 exactly or copy and counts diverge.

The roster is defined in **two independent hardcoded sources** that have no shared import
(separate packages):
- `artifacts/dashboard/src/lib/brigade-data.ts` — `RAW_GROUPS`; `BRIGADE_TOTAL` auto-sums it and drives the `/brigade` gallery.
- `artifacts/mockup-sandbox/src/components/mockups/miseos-brand/Mascots.tsx` — its own `brigades` array with per-group `count` + `mascots[]` (the brand-board "Character System" panel).

**Why:** Master mascot art in `attached_assets/miseos_agents/` originally had 80 (groups
10/10/10/10/10/15/15). The brand number was always 75, so the roster was trimmed to 75 by
removing 5 redundant agents from the two oversized brigades → final split 10/10/10/10/10/12/13.
Removed: Platform&Infra → Cache, Backup, Capacity; Ecosystem → Ambassador, Documentor
(each overlapped an existing agent: Cache↔Cache-Cat, Backup↔DR-Builder, Capacity↔Scale-Oni/Cost-Guard, Documentor↔Doc-Writer, Ambassador↔Community-Rep).

**How to apply:** Any add/remove of an agent must update BOTH sources in lockstep (and the
Mascots.tsx per-group `count`). Keep the total at 75 unless you also change every "75" copy
surface. Never edit the `attached_assets/miseos_agents/` masters — they still hold all 80
PNGs; trimmed mascots are just dropped from the two roster definitions (and their working
copies under `artifacts/mockup-sandbox/public/images/mascots/`). The dashboard gallery loads
art via `import.meta.glob` over the masters, so orphan master PNGs are harmless — only the
roster arrays define what shows. Note: the pre-existing api-server `CHARACTERS` data model is
a separate product surface, not the brigade roster — don't conflate them.
