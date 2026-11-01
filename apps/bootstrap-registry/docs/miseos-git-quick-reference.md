# MiseOS Git Quick Reference

| Task | MiseOS | Git underneath |
|---|---|---|
| New repo | `miseos repo init` | `git init` |
| Clone repo | `miseos repo clone <url>` | `git clone <url>` |
| Status | `miseos repo status` | `git status --short --branch` |
| Stage all | `miseos prep stage .` | `git add .` |
| Commit | `miseos prep commit -m "msg"` | `git commit -m "msg"` |
| Pull safely | `miseos sync pull origin main` | `git pull --ff-only origin main` |
| Push | `miseos dispatch push origin main` | `git push origin main` |
| Stash | `miseos hold stash "msg"` | `git stash push -m "msg"` |
| Pop stash | `miseos hold pop` | `git stash pop` |
| Cherry-pick | `miseos pick commit <hash>` | `git cherry-pick <hash>` |
| Revert | `miseos undo commit <hash>` | `git revert <hash>` |
| Soft reset | `miseos rewind soft HEAD~1` | `git reset --soft HEAD~1` |
| Hard reset | `miseos rewind hard HEAD~1 --confirm-hard` | `git reset --hard HEAD~1` |
| Rebase | `miseos align rebase main --confirm-rewrite` | `git rebase main` |
| Log graph | `miseos trace log` | `git log --graph --oneline --decorate --all` |
| Reflog | `miseos trace reflog` | `git reflog` |
| Tag release | `miseos release tag v0.1.0` | `git tag -a v0.1.0 -m "Release v0.1.0"` |
