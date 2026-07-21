#!/usr/bin/env bash
set -euo pipefail
contract_dir="contracts/proof-registry"
if command -v forge >/dev/null 2>&1; then
  (cd "$contract_dir" && forge fmt --check && forge build && forge test)
else
  echo "Foundry is not installed; Solidity compile/tests were skipped."
  echo "Install Foundry before deployment or rely on the contracts GitHub Actions workflow."
fi
