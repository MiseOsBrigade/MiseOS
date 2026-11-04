#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <item-id> [target-directory]" >&2
  echo "Run $ROOT/list-items.sh to see item IDs." >&2
  exit 64
fi
ITEM="$1"; TARGET="${2:-.}"
SCRIPT="$ROOT/items/$ITEM/install.sh"
if [[ ! -x "$SCRIPT" ]]; then echo "Unknown item: $ITEM" >&2; exit 65; fi
exec "$SCRIPT" "$TARGET"
