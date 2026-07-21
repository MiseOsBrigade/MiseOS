# Maintainer guide

Maintainers protect deterministic execution, accurate documentation, reproducible validation, and conservative releases.

## Pull-request classification

Classify changes as documentation, ordinary implementation, public API, security-sensitive, contract, or infrastructure/release. Security and contract changes require CODEOWNER review and explicit test evidence.

## Documentation matrix

| Change | Required update |
|---|---|
| Public API | `docs/api-reference.md` |
| Environment variable | `.env.example` and `docs/configuration.md` |
| Trust boundary | `docs/architecture.md` and `docs/threat-model.md` |
| Deployment behavior | `docs/deployment.md` and `docs/operations.md` |
| User-visible workflow | README or relevant guide |
| Architectural decision | New ADR |

## Dependencies

Prefer small updates. Review changelogs for wallet, cryptography, contract, and AI SDKs. Never auto-merge security-boundary dependency updates. Review the lockfile and run all validation.

## Release readiness

Require clean status, passing CI/security, Changesets, current documentation, no unresolved high-severity findings, package/contract tests, checksums, and a rollback or forward-fix plan.

## Deprecation

Document migration paths, mark deprecations in types and docs, retain them for at least one minor release when practical, and remove only through a major-version plan.
