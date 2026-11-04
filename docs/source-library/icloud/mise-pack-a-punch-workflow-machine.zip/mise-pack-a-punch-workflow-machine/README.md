# Mise Pack-a-Punch Workflow Machine

A reusable GitHub Actions environment that stacks repository workflows into one auditable processor for quality, safety, branch readiness, and evidence reporting.

It is **quantum-inspired in architecture language only**: measurement context, covariance-style weighted signals, coordinate gates, and evidence mesh. It does not claim physical quantum computation, cosmic-particle energy, Planck-scale access, or impossible performance. The real implementation runs on GitHub-hosted runners or trusted ephemeral self-hosted runners.

## What it does

- Captures a measurement context for the run: event, actor, branch, changed files, changed lines.
- Blocks obvious risk: secret-like strings, risky workflow edits from forks, destructive shell patterns, and high-risk change sets.
- Runs native quality checks only when the repository supports them.
- Scans supply-chain signals without auto-committing or mutating repository state.
- Recommends the next branch to review or merge without auto-merging.
- Produces a Markdown/JSON evidence report and optional PR comment.

## Install

Copy these paths into your repository:

```text
.github/workflows/mise-pack-a-punch.yml
.github/mise/mise-policy.json
scripts/mise-*.mjs
package.json
```

Then commit them on a normal branch and open a PR.

## Run modes

### Automatic PR gate

The workflow runs on pull requests and creates a Pack-a-Punch evidence report.

### Manual launch

Go to **Actions → Mise Pack-a-Punch Workflow Machine → Run workflow**.

### Reusable workflow call

Use the example caller only when you want another workflow to invoke the stack:

```yaml
jobs:
  pack-a-punch:
    uses: ./.github/workflows/mise-pack-a-punch.yml
    with:
      stack_profile: balanced
      runner: ubuntu-latest
      fail_on_high_risk: true
      comment_on_pr: false
```

## Self-hosted runner mode

Use a self-hosted label only when the runner is isolated and ephemeral. Recommended production form:

1. GitHub Actions Runner Controller or equivalent autoscaling runner manager.
2. One job per runner instance.
3. No shared workspace persistence between jobs.
4. No long-lived broad-scope credentials on the runner.
5. Separate namespace/project for runner infrastructure and workload pods.

## Coordinate stack

| Coordinate | Gate | Job |
|---|---|---|
| A0 | Measurement Context | `measurement-context` |
| B1 | Risk Gate | `risk-gate` |
| C2 | Quality Stack | `quality-stack` |
| D3 | Supply Chain Scan | `supply-chain-scan` |
| E4 | Branch Advisor | `branch-advisor` |
| F5 | Evidence Report | `evidence-report` |

## Safety defaults

- Minimum top-level `GITHUB_TOKEN` permission: `contents: read`.
- Write permissions only in the final PR-comment job.
- No `pull_request_target` trigger.
- No auto-merge.
- No auto-commit.
- No recursive bot push loop.
- No execution of untrusted fork code with elevated credentials.

## Customize

Edit `.github/mise/mise-policy.json`:

- Add more critical paths.
- Tune risk thresholds.
- Adjust quality commands.
- Change branch scoring preferences.
- Add organization-specific blocked patterns.

