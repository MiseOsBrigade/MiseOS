# MiseOS Registry Analytics Model

The analytics model converts registry manifests into operational intelligence.

## Metrics

| Metric | Meaning |
|---|---|
| Manifest completeness | Whether the manifest answers all required registry questions. |
| Trust compliance | Whether license, SBOM, provenance, signed release, attestation, and Scorecard gates are enabled. |
| Permission surface | Flattened GitHub permission requests, grouped by action surface. |
| Risk score | Weighted score based on declared criticality, write access, network access, autonomous safety, and mutating capabilities. |
| Registry coverage | Number of artifacts published to GHCR, npm, NuGet, RubyGems, Maven, Gradle, and repo template lanes. |

## Risk scoring

The starter scorer is intentionally conservative:

- write permission increases risk
- network access increases risk
- non-autonomous-safe execution increases risk
- OIDC, attestations, security events, and Pages writes increase risk
- missing provenance, artifact attestations, or Scorecard gates increase risk

Scores are not claims of absolute safety. They are triage signals for review.
