# v0.1.0 — 2026-07-27

Initial scaffold for layered prompt-injection defense in a feedback-driven multi-agent system.

## Highlights

- Structured-output schema (`schemas/agent-output.schema.json`) to replace free-text parsing of model corrections.
- Post-generation validator (`src/validators/output-validator.js`) checking for policy leaks, unsafe actions, and instruction-override attempts.
- CI workflow (`.github/workflows/ci.yml`) running lint, schema validation, and validator tests on every push/PR.
- Package publish workflow (`.github/workflows/publish-package.yml`) publishing to GitHub Packages on release.
- Security policy documentation (`docs/SECURITY.md`) covering the three-point reinforcement model (before input / during generation / after generation) and the planner/executor separation pattern.

## Notes

Prompting rules alone are not enforcement — this scaffold pairs them with schema validation, allowlists, RBAC, tool restrictions, and output filtering, per the layered-defense approach.
