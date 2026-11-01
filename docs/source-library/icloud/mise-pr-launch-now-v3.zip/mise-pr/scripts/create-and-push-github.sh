#!/usr/bin/env bash
set -euo pipefail

OWNER="${GITHUB_OWNER:-DeontewattsV1}"
REPO="${GITHUB_REPO:-mise-pr}"
DESCRIPTION="Pull requests prepped before review."

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI is required: https://cli.github.com/"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  gh auth login
fi

if [ ! -d .git ]; then
  git init
fi

git add .
if ! git diff --cached --quiet; then
  git commit -m "Launch Mise PR"
fi

# Create and push the repo. If it already exists, connect origin and push.
if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  git remote remove origin >/dev/null 2>&1 || true
  git remote add origin "https://github.com/$OWNER/$REPO.git"
  git branch -M main
  git push -u origin main
else
  gh repo create "$OWNER/$REPO"     --public     --description "$DESCRIPTION"     --source=.     --remote=origin     --push
fi

echo "Published: https://github.com/$OWNER/$REPO"
