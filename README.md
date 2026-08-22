# MiseOS

MiseOS is an agent-native operating layer for coordinating repositories, automation, human approvals, and production workflows.

## Working Copy + MiseOS

Working Copy is the **mobile Git edge node** for MiseOS on iPhone and iPad. It gives the operator a local, offline-capable Git workspace while GitHub remains the canonical remote, CI/CD system, and governance layer.

### Recommended iPad Pro workflow

```text
MiseOS / ChatGPT
      |
      v
Working Copy
  |       \
  |        +--> Search / diff / stage / commit / push
  |
  +--> Textastic for focused editing
  +--> Swift Playgrounds for executable prototypes
  +--> Files app for document-provider handoff
      |
      v
GitHub
  |
  +--> Pull requests
  +--> GitHub Actions
  +--> Tests / security / builds
  +--> Releases / deployment
```

## Core use case: Mobile Git Operations Console

MiseOS treats Working Copy as a human-in-the-loop control surface:

1. Clone or pull a MiseOS repository.
2. Search files, symbols, and text locally.
3. Open source in Textastic or another iOS editor.
4. Use Swift Playgrounds for small executable experiments.
5. Review the diff in Working Copy.
6. Stage only the intended changes.
7. Create a signed commit when policy requires it.
8. Push the branch to GitHub.
9. Let GitHub Actions perform deterministic validation.
10. Review and merge through the normal GitHub governance path.

## Agent patch workflow

A MiseOS agent can prepare a change without silently taking final authority over the repository:

```text
Issue / task
    -> agent analysis
    -> patch in Working Copy
    -> human diff review
    -> signed commit
    -> push
    -> GitHub Actions
    -> pull request
    -> review / merge
```

This preserves a clear human authorization boundary while still allowing agents to perform high-value repository work.

## Shortcuts

The `.miseos/` directory contains the repository-side contract for mobile automation. iOS Shortcuts can use Working Copy actions and x-callback-url to expose repeatable operations such as:

- Sync repository
- Inspect status
- Open the working tree
- Create an agent branch
- Prepare an agent patch
- Run validation
- Push a reviewed branch
- Dispatch GitHub Actions

Keep credentials out of repository files and Shortcuts. Prefer narrowly scoped GitHub App credentials or short-lived tokens for automation, and use Working Copy's configured SSH/signing identity for Git operations where appropriate.

## Design principles

- **GitHub is canonical.** Working Copy is a local edge workspace, not a second source of truth.
- **Human approval is explicit.** Agent-generated changes should be reviewable before privileged operations.
- **CI is deterministic.** Heavy builds, tests, security checks, and deployment remain on GitHub Actions or dedicated infrastructure.
- **Offline-first editing.** iPad work should remain useful when network access is unavailable.
- **Least privilege.** Automation receives only the permissions needed for its operation.
- **Signed provenance.** Use signed commits for workflows that require stronger authorship and integrity guarantees.

## Repository contract

See `.miseos/manifest.json`, `.miseos/commands.yaml`, and `.miseos/shortcuts.md` for the initial mobile-operations contract.

## License

MIT
