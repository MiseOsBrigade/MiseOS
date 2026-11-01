# Mise Branch Flow Corrections

Default branch: main

| Branch | Ahead | Behind | Open PR | Recommendation | Command |
|---|---:|---:|---|---|---|
| origin | 0 | 0 | none | Aligned | `git checkout origin && git pull --ff-only` |

## Exact base sync
```bash
git fetch --all --prune
git checkout main && git pull --ff-only origin main
```
