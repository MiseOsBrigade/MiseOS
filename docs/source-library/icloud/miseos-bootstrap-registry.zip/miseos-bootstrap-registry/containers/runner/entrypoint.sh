#!/usr/bin/env bash
set -euo pipefail

case "${1:-doctor}" in
  doctor)
    node --version
    git --version
    jq --version
    ;;
  validate)
    node scripts/validate-registry.mjs
    ;;
  policy)
    node packages/policy-engine/src/index.js
    ;;
  *)
    exec "$@"
    ;;
esac
