#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-.}"
FORCE="${MISEOS_FORCE:-0}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAYLOAD="$HERE/payload"
while IFS= read -r -d '' src; do
  rel="${src#"$PAYLOAD/"}"
  dst="$TARGET/$rel"
  mkdir -p "$(dirname "$dst")"
  if [[ -e "$dst" ]]; then
    if cmp -s "$src" "$dst"; then
      echo "Already present: $rel"
      continue
    fi
    if [[ "$FORCE" != "1" ]]; then
      echo "Conflict: $dst exists with different content. Set MISEOS_FORCE=1 to overwrite." >&2
      exit 2
    fi
  fi
  cp "$src" "$dst"
done < <(find "$PAYLOAD" -type f -print0 | sort -z)
echo "Installed registry-attestation-gate into $TARGET"
