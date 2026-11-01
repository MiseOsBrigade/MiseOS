# MiseOS Bootstrap Registry Launch Plan

## Phase 1 — Bootstrap

1. Create the repository.
2. Commit the registry index, schemas, manifests, and validation workflow.
3. Run `pnpm validate` locally.
4. Enable branch protection after the first green workflow.

## Phase 2 — Runtime

1. Build `miseos-runner` locally.
2. Publish to GHCR through the `publish-container.yml` workflow.
3. Validate container execution with `docker run`.

## Phase 3 — Developer tools

1. Publish `@miseos/cli`.
2. Publish `@miseos/agent-sdk`.
3. Publish `@miseos/policy-engine`.
4. Install the CLI in a second repository and validate remote consumption.

## Phase 4 — Autonomy

1. Run Release Sentinel in dry-run mode.
2. Confirm reports are deterministic.
3. Allow automated PR creation.
4. Keep merge approval human-controlled.

## Phase 5 — Expansion

1. Add RubyGems helper lane.
2. Add Maven/Gradle JVM policy lane.
3. Add NuGet client lane.
4. Add external registry diff adapters.
