#!/usr/bin/env bash
set -euo pipefail

DEST_REPO="${DEST_REPO:-MiseOsBrigade/Mise-Orchestra}"
BRANCH="${BRANCH:-main}"
COMMIT_MESSAGE="${COMMIT_MESSAGE:-chore: import Mise Orchestra from Replit}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required but was not found."
  exit 1
fi

if [ ! -d .git ]; then
  git init
fi

# Safety: avoid committing common secret files.
cat > .gitignore <<'GITIGNORE'
node_modules/
.pnpm-store/
.yarn/
build/
dist/
.next/
.nuxt/
.out/
coverage/
__pycache__/
*.py[cod]
.venv/
venv/
.env
.env.*
!.env.example
.cache/
.upm/
.config/
.local/
*.pem
*.key
*.p12
*.pfx
*service-account*.json
secrets.json
*.log
.DS_Store
.vscode/
.idea/
GITIGNORE

# Show tracked candidate files before committing.
echo "Reviewing files to be committed..."
git status --short

git add .

if git diff --cached --quiet; then
  echo "No files staged. Nothing to copy."
  exit 0
fi

git commit -m "$COMMIT_MESSAGE"
git branch -M "$BRANCH"

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "https://github.com/${DEST_REPO}.git"
else
  git remote add origin "https://github.com/${DEST_REPO}.git"
fi

echo "Pushing to https://github.com/${DEST_REPO}.git on branch ${BRANCH}..."
git push -u origin "$BRANCH"
