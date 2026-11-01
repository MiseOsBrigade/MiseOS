# MiseOS Registry Analytics

Generated: 2026-07-02T23:53:30.835Z

## Summary

- Manifests: 21
- High risk: 5
- Medium risk: 4
- Low risk: 12
- High-risk ratio: 0.238
- All manifests complete: true
- All trust gates enabled: true

## Artifacts by registry

- npm: 13
- container: 4
- repo: 2
- script: 1
- docs: 1
- data: 1
- gradle: 1
- maven: 1
- nuget: 1
- rubygems: 1

## Risk matrix

| Artifact | Type | Score | Level | Reasons |
|---|---:|---:|---|---|
| miseos.agent-sdk | sdk | 6 | low | baseline |
| miseos.analytics-engine | analytics | 8 | low | baseline |
| miseos.attestation-gate | policy | 29 | low | network access required |
| miseos.cli | package | 8 | low | baseline |
| miseos.docs-builder | container | 63 | high | write permission requested; GitHub Pages write access; not autonomous-safe; approved write execution mode |
| miseos.docs-hub-template | template | 70 | high | write permission requested; GitHub Pages write access; not autonomous-safe; approved write execution mode; mutating capability present |
| miseos.git-command-layer | package | 71 | high | write permission requested; network access required; not autonomous-safe; approved write execution mode |
| miseos.gradle-plugin | package | 7 | low | baseline |
| miseos.maven-policy-adapter | package | 7 | low | baseline |
| miseos.nuget-client | sdk | 7 | low | baseline |
| miseos.policy-checker | container | 56 | medium | write permission requested; security events write access; not autonomous-safe |
| miseos.policy-engine | policy | 58 | medium | write permission requested; security events write access; not autonomous-safe |
| miseos.registry-schema | schema | 50 | medium | write permission requested; not autonomous-safe; mutating capability present |
| miseos.release-sentinel | agent | 87 | high | write permission requested; network access required; not autonomous-safe; approved write execution mode; mutating capability present |
| miseos.repo-steward | agent | 11 | low | baseline |
| miseos.ruby-steward | package | 8 | low | baseline |
| miseos.runner | container | 14 | low | baseline |
| miseos.sbom-indexer | agent | 26 | low | network access required |
| miseos.trust-graph | analytics | 10 | low | baseline |
| miseos.workflow-linter | agent | 57 | medium | write permission requested; security events write access; not autonomous-safe |
| miseos.workflow-pack | workflow | 100 | high | write permission requested; OIDC token minting allowed; artifact attestation writes allowed; security events write access; network access required; not autonomous-safe; approved write execution mode; mutating capability present |

## Operational tiers

- developer-tooling: 4
- autonomy: 2
- governance: 7
- expansion: 5
- bootstrap: 2
- runtime: 1
