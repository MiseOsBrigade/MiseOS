---
name: MiseOS artifacts layout
description: What the project's artifacts are and the structural conventions for the dashboard and api-server.
---

# MiseOS artifacts

pnpm monorepo. Product = **MiseOS** (kitchen-brigade-themed DevOps control plane). Artifacts:
- `artifacts/dashboard` — React + Vite + wouter + TanStack Query + Tailwind v4. The "Control Plane" UI. Served under base path `/dashboard`.
- `artifacts/api-server` — Express API under `/api`. Mixed data sources: jobs/approvals/chat are DB-backed (Drizzle `@workspace/db`); characters/departments/grid are **static TS seed** (`src/data/*.ts` + a `compute*Summary()` helper) served by `src/routes/*.ts`.
- `artifacts/mise-orchestra` — promotional **video** artifact (React + Framer Motion scenes). On-screen brand text says "MISEOS".
- `artifacts/mockup-sandbox` — canvas/component preview server.

## Dashboard routing convention
`src/App.tsx`: each control-plane route is its own `<Route path="/x"><Layout><Page/></Layout></Route>` inside a wouter `<Switch>`; the landing page `/` renders full-screen with no `<Layout>`. Nav items live in the `navigation` array in `src/components/layout.tsx` (Lucide icons). Wouter `base` = `import.meta.env.BASE_URL`.

## Kitchen module
The "Kitchen" nav item (`/kitchen`, `src/pages/kitchen/`) is the Knowledge Grid: summary + verification-health bar + tabs (Projects/Tasks/Sources/Claims/Tools). Claims tab is interactive (verify/flag/reopen/deprecate). Lookup maps (source/project/tool by id) are built client-side from the list endpoints.

`attached_assets/*` are user-provided reference files — never edit them.
