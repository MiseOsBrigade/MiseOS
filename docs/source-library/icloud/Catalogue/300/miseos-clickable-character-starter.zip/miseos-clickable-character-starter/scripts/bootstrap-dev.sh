#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
command -v node >/dev/null || { echo "Node.js 20+ is required"; exit 1; }
command -v npm >/dev/null || { echo "npm is required"; exit 1; }
cd "$ROOT_DIR"
npm install
node scripts/gen-registry-sha256.mjs
node scripts/validate-manifest.mjs
if [ ! -f .env ]; then
cat > .env <<'EOF'
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
WALLET_MODE=none
RPC_URL=
NFT_CONTRACT_ADDRESS=
AMPLITUDE_API_KEY=
ONEGATE_NETWORK=testnet
EOF
fi
echo "Bootstrap complete. Run: npm run dev"
