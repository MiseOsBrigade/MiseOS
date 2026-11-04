#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-}"

if [[ -z "$TARGET_DIR" ]]; then
  echo "Usage: ./scripts/install-brand-kit.sh /path/to/mise-brigade-de-repo"
  exit 1
fi

if [[ ! -d "$TARGET_DIR/.git" ]]; then
  echo "Target must be the root of a git repository: $TARGET_DIR"
  exit 1
fi

mkdir -p "$TARGET_DIR/brand"
rsync -av --exclude ".DS_Store" --exclude "*.zip" ./ "$TARGET_DIR/brand/"

cat <<'MSG'

Brand kit copied into ./brand.

Next safe steps:
  git status
  open brand/index.html
  review README snippets
  git add brand
  git commit -m "brand: add Mise Brigade de Repo chef-code kit"

No push was performed.

MSG
