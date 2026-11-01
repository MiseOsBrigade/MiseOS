# MiseOS Publishing Playbook

## Launch order

1. Validate registry data.
2. Publish `ghcr.io/mise-os/miseos-runner`.
3. Publish `ghcr.io/mise-os/miseos-policy-checker`.
4. Publish `ghcr.io/mise-os/miseos-docs-builder`.
5. Publish `@mise-os/cli`.
6. Publish `@mise-os/agent-sdk`.
7. Publish `@mise-os/policy-engine`.
8. Publish `@mise-os/release-sentinel`.
9. Enable scheduled Release Sentinel reports.
10. Expand NuGet, RubyGems, Maven, and Gradle lanes.

## Rules

- Never silently upgrade mutation-capable packages.
- Human review is required for permission, network, source, and major-version changes.
- Every package must have a manifest, trust metadata, analytics tier, and agent contract.
- Prefer GHCR + npm + NuGet + RubyGems for strongest package-level permission control.
- Treat Maven and Gradle lanes as repository-scoped.
