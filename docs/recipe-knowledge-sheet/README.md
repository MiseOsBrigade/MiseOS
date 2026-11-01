# Mise-en-recipe-Knowledge-Sheet
# Git Commands Guide: Basic to Advanced

A comprehensive guide to Git commands for version control, from fundamental operations to advanced workflows.

---

## Table of Contents

1. [Basic Git Commands](#basic-git-commands)
2. [Advanced Git Commands](#advanced-git-commands)
3. [Best Practices](#best-practices)

---

## Basic Git Commands

### 1. `git init` - Initialize a Repository

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

### 2. `git clone` - Copy a Repository

**Purpose:** Creates a local copy of a remote repository.

**Usage:**
```bash
git clone <repository-url>
git clone <repository-url> <directory-name>
```

**Examples:**
```bash
# Clone a repository with its default name
git clone https://github.com/MiseOsBrigade/Mise-en-recipe-Knowledge-Sheet.git

# Clone into a specific directory
git clone https://github.com/MiseOsBrigade/Mise-en-recipe-Knowledge-Sheet.git my-project

# Clone with SSH
git clone git@github.com:MiseOsBrigade/Mise-en-recipe-Knowledge-Sheet.git
```

**When to use:**
- Getting a copy of a remote repository
- Setting up a local development environment
- Contributing to open-source projects

---

### 3. `git status` - Check Repository Status

**Purpose:** Shows the current status of your working directory and staging area.

**Usage:**
```bash
git status
```

**Example Output:**
```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to stage changes)
  (use "git restore <file>..." to discard changes)
        modified:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        new_file.txt
```

**When to use:**
- Before committing changes (verify what's staged)
- Checking if your branch is up to date
- Identifying untracked or modified files

---

### 4. `git add` - Stage Changes

**Purpose:** Moves changes from working directory to the staging area, preparing them for commit.

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
git add README.md

# Stage all files in a directory
git add src/

# Stage all modified and new files
git add .

# Stage all changes including deletions
git add -A

# Interactive staging (choose specific changes)
git add -p
```

**When to use:**
- Preparing specific files for commit
- Grouping related changes before committing
- Excluding certain files from a commit

---

### 5. `git commit` - Record Changes

**Purpose:** Creates a snapshot of the staged changes with a descriptive message.

**Usage:**
```bash
git commit -m "Commit message"
git commit -am "Commit message"        # Stage and commit tracked files
git commit --amend                     # Modify the last commit
git commit -m "message" --no-edit     # Commit with auto-generated message
```

**Examples:**
```bash
# Basic commit with message
git commit -m "Add user authentication module"

# Stage and commit all tracked files
git commit -am "Fix login form validation"

# Amend the last commit (add more changes)
git commit --amend -m "Updated commit message"

# Amend without changing the message
git commit --amend --no-edit
```

**Best Practices:**
- Write clear, descriptive commit messages (50 chars, be specific)
- Use imperative mood: "Add feature" not "Added feature"
- Commit logical chunks of work
- Avoid mixing unrelated changes in one commit

---

### 6. `git push` - Upload Changes to Remote

**Purpose:** Uploads local commits to a remote repository.

**Usage:**
```bash
git push                               # Push to default remote and branch
git push <remote> <branch>             # Push to specific remote/branch
git push -u origin <branch>            # Push and set upstream tracking
git push --all                         # Push all branches
git push --force                       # Force push (use with caution)
```

**Examples:**
```bash
# Push current branch to origin
git push

# Push to main branch explicitly
git push origin main

# Push and set upstream for future pushes
git push -u origin feature-branch

# Push all branches
git push --all

# Push specific branch with different name
git push origin local-branch:remote-branch
```

**When to use:**
- Uploading commits to share with team members
- Updating remote branches
- Backup of local work

⚠️ **Warning:** Avoid `--force` unless absolutely necessary; it can overwrite others' work.

---

### 7. `git pull` - Download and Merge Changes

**Purpose:** Fetches remote changes and automatically merges them into the current branch.

**Usage:**
```bash
git pull                               # Pull from default remote/branch
git pull <remote> <branch>             # Pull from specific remote/branch
git pull --rebase                      # Rebase instead of merge
git pull --no-commit                   # Fetch but don't auto-merge
```

**Examples:**
```bash
# Pull latest changes from remote
git pull

# Pull from specific branch
git pull origin main

# Pull with rebase (keeps history linear)
git pull --rebase

# Fetch without merging (allows review first)
git pull --no-commit
```

**Common Workflow:**
```bash
# Pull latest before starting work
git pull origin main

# Make changes
git add .
git commit -m "My changes"

# Push back to remote
git push origin main
```

**When to use:**
- Keeping local branch synchronized with remote
- Collaborating with team members
- Before pushing to avoid conflicts

---

## Advanced Git Commands

### 1. `git stash` - Temporarily Save Changes

**Purpose:** Saves uncommitted changes in a temporary storage area without committing them.

**Usage:**
```bash
git stash                              # Stash current changes
git stash save "description"           # Stash with descriptive message
git stash list                         # List all stashed changes
git stash pop                          # Apply and remove most recent stash
git stash apply stash@{n}              # Apply specific stash without removing
git stash drop                         # Delete most recent stash
git stash clear                        # Delete all stashes
```

**Examples:**
```bash
# Work on feature but need to switch branches
git stash
git checkout main

# Check what stashes are available
git stash list
# Output:
# stash@{0}: WIP on feature-x: 3a5b2c1 Previous commit message
# stash@{1}: WIP on feature-y: 2d4e9f8 Another commit message

# Apply the most recent stash
git stash pop

# Apply a specific stash
git stash apply stash@{1}

# View contents of a stash
git stash show -p stash@{0}

# Delete a stash
git stash drop stash@{0}
```

**Real-world Scenario:**
```bash
# You're working on feature but need to fix a critical bug
git stash                              # Save work
git checkout main
git checkout -b hotfix/bug-123
git add .
git commit -m "Fix critical bug"
git push origin hotfix/bug-123
git checkout feature
git stash pop                          # Resume work
```

**When to use:**
- Switching branches without committing
- Cleaning up working directory
- Temporarily saving work during interruptions

---

### 2. `git cherry-pick` - Apply Specific Commits

**Purpose:** Applies the changes from specific commit(s) to the current branch.

**Usage:**
```bash
git cherry-pick <commit-hash>
git cherry-pick <commit-hash-1> <commit-hash-2>
git cherry-pick <commit-range>
git cherry-pick --continue                # After resolving conflicts
git cherry-pick --abort                   # Cancel cherry-pick
```

**Examples:**
```bash
# Apply a single commit from another branch
git cherry-pick abc1234

# Apply multiple specific commits
git cherry-pick abc1234 def5678 ghi9101

# Apply a range of commits
git cherry-pick abc1234..def5678

# Apply commits from another branch without merging it
git cherry-pick develop~3..develop

# Handle conflicts during cherry-pick
git cherry-pick develop-branch
# ... resolve conflicts ...
git add .
git cherry-pick --continue
```

**Workflow Example:**
```bash
# You need a specific bug fix from another branch in main
git log develop --oneline              # Find the commit hash
git checkout main
git cherry-pick abc1234                # Apply that specific commit
```

**Real-world Use Cases:**
- Backporting bug fixes from develop to main/production
- Applying hotfixes to multiple branches
- Picking specific commits without full merge

**When to use:**
- Selective commit application
- Backporting fixes to release branches
- Cherry-picking specific changes from other branches

⚠️ **Note:** Don't cherry-pick commits you'll later merge; it creates duplicate history.

---

### 3. `git revert` - Undo Commits Safely

**Purpose:** Creates a new commit that undoes changes from a previous commit. Safe for shared history.

**Usage:**
```bash
git revert <commit-hash>
git revert HEAD                        # Revert last commit
git revert -n <commit-hash>            # Revert without auto-committing
git revert --continue                  # After resolving conflicts
git revert --abort                     # Cancel revert operation
```

**Examples:**
```bash
# Revert the most recent commit
git revert HEAD

# Revert a specific commit
git revert abc1234

# Revert multiple commits (newest first)
git revert HEAD~2..HEAD

# Revert but don't auto-commit (allow edits)
git revert -n abc1234

# Handle conflicts during revert
git revert abc1234
# ... resolve conflicts ...
git add .
git revert --continue
```

**Example Scenario:**
```bash
# Bad commit pushed to shared branch
git log --oneline
# Output: abc1234 Add faulty feature

# Revert it safely
git revert abc1234
# Creates: "Revert 'Add faulty feature'"

# Push the revert
git push origin main
```

**Compare: Revert vs Reset**

| Aspect | Revert | Reset |
|--------|--------|-------|
| Safety | Safe for shared history | ⚠️ Rewrites history |
| Remote | Can be pushed safely | Don't use after push |
| History | Preserves all commits | Removes commits |
| Use | Public branches | Local work only |

**When to use:**
- Undoing commits on shared/public branches
- Creating an audit trail of changes
- Safe collaboration

---

### 4. `git reset` - Move HEAD and Branches

**Purpose:** Moves the current branch pointer to a different commit, optionally changing the staging area and working directory.

**Usage:**
```bash
git reset <commit>                     # Soft reset (keep changes staged)
git reset --soft <commit>              # Keep changes in staging area
git reset --mixed <commit>             # Default: keep changes unstaged
git reset --hard <commit>              # ⚠️ Discard all changes
git reset HEAD~1                       # Undo last commit, keep changes
```

**Reset Modes Explained:**

#### Soft Reset (`--soft`)
```bash
# Move HEAD, keep changes staged for commit
git reset --soft HEAD~1

# Useful for: Reorganizing commits, combining commits
git commit -m "Fix A"
git commit -m "Fix B"
git reset --soft HEAD~2
git add .
git commit -m "Fix A and B together"
```

#### Mixed Reset (`--mixed`, default)
```bash
# Move HEAD, keep changes in working directory
git reset --mixed HEAD~1
# OR simply:
git reset HEAD~1

# Useful for: Modifying what's staged before committing
```

#### Hard Reset (`--hard`)
```bash
# ⚠️ Move HEAD and discard all changes
git reset --hard HEAD~1

# Only use when you're sure - it's destructive!
# Useful for: Reverting to a known good state locally
```

**Real-world Examples:**

```bash
# Accidentally committed password in file
git reset --hard HEAD~1                # Go back, discard the commit

# Made multiple commits, want to squash them
git reset --soft HEAD~3                # Go back 3 commits, keep changes staged
git commit -m "Squashed 3 commits"

# Need to redo last commit with better message
git reset --soft HEAD~1
git commit -m "Better commit message"

# Discard all uncommitted changes
git reset --hard HEAD
```

**When to use:**
- `--soft`: Reorganizing commits
- `--mixed`: Unstaging files, modifying commits
- `--hard`: Discarding work (locally only!)

⚠️ **Safety Note:** Only use `git reset --hard` on local commits. Never on shared history.

---

### 5. `git rebase` - Reapply Commits on Top of Another Branch

**Purpose:** Re-applies commits from current branch on top of another branch, creating linear history.

**Usage:**
```bash
git rebase <branch>                    # Rebase current branch onto another
git rebase -i HEAD~n                   # Interactive rebase last n commits
git rebase --continue                  # After resolving conflicts
git rebase --abort                     # Cancel rebase
git rebase --skip                      # Skip current commit during rebase
```

**Example - Linear History:**
```bash
# Before rebase (branched history)
      A - B - C (main)
           \
            D - E (feature)

# After: git checkout feature && git rebase main
      A - B - C (main)
            \
             D' - E' (feature)
```

**Interactive Rebase Example:**
```bash
# Rebase and edit last 3 commits
git rebase -i HEAD~3

# Editor opens with options:
# pick abc1234 First commit
# pick def5678 Second commit
# pick ghi9101 Third commit

# Change to:
# pick abc1234 First commit
# squash def5678 Second commit      # Combine with previous
# reword ghi9101 Third commit       # Change message

# Save and follow prompts
```

**When to use:**
- Before merging to keep history linear
- Cleaning up commit history
- Reorganizing and squashing commits

⚠️ **Warning:** Don't rebase shared/public branches; use merge instead.

---

### 6. Additional Useful Advanced Commands

#### `git reflog` - View History of HEAD Changes
```bash
git reflog
# Shows: abc1234 HEAD@{0}: commit: My commit
#        def5678 HEAD@{1}: checkout: main
#        ghi9101 HEAD@{2}: rebase: my branch

# Recover lost commits:
git reset --hard abc1234
```

#### `git tag` - Mark Important Points
```bash
git tag v1.0.0                         # Lightweight tag
git tag -a v1.0.0 -m "Version 1.0.0" # Annotated tag
git push origin v1.0.0                # Push specific tag
git push origin --tags                # Push all tags
```

#### `git bisect` - Find Problematic Commits
```bash
git bisect start
git bisect bad HEAD                    # Mark current as bad
git bisect good v1.0.0                # Mark known good version
# Checks out commits, you test each one
git bisect good  # or git bisect bad
# Git narrows down the problematic commit
```

---

## Best Practices

### Commit Message Guidelines
```
[Type] Short description (50 chars max)

Longer explanation if needed, wrapping at 72 chars.
Explain WHAT changed and WHY, not HOW.

Footer: Closes #123
```

**Types:** feat, fix, docs, style, refactor, test, chore

### Workflow Best Practices

1. **Pull Before Push**
   ```bash
   git pull origin main
   git push origin feature-branch
   ```

2. **Atomic Commits**
   - One logical change per commit
   - Easier to revert if needed

3. **Use Branches**
   ```bash
   git checkout -b feature/user-auth
   # Work on feature
   git push -u origin feature/user-auth
   ```

4. **Review Before Commit**
   ```bash
   git diff                           # See unstaged changes
   git diff --staged                  # See staged changes
   ```

5. **Don't Force Push to Shared Branches**
   ```bash
   # ✅ Good - for local feature branch
   git push -f origin my-feature
   
   # ❌ Bad - main is shared
   git push -f origin main
   ```

### Useful Aliases
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all'
```

---

## Quick Reference Table

| Task | Command |
|------|---------|
| Check status | `git status` |
| Stage changes | `git add <file>` |
| Commit | `git commit -m "message"` |
| Push | `git push origin branch` |
| Pull | `git pull origin branch` |
| Save work | `git stash` |
| Resume work | `git stash pop` |
| Undo commit (safe) | `git revert <hash>` |
| Undo commit (destructive) | `git reset --hard <hash>` |
| Apply specific commit | `git cherry-pick <hash>` |
| View history | `git log --oneline` |
| Switch branch | `git checkout -b branch` |

---

## References

- [Official Git Documentation](https://git-scm.com/doc)
- [Git Workflows](https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
