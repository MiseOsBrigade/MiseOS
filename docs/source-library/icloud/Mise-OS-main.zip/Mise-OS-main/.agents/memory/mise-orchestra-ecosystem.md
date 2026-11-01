---
name: Mise Orchestra ecosystem map
description: The canonical "Mise DevOps Orchestra" repo/module map and the repo→kitchen-station→color convention used across the dashboard.
---

# Canonical ecosystem (source of truth)

The "Mise DevOps Orchestra" is **one control plane + 5 modules + one shared contract**, derived from a user-supplied brainstorming doc (an `attached_assets/Pasted-User-What-repository-...txt` file — may not persist in future sessions, so the map below is the durable record).

- **Control plane:** `Git-it-Got-it-Good` — orchestrator/event router; reads `mise.yaml`, decides which modules fire, owns approval gates. Persona: "Mise-Maestro".
- **Modules:**
  - `mise-pr` — PR intelligence (review-readiness, hygiene, risk, summary packets). Flagship.
  - `mise-brigade-de-repo` — repo stewardship (merge gates, repo health, branch intelligence, cleanup PRs).
  - `mise-salt-shakers` — workflow primitives (safe-by-default GitHub Actions building blocks).
  - `Git-Locker-` — guardrails/security (repo protection, policy enforcement).
  - `Mise-en-Preplist` — bootstrap/packaging (turns projects into GitHub-ready structure).
- **Shared contract:** `mise.yaml` (version, repo_profile, policies.pr, policies.stewardship, modules toggles).
- **Event flow:** PR opened → control plane routes → mise-pr (quality/risk) → Git-Locker- (policy boundaries) → mise-brigade (merge readiness) → status/packet → human approval gate.
- **CLI surface:** `mise init | doctor | pr audit | repo steward | policy check | bootstrap`.

# Convention: repo → kitchen station → color

The dashboard renders this on the **Ecosystem** page (`pages/ecosystem.tsx`, route `/ecosystem`). Keep these mappings consistent if asked to align departments/characters with the ecosystem:

- control plane → Executive Chef / Mise-Maestro → primary orange `#F97316`
- mise-pr → Expediter → pipeline blue `#3B82F6`
- mise-brigade-de-repo → Sous Chef → platform teal `#14B8A6`
- mise-salt-shakers → Garde Manger → reliability amber `#F59E0B`
- Git-Locker- → Pass Guardian → security red `#EF4444`
- Mise-en-Preplist → Prep Cook → data violet `#8B5CF6`

**Why:** these 5 colors are the dashboard's existing department tokens; reusing them keeps the ecosystem page visually cohesive with Departments/Characters.

**Note:** the artifact headline is "75 AI Agents / 5 Kitchen Departments"; the ecosystem page is about the **6-repo module map**, a separate axis from the 75 agents.
