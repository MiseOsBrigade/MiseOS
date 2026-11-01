# Comments & Commits

![Comments & Commits station](./assets/logo.svg)

## Station name

**Line Notes Commit Station**

## What it does

Turns comments, commits, and review notes into digestible repository context with safe apply-only write behavior.

## Command

```bash
/mise comments-commits
/mise comments-commits apply
```

## Manual trigger

```bash
gh workflow run "Mise Repo Steward" -f mode=comments-commits -f target_number=12 -f apply_changes=true
```

## Learning value

This station helps people understand why repository history matters before the next branch or merge move.

See [`COMPARE.md`](./COMPARE.md) and [`tools.json`](./tools.json).
