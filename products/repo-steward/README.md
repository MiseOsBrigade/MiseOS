# MiseOS Repo Steward

**Governed autonomous repository maintenance for GitHub teams.**

MiseOS Repo Steward is a model-agnostic developer tool that inspects repositories, classifies risk, proposes or applies low-risk repairs, validates changes with real evidence, protects secrets, and routes dangerous actions through human approval.

> Autonomy is bounded. Production deployment, destructive database operations, credential rotation, permission escalation, and Git history rewriting always require explicit human approval.

## Capabilities

- Repository and stack inspection
- Lint, type, test, build, and configuration repair planning
- GitHub Actions workflow recovery
- Secret-safe `.gitignore` and `.env.example` handling
- Dependency health and safe-update classification
- Tier 1 / Tier 2 / Tier 3 authorization policy
- `CONFIRMED`, `INFERRED`, and `UNKNOWN` validation evidence
- Provider-neutral AI model taxonomy
- Multi-agent and human-in-the-loop architecture
- SaaS-ready plans, entitlements, audit, and billing boundaries

## Quick start

```bash
cd products/repo-steward
corepack enable
pnpm install
pnpm build
pnpm test
pnpm steward inspect --repo .
pnpm steward taxonomy
```

## Commands

```text
miseos-steward inspect   Inspect repository metadata and available checks
miseos-steward evaluate  Classify an action and return its authorization path
miseos-steward plan      Build a dry-run repository maintenance plan
miseos-steward taxonomy  Print supported AI classifications
```

## Risk model

| Tier | Behavior | Examples |
|---|---|---|
| 1 | Execute or prepare low-risk fix | inspect, validate, format, imports, `.gitignore` |
| 2 | Open PR; no automatic merge | architecture, major dependencies, broad refactors |
| 3 | Suspend for human approval | production deploy, destructive DB, secrets, permissions, history rewrite |

## AI taxonomy

The platform distinguishes capability, functional depth, product paradigm, training method, architecture, and application domain. ANI is current; AGI is theoretical; ASI and self-aware AI remain hypothetical or conceptual classifications.

## Monetization

- **Community:** local CLI and policy engine
- **Pro:** scheduled scans and repair PRs
- **Team:** multi-repo dashboard, approvals, shared memory
- **Enterprise:** SSO, Vault, immutable audit, private deployment
- **Marketplace:** security, release, compliance, docs, and platform packs

## Development

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Status: `0.1.0-alpha`
