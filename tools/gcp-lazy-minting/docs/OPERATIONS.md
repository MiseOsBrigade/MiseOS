# Operations

## Upload contract

Images must be uploaded under:

```text
incoming/images/<token-id-padded>-<slug>.<extension>
```

Example:

```text
incoming/images/001-tariq-notesmith.png
```

Sidecars use:

```text
incoming/metadata-overrides/001-tariq-notesmith.json
```

## Reveal process

1. Generate draft metadata with `Cache-Control: no-store`.
2. Review image digest, traits, name, description, and external URL.
3. Copy the approved metadata and image objects into a release snapshot:
   `audit/releases/<version>/`.
4. Change metadata object cache control to:
   `public, max-age=3600, must-revalidate`.
5. Record the release manifest SHA-256 in Git and, when required, on-chain.

## Rollback

Cloud Storage object versioning is enabled. Rollback means restoring a previous generation, not silently editing the audit history. Record every rollback in `audit/events/`.

## Failure handling

Invalid filenames are copied into `quarantine/`. Function errors should be routed to Cloud Logging alerts. Reprocess only after correcting the source file or sidecar.
