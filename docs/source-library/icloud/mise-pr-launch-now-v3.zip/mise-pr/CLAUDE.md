# Mise PR Agent Guide

Mise PR is a deterministic pull-request prep tool. Its job is not to replace reviewers. Its job is to prepare pull requests so human reviewers and AI agents spend attention on the right things.

## Product rule
Before adding features, ask whether the feature improves one of these outcomes:

1. PRs are easier to review.
2. Risk is clearer before review begins.
3. Context is smaller, cleaner, and easier for humans or agents to use.
4. Enterprise teams can enforce review discipline without leaking code or adding AI noise.

## Engineering rules
- Keep the core analyzer deterministic.
- Do not require LLM calls for the default path.
- Keep GitHub permissions minimal.
- Prefer plain Markdown and JSON outputs.
- Avoid noisy comments. One useful packet beats ten bot comments.

## Brand phrase
Pull requests prepped before review.
