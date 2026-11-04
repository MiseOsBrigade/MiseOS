# Enterprise Brief — Mise PR

## Executive summary

Mise PR is a review-readiness layer for engineering organizations adopting AI coding agents.

It reduces wasted reviewer time by identifying pull requests that are too large, too risky, under-described, untested, or missing traceability before formal code review begins.

## Enterprise value

- Reduces reviewer attention waste
- Improves PR hygiene across teams
- Gives AI agents cleaner context
- Enforces lightweight policy without blocking normal development
- Avoids sending proprietary source code to an LLM by default
- Creates audit-friendly review-readiness records

## Security posture

Default open-source mode:
- runs inside GitHub Actions
- uses repository-local git metadata
- requires no external network calls from the analyzer
- emits Markdown and JSON artifacts
- uses minimal GitHub permissions

Hosted app mode should add:
- SSO/SAML
- org-level policy templates
- encrypted storage
- audit logging
- data retention controls
- SOC 2 roadmap

## Buyer personas

### VP Engineering
Needs predictable delivery and review throughput.

### Platform Engineering Lead
Needs reusable policy across many repositories.

### Security Engineering Lead
Needs risky path visibility before code merges.

### AI Transformation Lead
Needs guardrails for agent-generated PRs without crushing developer speed.

## Enterprise wedge

The product should enter teams as a free GitHub Action, then expand into reporting, policy packs, and organization-level governance.
