# Release Integrity Playbook

## Component release

1. Run CI, CodeQL/dependency gates, repository governance, and the MiseOS Release Sentinel.
2. Build final release artifacts once.
3. Generate SBOM/provenance attestations for distributable artifacts or container images.
4. Create the GitHub release as a **draft**.
5. Attach every final asset to the draft.
6. Review checksums, release notes, and artifact inventory.
7. Publish the release only after all assets are final.

When immutable releases are enabled for the repository or organization, publication locks the associated tag and release assets. Treat deletion as exceptional governance work, not part of normal release automation.

## System release for polyrepo systems

Keep component versions independent. The integration repository records a system release manifest that pins each component to an immutable tag or SHA. Validate the composed system, then tag the integration manifest separately, such as `system-2026.08.14`.

## Verification

Consumers should verify release integrity and build attestations before trusting downloaded artifacts. Record verification results in deployment evidence for production promotion.
