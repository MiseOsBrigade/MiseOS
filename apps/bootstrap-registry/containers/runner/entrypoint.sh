#!/usr/bin/env bash
set -euo pipefail
if [[ $# -eq 0 ]]; then
  echo "MiseOS Runner ready. Mount repo at /workspace and pass a command."
  exit 0
fi
exec "$@"
