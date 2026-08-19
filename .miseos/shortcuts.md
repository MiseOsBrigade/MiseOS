# MiseOS iOS Shortcuts

Working Copy is the local Git adapter. GitHub is the canonical remote and CI/CD control plane.

## Shortcut: MiseOS Sync

```text
Open Working Copy repository
-> Pull
-> Show status
-> Open repository
```

Use this before editing when the repository may have changed remotely.

## Shortcut: MiseOS Agent Patch

```text
Receive task
-> Open repository in Working Copy
-> Create branch: mise/agent/<task-id>
-> Apply/edit files
-> Review diff
-> Stop for human approval
```

The Shortcut must not push or merge an unreviewed agent patch.

## Shortcut: MiseOS Commit + Push

```text
Check status
-> Review staged files
-> Stage approved paths
-> Create signed commit when policy requires
-> Push branch
```

Keep signing keys in the user's secure Working Copy configuration. Do not store private keys in this repository.

## Shortcut: MiseOS Validate

```text
Select repository
-> Dispatch validation workflow
-> Wait for or inspect GitHub Actions result
-> Return PASS / FAIL summary
```

## Shortcut: MiseOS Release

```text
Check branch and CI state
-> Require explicit confirmation
-> Dispatch release workflow
-> Report workflow result
```

Release and deployment operations are intentionally higher-risk than ordinary repository inspection.

## x-callback-url design

MiseOS may use Working Copy's documented x-callback-url and Shortcuts integration as the mobile transport layer. Keep callback parameters deterministic and avoid embedding long-lived credentials in URLs.

## iPad Pro editing pattern

```text
Working Copy clone
      |
      +--> Textastic: source editing
      |
      +--> Swift Playgrounds: executable experiments
      |
      +--> Files: document-provider handoff
      |
      +--> Working Copy: diff / stage / commit
      |
      +--> GitHub: push / PR / Actions
```
