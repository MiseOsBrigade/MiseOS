#!/usr/bin/env bash
set -euo pipefail

TAG="v0.1.0"
TITLE="Mise PR v0.1.0 — Review packets for pull requests"
NOTES="docs/releases/v0.1.0.md"

git tag -a "$TAG" -m "$TITLE" || true
git push origin "$TAG"

gh release create "$TAG"   --title "$TITLE"   --notes-file "$NOTES"

cat <<'EOF'
Release created.

To publish to GitHub Marketplace:
1. Open the release in GitHub.
2. Edit the release.
3. Select "Publish this Action to the GitHub Marketplace".
4. Choose Code quality + Utilities.
5. Save/publish.
EOF
