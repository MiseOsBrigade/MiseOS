---
name: MiseOS dashboard rebrand
description: Brand vocabulary + the display-only "Kitchen"→"Station" rule for the dashboard artifact
---

# MiseOS rebrand (dashboard artifact)

Brand vocabulary for the dashboard at `artifacts/dashboard`:
- Company: **Brigade Systems** (R&D: Brigade Labs). Platform: **MiseOS**.
- The 5 agent departments collectively = **The Stations** (individually "X Station").
- Core engine / control plane = **The Expeditor**. Dashboard workspace = **The Kitchen Table**. Agent sandbox = **The Prep Station**.

## Rule: rebrand is dashboard-only; department names are transformed at the display layer
The API still returns department names as `"… Kitchen"` (e.g. "Pipeline Kitchen"). The dashboard shows `"… Station"` via the `stationName()` helper in `artifacts/dashboard/src/lib/utils.ts` (regex `\bKitchen\b`→`Station`), applied at render time only.

**Why:** The rebrand scope was explicitly **dashboard only** — NOT the API, the video trailer, or docs. Routes (`/departments`), API field names (`department`), and `data-testid`s were intentionally left on the old vocabulary to avoid breaking the API contract and tests.

**How to apply:** When rendering an API-supplied department name in the dashboard, wrap it in `stationName(...)`. Do NOT rename API responses, routes, or test IDs to "Station". Intentionally-kept old strings: the live-agent-chat operator role label "Control Plane" (the user asked to keep the chat as-is) and an internal `App.tsx` code comment.
