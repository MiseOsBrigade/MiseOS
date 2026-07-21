# Contributing to MiseOS ChainGate

Thank you for helping build safer human-controlled blockchain infrastructure.

## Before contributing

1. Read the [architecture](docs/architecture.md) and [threat model](docs/threat-model.md).
2. Search existing issues and pull requests.
3. For architectural or security-sensitive changes, open a design issue first.
4. Never include real credentials, private keys, seed phrases, production addresses, or personal data.

## Development setup

```bash
corepack enable
pnpm install
cp .env.example .env
docker compose up -d
pnpm validate
```

## Branch and commit rules

- Branch from `main` using `feat/`, `fix/`, `docs/`, `security/`, or `chore/`.
- Use Conventional Commits, for example `feat(core): add chain-scope expiry validation`.
- Keep commits reviewable and avoid unrelated formatting changes.
- Update documentation and tests in the same pull request as behavior changes.

## Pull-request requirements

Every PR must include:

- problem and scope
- implementation summary
- test evidence
- security impact
- migration or compatibility impact
- documentation changes

Security-sensitive changes must additionally include:

- threat and abuse cases
- fail-open/fail-closed behavior
- replay and cross-chain considerations
- authorization and key-handling implications
- rollback or incident response notes

## Testing expectations

| Change | Minimum validation |
|---|---|
| Documentation | `pnpm docs:check` and link review |
| TypeScript logic | unit tests, typecheck, lint, build |
| Policy/auth | positive, denial, expiry, replay tests |
| Integrations | mocked success, rejection, malformed payload tests |
| Solidity | compile, unit tests, fuzz tests, static analysis |
| Workflow | YAML validation and least-privilege permissions |

Run before requesting review:

```bash
pnpm validate
pnpm docs:check
pnpm contracts:check
```

## Architecture decisions

Material decisions belong in `docs/adr/` using the template. Update an existing ADR only to clarify it; supersede it with a new ADR when the decision changes.

## Releases

Maintainers use Changesets and semantic versioning. Do not manually edit published package versions unless directed by the release workflow.

## Code of conduct

Participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
