# Merge & PR

![Merge & PR station](./assets/logo.svg)

## Station name

**Expediter Merge Station**

## What it does

Compares PR readiness, verifies gates, and only applies merge behavior when explicitly requested.

## Command

```bash
/mise merge-pr
/mise merge-pr apply
```

## Manual trigger

```bash
gh workflow run "Mise Repo Steward" -f mode=merge-pr -f target_number=12 -f apply_changes=true
```

## Safety rules

- Blocks fork PR auto-merge.
- Blocks auto-merge when `.github/workflows/` or `.github/actions/` files change.
- Uses apply-only write behavior.

See [`COMPARE.md`](./COMPARE.md) and [`tools.json`](./tools.json).
