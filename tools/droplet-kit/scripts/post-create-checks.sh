#!/usr/bin/env bash
set -Eeuo pipefail
HOST=${1:?Usage: post-create-checks.sh DROPLET_IP}
ssh -o StrictHostKeyChecking=accept-new root@"$HOST" 'cloud-init status --wait && /opt/miseos/bin/healthcheck.sh'
curl -fsS "http://$HOST/api/health" | jq .
curl -fsS "http://$HOST/api/v1/catalog/summary" | jq .
