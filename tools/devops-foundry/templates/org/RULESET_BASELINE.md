# Organization Ruleset Baseline

Apply this as policy guidance when creating repository or organization rulesets.

- Protect the default branch and long-lived `release/*` / `integration/*` branches.
- Require pull requests and at least one non-author approval for production code.
- Require successful CI, security, and policy checks before merge.
- Require conversation resolution for review threads.
- Block force pushes and branch deletion on protected branches.
- Restrict workflow changes and shared workflow repositories with CODEOWNERS.
- Prefer signed commits/tags where your operating model supports them.
- Require deployment environments and approval gates for production publication.
- Keep Actions permissions restricted and explicitly declared per workflow/job.
- Treat automated/agentic changes exactly like human changes: rulesets and required reviews still apply.
