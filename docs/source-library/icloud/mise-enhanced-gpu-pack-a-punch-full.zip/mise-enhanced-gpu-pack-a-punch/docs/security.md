# Security Notes

This pack uses least-privilege permissions:

```yaml
permissions:
  contents: read
  pull-requests: read
  actions: read
```

It avoids `pull_request_target`, does not write to the repository, and does not mutate protected branches.
