# Security model

The central threat is a mistaken or compromised agent operating with excessive authority.

- Scope credentials to one installation or repository.
- Prefer short-lived Vault credentials.
- Deny dangerous actions before execution.
- Require authenticated human approval for Tier 3 actions.
- Never print secrets in logs, prompts, reports, or commits.
- Never rewrite history automatically.
- Treat model output as untrusted input to policy.

When a secret is detected: suppress its value, sanitize tracked files, use environment variables, update `.gitignore`, create `.env.example`, recommend rotation, and require explicit approval before history rewriting.
