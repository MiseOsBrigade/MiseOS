#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-}"
if [[ -z "$TARGET" || ! -d "$TARGET" ]]; then
  echo "Usage: ./apply-upgrade.sh /path/to/repo" >&2
  exit 2
fi
rsync -a --exclude '.git' ./ "$TARGET"/
cd "$TARGET"
python scripts/mise/skill_pack_index.py --root vendor/nv-skills --out-dir .mise_out --fail-on-empty
python scripts/mise/validate_skill_pack.py --root vendor/nv-skills --out .mise_out/skill-pack-validation.json
