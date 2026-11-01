# Repo Clean

![Repo Clean station](./assets/logo.svg)

## Station name

**Dish Pit Cleanup Station**

## What it does

Produces repo health reports, cleanup suggestions, and generated cleanup PRs without untrusted privileged execution.

## Command

```bash
/mise repo-clean
/mise repo-clean apply
```

## Manual trigger

```bash
gh workflow run "Mise Repo Steward" -f mode=repo-clean -f apply_changes=true
```

## Learning value

This station shows how cleanup can stay productive without becoming silent, recursive, or over-privileged automation.

See [`COMPARE.md`](./COMPARE.md) and [`tools.json`](./tools.json).
