# MiseOS Registry Dashboard

**Status:** PASS  
**Generated:** 2026-07-02T23:53:30.938Z

## Bootloader

`registry → runtime → CLI → policy engine → release sentinel → analytics → autonomous updates`

## Key metrics

| Metric | Value |
|---|---:|
| Manifests | 21 |
| Core artifacts | 21 |
| High risk | 5 |
| Medium risk | 4 |
| Low risk | 12 |
| High-risk ratio | 0.238 |
| All trust gates enabled | true |
| All manifests complete | true |

## Registry coverage

| Registry lane | Artifacts |
|---|---:|
| container | 4 |
| data | 1 |
| docs | 1 |
| gradle | 1 |
| maven | 1 |
| npm | 13 |
| nuget | 1 |
| repo | 2 |
| rubygems | 1 |
| script | 1 |

## Risk matrix

| Artifact | Type | Risk | Level |
|---|---|---:|---|
| miseos.workflow-pack | workflow | 100 | high |
| miseos.release-sentinel | agent | 87 | high |
| miseos.git-command-layer | package | 71 | high |
| miseos.docs-hub-template | template | 70 | high |
| miseos.docs-builder | container | 63 | high |
| miseos.policy-engine | policy | 58 | medium |
| miseos.workflow-linter | agent | 57 | medium |
| miseos.policy-checker | container | 56 | medium |
| miseos.registry-schema | schema | 50 | medium |
| miseos.attestation-gate | policy | 29 | low |
| miseos.sbom-indexer | agent | 26 | low |
| miseos.runner | container | 14 | low |
| miseos.repo-steward | agent | 11 | low |
| miseos.trust-graph | analytics | 10 | low |
| miseos.analytics-engine | analytics | 8 | low |
| miseos.cli | package | 8 | low |
| miseos.ruby-steward | package | 8 | low |
| miseos.gradle-plugin | package | 7 | low |
| miseos.maven-policy-adapter | package | 7 | low |
| miseos.nuget-client | sdk | 7 | low |
| miseos.agent-sdk | sdk | 6 | low |

## Permission hotspots

| Permission | Count |
|---|---:|
| github.contents:read | 16 |
| github.packages:read | 8 |
| github.contents:write | 4 |
| github.security-events:write | 4 |
| github.pages:write | 2 |
| github.packages:write | 2 |
| github.attestations:read | 1 |
| filesystem.0:read | 1 |
| filesystem.1:write_via_git | 1 |
| github.0:repository_access_via_user_git_credentials | 1 |
| network.0:git_remote_when_pull_or_push | 1 |
| github.pull-requests:write | 1 |
| github.metadata:read | 1 |
| github.attestations:write | 1 |
| github.id-token:write | 1 |

## Next actions

1. Keep mutation-capable artifacts in approved-write mode.
2. Publish GHCR runner first, then CLI and policy engine.
3. Run `pnpm verify` before publishing any package.
4. Require human review for permission, network, and major-version changes.
