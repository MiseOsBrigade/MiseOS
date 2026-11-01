#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-$(pwd)}"

echo "Installing Mise Enhanced GPU Pack-a-Punch Workflow Machine into: ${TARGET_DIR}"

mkdir -p "${TARGET_DIR}/.github/workflows" "${TARGET_DIR}/.github/mise" "${TARGET_DIR}/scripts" "${TARGET_DIR}/scripts/mise" "${TARGET_DIR}/docs" "${TARGET_DIR}/examples"

cp "${SOURCE_DIR}/.github/workflows/mise-pack-a-punch.yml" "${TARGET_DIR}/.github/workflows/"
cp "${SOURCE_DIR}/.github/workflows/mise-gpu-complexity-runner.yml" "${TARGET_DIR}/.github/workflows/"
cp "${SOURCE_DIR}/.github/workflows/mise-stack-consumer.example.yml" "${TARGET_DIR}/.github/workflows/"
cp "${SOURCE_DIR}/.github/workflows/mise-gpu-reusable-job.yml" "${TARGET_DIR}/.github/workflows/"

cp "${SOURCE_DIR}/.github/mise/mise-policy.json" "${TARGET_DIR}/.github/mise/"
cp "${SOURCE_DIR}/.github/mise/gpu-policy.json" "${TARGET_DIR}/.github/mise/"

cp "${SOURCE_DIR}"/scripts/*.mjs "${TARGET_DIR}/scripts/"
cp "${SOURCE_DIR}"/scripts/mise/*.py "${TARGET_DIR}/scripts/mise/"
cp "${SOURCE_DIR}"/scripts/mise/*.sh "${TARGET_DIR}/scripts/mise/"
chmod +x "${TARGET_DIR}/scripts/mise/"*.sh 2>/dev/null || true

cp -R "${SOURCE_DIR}/docs/." "${TARGET_DIR}/docs/"
cp -R "${SOURCE_DIR}/examples/." "${TARGET_DIR}/examples/"

echo "Installed."
echo ""
echo "Next:"
echo "  git checkout -b ci/mise-enhanced-gpu-pack-a-punch"
echo "  git add .github scripts docs examples"
echo "  git commit -m 'Add Mise enhanced GPU Pack-a-Punch workflow machine'"
echo "  git push -u origin ci/mise-enhanced-gpu-pack-a-punch"
