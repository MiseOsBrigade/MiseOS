# Ephemeral Self-Hosted Runner Pattern

Use this only when GitHub-hosted runners are not enough.

## Required posture

- Each runner handles one job, then is destroyed.
- Jobs run in isolated containers/VMs.
- Secrets are injected only at job runtime.
- Runner infrastructure is separate from production workloads.
- Workspaces are never reused across untrusted jobs.

## Minimal label plan

| Label | Use |
|---|---|
| `ubuntu-latest` | default safe public runner |
| `self-hosted` | manual local/private runner |
| `arc-mise-ephemeral` | recommended autoscaled ephemeral runner set |

## Warning

A self-hosted runner does not become safer because it is powerful. It becomes safer when it is short-lived, isolated, least-privileged, observable, and disposable.
