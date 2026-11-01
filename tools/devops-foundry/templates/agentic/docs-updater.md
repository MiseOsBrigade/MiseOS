---
on:
  schedule:
    - cron: "23 8 * * 1"
permissions:
  contents: read
  pull-requests: read
  copilot-requests: write
network: defaults
tools:
  github:
    toolsets: [repos, pull_requests]
safe-outputs:
  create-pull-request:
engine: copilot
---

# MiseOS Documentation Drift Updater

Compare developer-facing documentation with the current repository structure, commands, configuration, and public interfaces. Focus only on concrete drift that can be supported by repository evidence.

When documentation is materially stale, propose a narrowly scoped pull request that updates documentation only. Do not change application code, dependencies, workflow permissions, or secrets. Preserve existing terminology unless the code proves it obsolete.
