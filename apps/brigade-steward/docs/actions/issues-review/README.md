# Issues & Review

![Issues & Review station](./assets/logo.svg)

## Station name

**Saucier Triage Station**

## What it does

Reviews open issues and PR context, extracts risk, and returns precise next steps before anything gets merged.

## Command

```bash
/mise issue-review
```

## Manual trigger

```bash
gh workflow run "Mise Repo Steward" -f mode=issues-review -f target_number=12
```

## Safety rules

- Uses `GITHUB_TOKEN` rather than personal access token recursion.
- Keeps job permissions scoped to the mode.
- Avoids `pull_request_target` for untrusted fork code.
- Routes write behavior through explicit `apply` commands only.

See [`COMPARE.md`](./COMPARE.md) and [`tools.json`](./tools.json).
