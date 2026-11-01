# GitHub Delivery Baseline — 2026-08-14

The normalized templates were checked against current official GitHub/action repositories before packaging.

## Current major baselines used by this bundle

- `actions/checkout@v7`
- `actions/setup-node@v7`
- `actions/setup-python@v6`
- `actions/configure-pages@v6`
- `actions/upload-pages-artifact@v5`
- `actions/deploy-pages@v5`
- `actions/dependency-review-action@v5`
- `github/codeql-action/*@v4`
- `actions/attest@v4`
- `docker/login-action@v4`
- `docker/metadata-action@v6`
- `docker/build-push-action@v7`

For higher-assurance environments, replace major tags with reviewed commit SHAs and automate controlled updates. The project scanner records action refs so drift can be detected.

## Release integrity

GitHub immutable releases lock the release tag and assets after publication and create a release attestation. The safe publication sequence is draft release -> attach all assets -> publish. This bundle therefore treats release creation and release integrity as governance concerns rather than providing a workflow that mutates an already-published immutable release.

## Artifact attestations

`actions/attest@v4` is the current recommended action for new attestation implementations. The GHCR workflow in this bundle generates provenance for the pushed image digest and sends the attestation to the registry.

## Agentic workflows

GitHub Agentic Workflows (`gh-aw`) are still public preview. The Markdown sources in `templates/agentic/` are intentionally not shipped with generated `.lock.yml` files; compile and inspect them in the target repository with the installed `gh aw` version.
