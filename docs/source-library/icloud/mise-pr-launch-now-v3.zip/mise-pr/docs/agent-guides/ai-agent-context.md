# AI Agent Context Guide

Mise PR creates a smaller, cleaner context packet for coding agents and code reviewers.

## Why this matters
AI coding tools can generate large changes quickly, but reviewers still need intent, scope, risk, and validation. Dumping the full repository into a model often creates attention dilution. Mise PR keeps the context sharp.

## Agent handoff format
Use `mise-pr-report.json` as the structured handoff object for coding agents.

Recommended prompt:

```text
You are reviewing a pull request. First read the Mise PR packet. Focus only on files and risks listed in the packet. Do not style-nit. Do not duplicate deterministic findings. Identify functional, security, regression, and test-gap risks.
```
