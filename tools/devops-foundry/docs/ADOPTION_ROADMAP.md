# MiseOS DevOps Adoption Roadmap

## Phase 1 — Standardize and observe

Adopt the reusable CI baseline, CodeQL, dependency review, repository governance checks, explicit permissions, Dependabot for Actions, and workflow telemetry conventions. Remove duplicate/broken workflows before adding new automation.

## Phase 2 — Package and release integrity

Publish packages and containers through GitHub Packages/GHCR, add provenance attestations, introduce Release Sentinel gates, and enable immutable release policy where available. Keep release assets final before publication.

## Phase 3 — Polyrepo platform interface

Move shared workflows into a protected platform repository with semantic versions. Add a thin integration repository containing only manifests, integration tests, and system-release CI. Use change-set identifiers across issues, branches, PRs, and telemetry.

## Phase 4 — Governed agentic workflows

Initialize `gh-aw` only after deterministic workflows are stable. Give agents read-only permissions by default, narrow tools/network access, explicit safe outputs, and no bypass of repository rulesets or CODEOWNERS. Start with reporting/triage, then controlled PR generation.

## Phase 5 — Enterprise operations

Add runner groups/ARC as required, centralized audit/telemetry pipelines, security campaigns, SLA tracking, package provenance verification, AI-credit/Actions cost controls, and organization-wide policy baselines.
