# Release process

## Versioning

Use semantic versioning:

- major: breaking API, schema, policy, or storage changes
- minor: backward-compatible capabilities
- patch: backward-compatible fixes and documentation

Pre-1.0 releases may contain breaking changes in minor versions, but every break must be documented.

## Standard release

1. Merge reviewed changes with a Changeset.
2. CI validates formatting, tests, builds, docs, contracts, and security checks.
3. Release automation prepares version and changelog updates.
4. Maintainer reviews and merges the release PR.
5. Create signed tag `vX.Y.Z` and GitHub Release.
6. Publish packages only after provenance and SBOM generation.
7. Verify artifacts, tags, checksums, and release notes.

## Release notes

Include:

- summary and user impact
- added, changed, fixed, deprecated, and security sections
- migration steps
- configuration changes
- contract addresses and verification links when applicable
- known limitations and rollback guidance

## Emergency release

Security patches may use an expedited branch and review, but must still run automated tests, document the vulnerability privately, produce a signed release, and backfill the changelog and post-incident notes.
