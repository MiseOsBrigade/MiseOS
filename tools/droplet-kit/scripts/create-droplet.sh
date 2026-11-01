#!/usr/bin/env bash
set -Eeuo pipefail
ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
NAME=miseos-core-01; REGION=sfo3; SIZE=s-4vcpu-8gb; IMAGE=ubuntu-24-04-x64; SSH_KEY=""; BACKUPS=false
while (($#)); do
  case "$1" in
    --name) NAME=$2; shift 2;; --region) REGION=$2; shift 2;; --size) SIZE=$2; shift 2;;
    --image) IMAGE=$2; shift 2;; --ssh-key) SSH_KEY=$2; shift 2;; --enable-backups) BACKUPS=true; shift;;
    -h|--help) echo "Usage: $0 --ssh-key FINGERPRINT [--name N --region R --size S --image I --enable-backups]"; exit 0;;
    *) echo "Unknown argument: $1" >&2; exit 2;;
  esac
done
command -v doctl >/dev/null || { echo 'doctl is required' >&2; exit 1; }
[[ -n "$SSH_KEY" ]] || { echo '--ssh-key is required' >&2; exit 2; }
TMP=$(mktemp); trap 'rm -f "$TMP"' EXIT
"$ROOT/scripts/render-user-data.sh" >"$TMP"
args=(compute droplet create "$NAME" --region "$REGION" --size "$SIZE" --image "$IMAGE" --ssh-keys "$SSH_KEY" --tag-names miseos,mise-core,production --enable-monitoring --enable-private-networking --enable-ipv6 --user-data-file "$TMP" --wait)
$BACKUPS && args+=(--enable-backups)
doctl "${args[@]}"
