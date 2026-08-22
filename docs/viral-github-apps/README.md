# 10 Viral GitHub Apps — AI-Fatigue & Workflow Solutions

> Foundational developer infrastructure for the 2026–2030 transition: less AI-generated noise, less CI exhaustion, stronger repository primitives, and clearer human accountability.

## Thesis

AI-assisted development is increasing the amount of code, review activity, automation, and CI output that teams must process. The next bottleneck is not code generation; it is **trust, triage, verification, provenance, and workflow coordination**.

This portfolio targets ten concrete workflow gaps with GitHub-native apps designed around small, composable primitives. The names are intentionally memorable; the architecture is intentionally serious.

## Portfolio map

| # | App | Core problem | Primary surface |
|---|---|---|---|
| 1 | [Promptimus Prime](#1-promptimus-prime) | AI-generated PR risk and review fatigue | Pull requests / Checks |
| 2 | [Nit Picard](#2-nit-picard) | AI review-comment noise | Reviews / Comments |
| 3 | [Flake It Till You Make It](#3-flake-it-till-you-make-it) | Flaky CI tests | Checks / Workflows |
| 4 | [Unstuck Norris](#4-unstuck-norris) | Stuck required checks and merge queues | Checks / Status |
| 5 | [CODEOWNERS Noah](#5-codeowners-noah) | Broken or orphaned ownership | CODEOWNERS / Branch protection |
| 6 | [Debt Vader](#6-debt-vader) | Invisible PR-level technical debt | Pull requests / Checks |
| 7 | [The Stacks Bunny](#7-the-stacks-bunny) | Dependency-stack coordination | Pull requests / Rebase |
| 8 | [Cover Me Impressed](#8-cover-me-impressed) | Diff-coverage visibility | Checks / Annotations |
| 9 | [The Keymaker](#9-the-keymaker) | Aging secrets and rotation debt | Secrets / Issues |
| 10 | [FreshPRince of Bel-Repo](#10-freshprince-of-bel-repo) | First-contributor onboarding friction | Pull requests / Issues |

---

## 1. Promptimus Prime

**AI-slop gatekeeper.** Detects AI-authored PR signals through signal fusion such as commit cadence, change entropy, repository context, generated-code markers, and review-risk indicators. When a PR exceeds configurable size/risk thresholds, it blocks automatic progression and requests a structured author walkthrough.

> “Autobots, review out — author walkthrough required.”

- **Homepage:** https://promptimus-prime.dev
- **Callback:** https://promptimus-prime.dev/auth/callback
- **Webhook:** https://api.promptimus-prime.dev/webhook
- **Repository permissions:** Pull requests — Read & write; Checks — Read & write
- **Organization permissions:** None
- **User permissions:** None
- **Events:** Pull request
- **Core check:** AI-risk signal fusion → human-readable evidence → review gate
- **Safety boundary:** Never claim certainty that code was AI-generated. Surface probabilistic signals and require human attribution where policy demands it.

## 2. Nit Picard

**Captain of the code-review enterprise.** Intercepts author-facing AI review comments, classifies them into nit/style/functional/security categories, collapses redundant noise, and pins a single top-three-issues summary.

> “Make it so — 2 functional issues, 1 security concern.”

- **Homepage:** https://nit-picard.io
- **Callback:** https://nit-picard.io/github/callback
- **Webhook:** https://api.nit-picard.io/webhook
- **Repository permissions:** Pull requests — Read & write; Pull request reviews — Read & write
- **Organization permissions:** None
- **User permissions:** None
- **Events:** Pull request review; Pull request review comment
- **Core check:** Deduplicate → classify → rank → summarize
- **Safety boundary:** Preserve original review evidence and never silently delete substantive security or correctness feedback.

## 3. Flake It Till You Make It

**Flaky-test blame bot.** On CI reruns, records which tests failed, calculates per-test flakiness ratios, identifies likely introducing commits, and quarantines tests after configurable thresholds through a PR check.

- **Homepage:** https://flake-it.dev
- **Callback:** https://flake-it.dev/auth/github
- **Webhook:** https://api.flake-it.dev/webhook
- **Repository permissions:** Checks — Read; Issues — Read & write; Pull requests — Read & write
- **Organization permissions:** None
- **User permissions:** None
- **Events:** Check run; Workflow run
- **Core check:** Failure history → flakiness score → attribution → quarantine proposal
- **Safety boundary:** Quarantine is reversible and auditable; a flaky classification must not be treated as proof of developer fault.

## 4. Unstuck Norris

**Merge-queue roundhouse kick.** Handles legitimate skipped required checks caused by path filtering and retries transient failures exactly once, while keeping branch-protection semantics explicit.

- **Homepage:** https://unstuck-norris.com
- **Callback:** https://unstuck-norris.com/auth
- **Webhook:** https://api.unstuck-norris.com/webhook
- **Repository permissions:** Checks — Read & write; Pull requests — Read & write; Commit statuses — Read & write
- **Organization permissions:** None
- **User permissions:** None
- **Events:** Check suite; Pull request; Status
- **Core check:** Determine skip legitimacy → satisfy only policy-approved skips → one bounded retry
- **Safety boundary:** Never manufacture a passing result for an actually failed security or correctness check.

## 5. CODEOWNERS Noah

**Two of every owner, no orphans.** Validates CODEOWNERS on pushes and PRs, identifying unowned paths, departed users, empty teams, invalid ownership rules, and conflicts with branch protection.

- **Homepage:** https://codeowners-noah.io
- **Callback:** https://codeowners-noah.io/oauth/github
- **Webhook:** https://api.codeowners-noah.io/webhook
- **Repository permissions:** Contents — Read; Pull requests — Read & write; Checks — Read & write
- **Organization permissions:** Members — Read
- **User permissions:** None
- **Events:** Push; Pull request
- **Core check:** Parse ownership graph → validate principals → compare protection policy → annotate gaps
- **Safety boundary:** Member lookup is used only to validate ownership; the app does not expose unnecessary membership data.

## 6. Debt Vader

**The Sith Lord of technical debt.** Posts a PR-delta technical-debt check that measures marginal damage instead of punishing teams with whole-repository scores.

Example signals:

- `+8` cyclomatic complexity
- `+3` TODO/FIXME markers
- `+2` duplicated blocks
- `+1` dependency risk

- **Homepage:** https://debt-vader.dev
- **Callback:** https://debt-vader.dev/callback
- **Webhook:** https://api.debt-vader.dev/webhook/github
- **Repository permissions:** Pull requests — Read & write; Checks — Read & write; Contents — Read
- **Organization permissions:** None
- **User permissions:** None
- **Events:** Pull request
- **Core check:** Base snapshot → PR snapshot → delta analysis → actionable debt budget
- **Safety boundary:** Report deltas with methodology and confidence; do not convert heuristic metrics into absolute quality judgments.

## 7. The Stacks Bunny

**Keepin’ your PRs in single file.** Reads `Depends-On: #123` relationships, blocks a child merge until its parent merges, auto-rebases stacks when parents change, and exposes the incremental diff.

- **Homepage:** https://stacks-bunny.com
- **Callback:** https://stacks-bunny.com/auth
- **Webhook:** https://api.stacks-bunny.com/webhook
- **Repository permissions:** Pull requests — Read & write; Contents — Read & write
- **Organization permissions:** None
- **User permissions:** None
- **Events:** Pull request; Push
- **Core check:** Parse dependency graph → enforce ordering → rebase safely → publish incremental diff
- **Safety boundary:** Rebases are bounded, branch-aware, and never overwrite unrelated work without an explicit authorization policy.

## 8. Cover Me Impressed

**Diff coverage as a first-class GitHub check.** Zero-config ingestion of LCOV/Cobertura reports with a clean result such as “85% of new lines covered,” plus inline annotations instead of noisy SaaS comments.

- **Homepage:** https://cover-me-impressed.io
- **Callback:** https://cover-me-impressed.io/github/callback
- **Webhook:** None required beyond workflow/check events
- **Repository permissions:** Checks — Read & write; Pull requests — Read
- **Organization permissions:** None
- **User permissions:** None
- **Events:** Workflow run; Check run
- **Core check:** Parse coverage artifact → map new lines → calculate diff coverage → annotate
- **Safety boundary:** Missing or malformed coverage data is reported as indeterminate rather than silently converted to pass.

## 9. The Keymaker

**API-key aging and rotation assistant.** Inspects repository/organization secret metadata, surfaces age-based rotation debt, opens configurable issues, and provides one-click rotation runbooks without exposing secret values.

Example finding:

> `OPENAI_API_KEY` is 412 days old.

- **Homepage:** https://the-keymaker.dev
- **Callback:** https://the-keymaker.dev/auth/github
- **Webhook:** https://the-keymaker.dev/webhook
- **Repository permissions:** Secrets — Read; Issues — Read & write
- **Organization permissions:** Secrets — Read
- **User permissions:** None
- **Events:** Repository; primarily scheduled/cron-driven
- **Core check:** Secret metadata → age policy → issue/runbook → rotation workflow
- **Safety boundary:** **Secret values are never retrieved, logged, displayed, or copied.** Metadata-only operation is mandatory.

## 10. FreshPRince of Bel-Repo

**First-contributor onboarding system.** Detects a user's first PR in a repository, posts a guided checklist for CLA/lint/tests/project conventions, validates `good-first-issue` labels, and graduates contributors after a configurable number of merged PRs.

- **Homepage:** https://freshprince-repo.dev
- **Callback:** https://freshprince-repo.dev/auth/callback
- **Webhook:** https://api.freshprince-repo.dev/webhook
- **Repository permissions:** Pull requests — Read & write; Issues — Read & write
- **Organization permissions:** None
- **User permissions:** None
- **Events:** Pull request
- **Core check:** First-contribution detection → checklist → validation → contributor progression
- **Safety boundary:** Keep onboarding helpful rather than punitive; do not expose private contributor history unnecessarily.

---

# Shared architecture

All ten apps can follow a common GitHub App foundation:

```text
GitHub Event
    |
    v
Webhook Receiver
    |
    v
Authentication + Installation Policy
    |
    v
Event Normalizer
    |
    +--> Domain Analyzer
    |       |
    |       +--> Evidence
    |       +--> Decision
    |
    v
Policy / Safety Boundary
    |
    +--> PASS
    +--> FAIL
    +--> INDETERMINATE
    |
    v
GitHub Write Adapter
    |
    v
Checks / Reviews / Issues / PRs
```

## Common engineering principles

1. **Least privilege:** request only the GitHub permissions needed for the specific workflow.
2. **Evidence before action:** every automated decision should have inspectable evidence.
3. **Indeterminate is not pass:** uncertainty must never be promoted into authorization.
4. **Human accountability:** automation can prepare, classify, summarize, and enforce explicit policy; it should not invent authority.
5. **Bounded automation:** retries, rebases, quarantines, and mutations require explicit limits.
6. **Auditability:** record decision IDs, policy versions, timestamps, and relevant GitHub object IDs without storing unnecessary sensitive data.
7. **Reversibility:** destructive or workflow-altering actions need rollback paths.
8. **GitHub-native UX:** prefer Checks, review threads, annotations, labels, and issues over external dashboards for the primary developer feedback loop.

## 2026–2030 roadmap

### 2026 — Foundation

- Establish shared GitHub App authentication and webhook primitives.
- Build deterministic policy/decision interfaces.
- Ship reference implementations for all ten domains.
- Add security-boundary and replay/idempotency tests.

### 2027 — Reliability

- Cross-repository policy packs.
- Installation-level configuration.
- Stronger provenance and evidence trails.
- Operational telemetry without unnecessary source-code retention.

### 2028 — Ecosystem

- Shared event bus and reusable GitHub adapters.
- Organization-level governance templates.
- Open policy schemas.
- Interoperable check-result formats.

### 2029 — Human/agent coordination

- Agent-aware review workflows.
- Explicit authorization boundaries for autonomous actions.
- Contributor trust and provenance primitives.
- Safer multi-agent repository operations.

### 2030 — Developer infrastructure layer

The goal is not ten isolated bots. The long-term objective is a composable **developer reliability layer** in which repository events become trustworthy signals, policies become explicit decisions, and automation operates inside auditable authority boundaries.

---

## Portfolio status

| App | Concept | Reference spec | Production readiness |
|---|---|---|---|
| Promptimus Prime | Defined | This document | Architecture target |
| Nit Picard | Defined | This document | Architecture target |
| Flake It Till You Make It | Defined | This document | Architecture target |
| Unstuck Norris | Defined | This document | Architecture target |
| CODEOWNERS Noah | Defined | This document | Architecture target |
| Debt Vader | Defined | This document | Architecture target |
| The Stacks Bunny | Defined | This document | Architecture target |
| Cover Me Impressed | Defined | This document | Architecture target |
| The Keymaker | Defined | This document | Architecture target |
| FreshPRince of Bel-Repo | Defined | This document | Architecture target |

> These are portfolio/reference concepts unless an individual application repository and deployment explicitly exists. The names, domains, permissions, and architecture are specifications—not claims that the corresponding services are currently deployed.

## License

MIT
