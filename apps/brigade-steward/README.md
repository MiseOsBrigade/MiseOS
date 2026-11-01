<p align="center">
  <img src="brand/assets/svg/readme-hero-banner.svg" alt="Mise Brigade de Repo hero banner" width="100%"/>
</p>

# Mise Brigade de Repo

**Chef-coded stewardship for clean repositories.**

Mise Repo Steward v2 with safer automation boundaries, better branch intelligence, PR merge gates, repo health reporting, and generated cleanup PRs.

This repository is part of the **Mise en Place Hub**: every workflow has a station, every branch has a plate, and every write action has a safety gate.

<p align="center">
  <img src="brand/assets/svg/badge-mise-steward.svg" alt="Mise Steward"/>
</p>

---

## The brigade cooking code together

| Station | Learning folder | What it cooks | Trusted command |
|---|---|---|---|
| <img src="docs/actions/issues-review/assets/logo.svg" alt="Issues and Review" width="190"/> | [`docs/actions/issues-review`](docs/actions/issues-review/) | Issue and PR triage before action. | `/mise issue-review` |
| <img src="docs/actions/merge-pr/assets/logo.svg" alt="Merge and PR" width="190"/> | [`docs/actions/merge-pr`](docs/actions/merge-pr/) | PR readiness, merge gates, and apply-only merge routing. | `/mise merge-pr` |
| <img src="docs/actions/branch-corrections/assets/logo.svg" alt="Branch Corrections" width="190"/> | [`docs/actions/branch-corrections`](docs/actions/branch-corrections/) | Branch drift checks and next exact branch recommendation. | `/mise branch-corrections` |
| <img src="docs/actions/comments-commits/assets/logo.svg" alt="Comments and Commits" width="190"/> | [`docs/actions/comments-commits`](docs/actions/comments-commits/) | Converts comments and commits into digestible repo context. | `/mise comments-commits` |
| <img src="docs/actions/repo-clean/assets/logo.svg" alt="Repo Clean" width="190"/> | [`docs/actions/repo-clean`](docs/actions/repo-clean/) | Repo cleanup reports, safe suggestions, and generated cleanup PR paths. | `/mise repo-clean` |

## Why this is hardened

- Uses `GITHUB_TOKEN` with scoped job-level permissions.
- Avoids `pull_request_target`.
- Avoids PAT recursion.
- Avoids push-trigger recursion patterns.
- Adds `[skip ci]` on generated commits.
- Uses trusted-collaborator comment routing.
- Performs write actions only when `apply` is explicitly requested.
- Blocks fork PR auto-merge.
- Blocks auto-merge when `.github/workflows/` or `.github/actions/` files are changed.

## Trusted issue and PR comment commands

```bash
/mise issue-review
/mise merge-pr
/mise merge-pr apply
/mise branch-corrections
/mise branch-corrections apply
/mise comments-commits
/mise comments-commits apply
/mise repo-clean
/mise repo-clean apply
```

## Manual CLI triggers

```bash
gh workflow run "Mise Repo Steward" -f mode=issues-review -f target_number=12
gh workflow run "Mise Repo Steward" -f mode=merge-pr -f target_number=12 -f apply_changes=true
gh workflow run "Mise Repo Steward" -f mode=branch-corrections -f apply_changes=true
gh workflow run "Mise Repo Steward" -f mode=comments-commits -f target_number=12 -f apply_changes=true
gh workflow run "Mise Repo Steward" -f mode=repo-clean -f apply_changes=true
```

## Brand and design files

| Path | Purpose |
|---|---|
| [`brand/assets/svg`](brand/assets/svg/) | Hero banner, badge, and repo-level visual system. |
| [`brand/brand.tokens.json`](brand/brand.tokens.json) | Color, voice, naming, and mode tokens. |
| [`brand/brand.css`](brand/brand.css) | CSS variables for docs or web surfaces. |
| [`docs/actions`](docs/actions/) | One comparison and learning folder per stewardship action. |

## Repository setup commands

```bash
mkdir -p .github/workflows
cp mise-repo-steward.yml .github/workflows/mise-repo-steward.yml

git add .github/workflows/mise-repo-steward.yml
git commit -m "ci: upgrade Mise Repo Steward workflow"
git push origin main
```

## Operating principle

Everything in its place: branch flow, steward checks, safe automation, readable repo rituals.
