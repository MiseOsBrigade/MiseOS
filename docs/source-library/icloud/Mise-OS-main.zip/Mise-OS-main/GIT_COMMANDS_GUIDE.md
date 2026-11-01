# Git_Commands_Guide: Basic to Advanced

A comprehensive guide to Git commands for version control, from fundamental operations to advanced workflows — **written in the language of the kitchen.**

> _"Every cut is deliberate. Every commit is plated."_ — **The Brigade**

---

## Table of Contents

1. [Basic Git Commands](#basic-git-commands)
2. [Advanced Git Commands](#advanced-git-commands)
3. [MiseOS Workflow Best Practices](#miseos-workflow-best-practices)

---

## Basic Git Commands

### 1. `git init` - Stock the Pantry

**Purpose:** Creates a new Git repository in the current directory.

**Usage:**
```bash
git init
```

**Example:**
```bash
# Initialize a new repository in current directory
git init

# This creates a .git folder with all necessary Git metadata
```

**When to use:**
- Starting a new project with version control
- Converting an existing project to use Git

---

### 2. `git clone` - Receive the Recipe

**Purpose:** Creates a local copy of a remote repository.

**Usage:**
```bash
git clone <repository-url>
git clone <repository-url> <directory-name>
```

**Examples:**
```bash
# Clone the MiseOS kitchen
git clone https://github.com/MiseOsBrigade/Mise-OS.git

# Clone into a specific station
git clone https://github.com/MiseOsBrigade/Mise-OS.git my-station

# Clone with SSH
git clone git@github.com:MiseOsBrigade/Mise-OS.git
```

**When to use:**
- Setting up your local kitchen (development environment)
- Contributing to the brigade
- Getting a fresh copy of the pantry

---

### 3. `git status` - Inspect Your Station

**Purpose:** Shows the current status of your working directory and staging area.

**Usage:**
```bash
git status
```

**Example Output:**
```
On branch feature/brigade-dashboard
Your branch is up to date with 'origin/feature/brigade-dashboard'.

Changes not staged for commit:
  (use "git add <file>..." to stage changes)
  (use "git restore <file>..." to discard changes)
        modified:   src/brigade-data.ts

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        new-agent.ts
```

**When to use:**
- Before plating (committing) changes — verify what's ready
- Checking if your branch is up to date with the main line
- Identifying new work not yet staged

---

### 4. `git add` - Prepare the Mise

**Purpose:** Stages changes from your working station to the mise (preparation area), preparing them for commit.

**Usage:**
```bash
git add <file>
git add <directory>
git add .                    # Stage all changes
git add -A                   # Stage all changes (including deletions)
git add -p                   # Interactive staging (hunks)
```

**Examples:**
```bash
# Stage a single file
git add src/brigade-data.ts

# Stage all files in a directory
git add artifacts/dashboard/

# Stage all modified and new files
git add .

# Stage all changes including deletions
git add -A

# Interactive staging — choose which hunks to stage
git add -p
```

**When to use:**
- Preparing specific files for commit
- Grouping related changes into one service (station)
- Excluding certain files from a commit

---

### 5. `git commit` - Plate the Dish

**Purpose:** Creates a snapshot of the staged changes with a descriptive message — you're plating it for service.

**Usage:**
```bash
git commit -m "Commit message"
git commit -am "Commit message"        # Stage and commit tracked files
git commit --amend                     # Modify the last plate
git commit -m "message" --no-edit     # Commit with auto-generated message
```

**Examples:**
```bash
# Plate a feature
git commit -m "Add brigade roster to dashboard"

# Stage and plate all tracked files
git commit -am "Fix agent gallery rendering"

# Amend the last plate — add more changes
git commit --amend -m "Add brigade roster with filtering"

# Amend without changing the ticket
git commit --amend --no-edit
```

**Brigade Commit Message Style:**
- **Keep it concise:** 50 chars, be specific
- **Imperative mood:** "Add feature" not "Added feature"
- **Kitchen focus:** "Plate agent cards" not "update UI"
- **One service per plate:** Commit logical chunks

Example:
```
Add brigade roster filtering

- Filter by agent tier
- Sort by mandate
- Include search by name
```

**When to use:**
- After mise-en-place (staging), plate the work
- When one logical change is ready for service
- Every dish gets a clear ticket

---

### 6. `git push` - Send to Service

**Purpose:** Uploads local commits to the brigade's pass (remote repository).

**Usage:**
```bash
git push                               # Push to default remote and branch
git push <remote> <branch>             # Push to specific remote/branch
git push -u origin <branch>            # Push and set as upstream
git push --all                         # Push all branches
git push --force                       # ⚠️ Use with extreme caution
```

**Examples:**
```bash
# Push current station's work to the brigade
git push

# Push to main service line explicitly
git push origin main

# Push and set as upstream for future service calls
git push -u origin feature/brigade-dashboard

# Push all your station's branches
git push --all

# Push with a different remote branch name
git push origin local-station:remote-station
```

**When to use:**
- Sharing work with the brigade
- Backing up your station's work
- Publishing a feature for review

⚠️ **Brigade Warning:** Never `--force` push to `main` or shared branches. You can overwrite the head chef's work.

---

### 7. `git pull` - Receive Orders

**Purpose:** Fetches remote changes and automatically merges them into your station — you receive new orders from the kitchen.

**Usage:**
```bash
git pull                               # Pull from default remote/branch
git pull <remote> <branch>             # Pull from specific remote/branch
git pull --rebase                      # Rebase instead of merge (linear service line)
git pull --no-commit                   # Fetch but don't auto-merge
```

**Examples:**
```bash
# Receive the latest orders
git pull

# Pull from specific service line
git pull origin main

# Pull with rebase — keeps the order line linear
git pull --rebase

# Fetch without merging — review first before service
git pull --no-commit
```

**Brigade Workflow:**
```bash
# Begin shift — pull latest from main
git pull origin main

# Work your station
git add .
git commit -m "Add component to dashboard"

# End of shift — send your work to brigade
git push origin feature/my-station
```

**When to use:**
- Starting your shift — synchronize with the brigade
- Collaborating across stations
- Before pushing to avoid conflicts on the line

---

## Advanced Git Commands

### 1. `git stash` - Put Plates Away

**Purpose:** Saves uncommitted changes in temporary storage without committing them — you're putting the plates aside to make room.

**Usage:**
```bash
git stash                              # Stash current changes
git stash save "description"           # Stash with descriptive label
git stash list                         # See all stashed plates
git stash pop                          # Apply and remove most recent
git stash apply stash@{n}              # Apply specific stash without removing
git stash drop                         # Delete most recent stash
git stash clear                        # Delete all stashes
```

**Examples:**
```bash
# You're working on a feature but need to switch stations
git stash
git checkout main

# Check what plates are away
git stash list
# Output:
# stash@{0}: WIP on feature-x: 3a5b2c1 Add brigade dashboard
# stash@{1}: WIP on feature-y: 2d4e9f8 Fix agent gallery

# Bring back the most recent plates
git stash pop

# Bring back a specific set of plates
git stash apply stash@{1}

# See what's in a stash before applying
git stash show -p stash@{0}

# Discard a stash
git stash drop stash@{0}
```

**Real Brigade Scenario:**
```bash
# You're working on a feature, critical bug comes in
git stash                              # Put plates away
git checkout main
git checkout -b hotfix/critical-bug
git add .
git commit -m "Fix critical agent rendering bug"
git push origin hotfix/critical-bug
git checkout feature/dashboard         # Back to station
git stash pop                          # Resume work
```

**When to use:**
- Quick branch switches without committing
- Keeping station clean during interruptions
- Emergency fixes during active shifts

---

### 2. `git cherry-pick` - Plate from Another Station

**Purpose:** Applies the changes from specific commit(s) to your current station — you're plating something another chef prepared.

**Usage:**
```bash
git cherry-pick <commit-hash>
git cherry-pick <commit-hash-1> <commit-hash-2>
git cherry-pick <commit-range>
git cherry-pick --continue                # After resolving conflict
git cherry-pick --abort                   # Cancel cherry-pick
```

**Examples:**
```bash
# Apply a single fix from another station
git cherry-pick abc1234

# Apply multiple specific fixes
git cherry-pick abc1234 def5678 ghi9101

# Apply a range of fixes
git cherry-pick abc1234..def5678

# Apply recent changes from the feature branch
git cherry-pick develop~3..develop

# Handle conflicts during cherry-pick
git cherry-pick feature/security-fix
# ... resolve conflicts in your station ...
git add .
git cherry-pick --continue
```

**Brigade Use Case:**
```bash
# A security fix was made in develop, need it in main
git log develop --oneline              # Find the fix
git checkout main
git cherry-pick abc1234                # Apply that specific fix
git push origin main
```

**When to use:**
- Backporting bug fixes to release branches
- Applying selective changes from other stations
- Hot-fixing production while keeping feature branches separate

⚠️ **Brigade Note:** Don't cherry-pick commits you'll later merge as a whole; it creates duplicate history in the brigade.

---

### 3. `git revert` - Undo Service Safely

**Purpose:** Creates a new commit that undoes changes from a previous commit — safe for the brigade's shared line.

**Usage:**
```bash
git revert <commit-hash>
git revert HEAD                        # Revert last commit
git revert -n <commit-hash>            # Revert but don't auto-commit
git revert --continue                  # After resolving conflicts
git revert --abort                     # Cancel revert
```

**Examples:**
```bash
# Undo the most recent plate
git revert HEAD

# Undo a specific plate from earlier
git revert abc1234

# Undo multiple recent plates (newest first)
git revert HEAD~2..HEAD

# Revert but don't auto-commit — allow editing
git revert -n abc1234

# Handle conflicts during revert
git revert abc1234
# ... resolve conflicts ...
git add .
git revert --continue
```

**Brigade Scenario:**
```bash
# Bad feature shipped to main
git log --oneline
# Output: abc1234 Add faulty agent orchestration

# Revert it safely for the brigade
git revert abc1234
# Creates: "Revert 'Add faulty agent orchestration'"

# Push the revert
git push origin main
```

**Revert vs Reset — When to Use Each:**

| Aspect | Revert | Reset |
|--------|--------|-------|
| Safety | Safe for brigade | ⚠️ Rewrites history |
| Shared branches | Yes, always safe | ⚠️ Never use after push |
| History | Preserves all work | Removes commits |
| Best for | Public main line | Local work only |

**When to use:**
- Undoing work on main or shared branches
- Creating an audit trail for the brigade
- Safe collaboration across all stations

---

### 4. `git reset` - Send Plates Back to Prep

**Purpose:** Moves HEAD and your station pointer to a different commit — you're sending plates back to the prep line.

**Usage:**
```bash
git reset <commit>                     # Soft reset (keep changes)
git reset --soft <commit>              # Keep changes in staging area
git reset --mixed <commit>             # Default: keep changes unstaged
git reset --hard <commit>              # ⚠️ Discard all changes
git reset HEAD~1                       # Undo last commit, keep work
```

**Reset Modes — Three Ways to Plate:**

#### Soft Reset (`--soft`)
```bash
# Move HEAD, keep changes staged for re-plating
git reset --soft HEAD~1

# Useful for: Reorganizing commits, combining work
git commit -m "Fix validation"
git commit -m "Fix styling"
git reset --soft HEAD~2
git add .
git commit -m "Fix form validation and styling"
```

#### Mixed Reset (`--mixed`, default)
```bash
# Move HEAD, keep changes in your station
git reset --mixed HEAD~1
# OR simply:
git reset HEAD~1

# Useful for: Modifying what's staged before plating
git add .
git reset                              # Unstage everything
git add src/important.ts               # Re-stage carefully
git commit -m "Only important changes"
```

#### Hard Reset (`--hard`)
```bash
# ⚠️ Move HEAD and discard all work
git reset --hard HEAD~1

# Only use when you're absolutely sure — it's destructive!
# Useful for: Reverting your station to a known good state
```

**Brigade Examples:**

```bash
# Oops, committed a secret in your station
git reset --hard HEAD~1                # Go back, discard everything

# Made 3 commits, want to squash into one for the brigade
git reset --soft HEAD~3                # Go back 3, keep all changes
git commit -m "Refactor brigade data layer"

# Need to redo the last ticket (commit message)
git reset --soft HEAD~1
git commit -m "Better description of changes"

# Discard all uncommitted work, start fresh station
git reset --hard HEAD
```

**When to use:**
- `--soft`: Reorganizing commits before service
- `--mixed`: Unstaging files, careful staging
- `--hard`: Discarding local work (NEVER on shared branches!)

⚠️ **Brigade Safety Rule:** Only use `git reset --hard` on your local station. Never on main or shared branches — you'll wipe out the brigade's work.

---

### 5. `git rebase` - Re-plat on the Line

**Purpose:** Re-applies your station's commits on top of another branch, creating a linear service line — everything in its place.

**Usage:**
```bash
git rebase <branch>                    # Rebase current station onto another
git rebase -i HEAD~n                   # Interactive rebase last n commits
git rebase --continue                  # After resolving conflicts
git rebase --abort                     # Cancel rebase
git rebase --skip                      # Skip current commit during rebase
```

**Example — Linear Service Line:**
```bash
# Before rebase (branched line)
      A - B - C (main)
           \
            D - E (feature)

# After: git checkout feature && git rebase main
      A - B - C (main)
            \
             D' - E' (feature)
```

**Interactive Rebase — Reorganize Your Tickets:**
```bash
# Edit your last 3 commits before sending to brigade
git rebase -i HEAD~3

# Editor opens with your options:
# pick abc1234 Add agent roster
# pick def5678 Add filtering
# pick ghi9101 Fix styling

# Reorganize:
# pick abc1234 Add agent roster
# squash def5678 Add filtering      # Combine into one
# reword ghi9101 Fix agent gallery  # Change message

# Save and follow prompts, resolve conflicts if needed
```

**When to use:**
- Before merging into main — keep history linear
- Cleaning up commit history before brigade review
- Reorganizing and squashing commits into one service

⚠️ **Brigade Warning:** Don't rebase shared/public branches; use merge instead. Interactive rebase is for your local station only.

---

### 6. Additional Useful Advanced Commands

#### `git reflog` — Memory of Your Shift
```bash
git reflog
# Shows: abc1234 HEAD@{0}: commit: Add brigade dashboard
#        def5678 HEAD@{1}: checkout: main
#        ghi9101 HEAD@{2}: rebase: feature/agents

# Recover lost commits from your shift:
git reset --hard abc1234
```

#### `git tag` — Mark Important Services
```bash
git tag v1.0.0                         # Lightweight tag
git tag -a v1.0.0 -m "Release 1.0.0" # Annotated tag with message
git push origin v1.0.0                # Push specific tag to brigade
git push origin --tags                # Push all tags
```

#### `git bisect` — Find the Burnt Dish
```bash
git bisect start
git bisect bad HEAD                    # Mark current as burnt
git bisect good v1.0.0                # Mark known good service
# Git narrows down, you test each commit
git bisect good  # or git bisect bad
# Git identifies the problematic commit
```

---

## MiseOS Workflow Best Practices

### Commit Message Brigade Standard

```
[Type] Short description (50 chars max)

Longer explanation if needed, wrapping at 72 chars.
Explain WHAT changed and WHY, not HOW.

Brigade: Closes #123
```

**Types:** 
- `feat` — new feature (e.g., "feat: Add brigade filtering")
- `fix` — bug fix (e.g., "fix: Resolve agent gallery rendering")
- `docs` — documentation update
- `style` — formatting, no logic change
- `refactor` — restructure code
- `test` — add or update tests
- `chore` — tooling, dependencies

### The Brigade Workflow

```bash
# 1. Begin your shift — pull latest orders
git pull origin main

# 2. Create your station (branch)
git checkout -b feature/orchestra-controls

# 3. Work your station
# ... edit files, test, iterate ...

# 4. Stage your mise
git add src/

# 5. Plate your dish
git commit -m "feat: Add orchestra control panel

Add interactive controls for agent orchestration:
- Real-time agent status display
- Manual dispatch override
- Performance metrics"

# 6. Keep up with the brigade
git pull origin main --rebase

# 7. Send to service (push)
git push -u origin feature/orchestra-controls

# 8. Create Pull Request on GitHub
# → Brigade reviews, merges to main
```

### Brigade Best Practices

1. **Always Pull Before Push**
   ```bash
   git pull origin main
   git push origin feature-branch
   ```

2. **Atomic Commits** — One station, one focus
   - Each commit should be one logical change
   - Easier to review, easier to revert if needed
   - Makes brigade merges cleaner

3. **Use Branches** — Never cook on main
   ```bash
   git checkout -b feature/user-auth
   git checkout -b fix/dashboard-crash
   git checkout -b chore/update-dependencies
   ```

4. **Review Your Work Before Plating**
   ```bash
   git diff                           # See unstaged changes
   git diff --staged                  # See staged changes
   git log --oneline -5              # Review recent commits
   ```

5. **Never Force Push Shared Branches**
   ```bash
   # ✅ Acceptable — your local feature branch
   git push -f origin feature/my-thing
   
   # ❌ NEVER — main is brigade property
   git push -f origin main
   ```

6. **Sync Before Big Merges**
   ```bash
   git checkout feature/my-work
   git pull origin main --rebase      # Bring in latest
   # Resolve conflicts if any
   git push origin feature/my-work
   ```

### Quick Aliases for the Brigade

```bash
# Add these to your Git config
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all'
git config --global alias.sync 'pull origin main --rebase'

# Usage:
git st                                 # git status
git co -b feature/my-work             # git checkout -b ...
git ci -m "Add dashboard"             # git commit -m ...
git sync                              # git pull origin main --rebase
git visual                            # See the whole brigade line
```

---

## Quick Reference Table

| Task | Command | When |
|------|---------|------|
| Check your station | `git status` | Before every change |
| Stock the pantry | `git init` | New project |
| Receive a recipe | `git clone <url>` | Getting started |
| Stage your mise | `git add <file>` | Before committing |
| Plate the dish | `git commit -m "..."` | After staging |
| Send to service | `git push origin branch` | Ready to share |
| Receive orders | `git pull origin main` | Start of shift |
| Put plates away | `git stash` | Need to switch branches |
| Resume work | `git stash pop` | Back to your station |
| Undo safely | `git revert <hash>` | On shared branches |
| Undo locally | `git reset --hard <hash>` | Local work only |
| Apply a fix | `git cherry-pick <hash>` | Backport from another station |
| View history | `git log --oneline` | Understand the brigade |
| Switch stations | `git checkout -b branch` | Create a feature branch |

---

## References

- [Official Git Documentation](https://git-scm.com/doc)
- [Git Workflows](https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [MiseOS Manifesto](docs/MANIFESTO.md) — Understanding the brigade philosophy
- [MiseOS Contributing Guide](docs/CONTRIBUTING.md) — How to work with the kitchen

---

<div align="center">

**Everything in its place. Every commit is orchestrated.**

_調和の技_ — the craft of harmony

</div>
