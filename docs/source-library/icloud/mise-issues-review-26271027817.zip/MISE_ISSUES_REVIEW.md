# Mise Issues & Review

Repository: DeontewattsV1/mise-brigade-de-repo
Target: 1
Default branch: main
Run: https://github.com/DeontewattsV1/mise-brigade-de-repo/actions/runs/26271027817

## Gates
No package.json detected; Node gates skipped.
## Open PRs

## Open issues

## Exact local commands
```bash
git fetch --all --prune
git checkout main && git pull --ff-only origin main
npm ci && npm run typecheck --if-present && npm run test --if-present && npm run build --if-present && npm run lint --if-present
```
