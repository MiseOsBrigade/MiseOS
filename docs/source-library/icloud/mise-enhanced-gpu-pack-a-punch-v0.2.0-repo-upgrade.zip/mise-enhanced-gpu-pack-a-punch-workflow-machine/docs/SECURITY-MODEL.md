# Security model

## Safe defaults

- `permissions: contents: read` unless a job needs PR comments.
- `persist-credentials: false` on checkout.
- `concurrency` with `cancel-in-progress` to reduce runaway CI spend.
- No `pull_request_target`.
- No auto-commit.
- No auto-merge.
- No branch protection bypass.
- Fork PRs cannot use the PR-comment write path in this package.

## Risk gate blocks

The risk gate scores and can block:

- secret-like strings,
- destructive shell patterns,
- workflow or action edits from forks,
- sensitive dependency, infrastructure, and script changes,
- large diffs and large file count changes.

Policy file:

```text
.github/mise/mise-policy.json
```

GPU policy file:

```text
.github/mise/gpu-policy.json
```

## Self-hosted runner boundary

Self-hosted runners should be treated as privileged infrastructure. Use separate runner groups and labels for GPU work. The GPU workflow expects a runner labeled:

```text
self-hosted, linux, x64, gpu, mise-gpu-ephemeral
```

Only attach that label to machines that are disposable, isolated, or tightly controlled.
