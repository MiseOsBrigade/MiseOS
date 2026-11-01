# CHG-XXXX — Cross-repository change

## Goal

Describe the system-level outcome.

## Repositories

- [ ] `YOUR-ORG/repo-a`
- [ ] `YOUR-ORG/repo-b`

## Merge / promotion order

1. Provider or schema changes.
2. Consumers.
3. Integration manifest promotion.

## Acceptance criteria

- [ ] All component PRs approved and green.
- [ ] Integration manifest points to immutable tags or SHAs.
- [ ] Contract/integration tests pass.
- [ ] Release notes and rollback plan are present.
- [ ] Production promotion requires the configured environment approval gate.
