#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
for repo in "$ROOT"/repos/*; do
  if [ -f "$repo/package.json" ]; then
    echo "==> Testing $(basename "$repo")"
    (cd "$repo" && npm test)
  fi
done
echo "All configured repository tests passed."
