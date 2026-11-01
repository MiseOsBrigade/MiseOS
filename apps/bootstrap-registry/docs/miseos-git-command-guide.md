# MiseOS Git Command Guide

MiseOS keeps Git intact, but wraps it in operational language that matches the Mise Orchestra model: prepare, cook, orchestrate, deploy, and recover.

## Command grammar

```txt
miseos <station> <action> [arguments] [safety flags]
```

The Git command is still the source of truth. MiseOS commands are safe aliases with better defaults.

## Basic commands

| Git command | MiseOS command | Kitchen meaning | Default safety |
|---|---|---|---|
| `git init` | `miseos repo init` | Open a new kitchen | Safe |
| `git clone <url>` | `miseos repo clone <url>` | Copy a kitchen station | Safe |
| `git status` | `miseos repo status` | Check the station board | Uses `--short --branch` |
| `git add .` | `miseos prep stage .` | Put ingredients on the prep rail | Explicit paths supported |
| `git commit -m` | `miseos prep commit -m` | Plate a finished unit of work | Requires message |
| `git pull` | `miseos sync pull` | Sync incoming orders | Uses `--ff-only` by default |
| `git push` | `miseos dispatch push` | Send the finished dish out | No force by default |

## Advanced commands

| Git command | MiseOS command | Purpose | Safety |
|---|---|---|---|
| `git stash push -m` | `miseos hold stash` | Temporarily shelve work | Low risk |
| `git stash list` | `miseos hold list` | List held work | Read-only |
| `git stash pop` | `miseos hold pop` | Restore held work | Medium risk |
| `git cherry-pick` | `miseos pick commit` | Apply one commit | Medium risk |
| `git revert` | `miseos undo commit` | Safely undo shared work | Preferred for public history |
| `git reset --soft` | `miseos rewind soft` | Reopen commits, keep staged | Medium risk |
| `git reset --mixed` | `miseos rewind mixed` | Reopen commits, keep unstaged | Medium risk |
| `git reset --hard` | `miseos rewind hard --confirm-hard` | Discard local work | High risk, blocked by default |
| `git rebase` | `miseos align rebase --confirm-rewrite` | Rebuild linear history | High risk, explicit confirmation |
| `git reflog` | `miseos trace reflog` | Find lost movement | Read-only |
| `git tag -a` | `miseos release tag` | Mark release point | Medium risk |

## Basic workflow

```bash
miseos repo status
miseos sync pull origin main
miseos prep stage .
miseos prep commit -m "feat: add registry command layer"
miseos dispatch push origin main
```

## Feature branch workflow

```bash
git checkout -b feature/git-command-layer
miseos prep stage docs/miseos-git-command-guide.md scripts/mise-git.mjs
miseos prep commit -m "feat: add MiseOS git command layer"
miseos dispatch push origin feature/git-command-layer
```

MiseOS intentionally keeps `git checkout -b` unchanged for now. Branch creation remains a direct Git primitive until the branch policy engine is attached.

## Hotfix workflow

```bash
miseos hold stash "pause current work"
git checkout main
miseos sync pull origin main
git checkout -b hotfix/registry-validation
miseos prep stage .
miseos prep commit -m "fix: repair registry validation"
miseos dispatch push origin hotfix/registry-validation
git checkout feature/current-work
miseos hold pop
```

## Revert, do not rewrite, on shared branches

```bash
miseos undo commit HEAD
miseos dispatch push origin main
```

Use this instead of hard reset on public/shared history.

## Dangerous commands require flags

```bash
miseos rewind hard HEAD~1 --confirm-hard
miseos align rebase main --confirm-rewrite
miseos dispatch force-push origin feature/my-branch --confirm-force
```

Protected branch force push is blocked unless you also pass:

```bash
--allow-protected
```

That flag should almost never be used.

## Recommended aliases

```bash
alias ms="miseos repo status"
alias ma="miseos prep stage"
alias mc="miseos prep commit -m"
alias mp="miseos dispatch push"
alias ml="miseos trace log"
alias mh="miseos hold stash"
alias mr="miseos undo commit"
```

## Design principle

Git is the engine. MiseOS is the operating layer.

The wrapper does not hide Git. It makes the safe path faster, the dangerous path explicit, and the repository state easier for humans and agents to understand.
