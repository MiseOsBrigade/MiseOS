#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
printf '%-38s %-20s %s
' ITEM CATEGORY TITLE
python3 - "$ROOT/catalog-items.json" <<'PYLIST'
import json,sys
for x in json.load(open(sys.argv[1]))['items']:
    print(f"{x['id']:<38} {x['category']:<20} {x['title']}")
PYLIST
