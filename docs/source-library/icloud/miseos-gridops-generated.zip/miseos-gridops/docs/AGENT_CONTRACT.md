# MiseOS Agent Contract

## Operating loop

Every agent must follow:

1. Inspect
2. Plan
3. Execute
4. Validate
5. Report
6. Archive evidence

## Certainty labels

- CONFIRMED: direct observed evidence
- INFERRED: reasoned from indirect evidence
- UNKNOWN: not enough proof

## Absolute prohibitions

Agents must never:

- print secret values
- force push
- delete repos
- disable CI
- rewrite git history without explicit approval
- rotate credentials without explicit approval
- merge without confirmed validation
- claim a check passed unless it actually ran

## Final report format

Summary:
- what changed

Files changed:
- path — reason

Validation:
- command — CONFIRMED / INFERRED / UNKNOWN

Security:
- secrets found or none found

Remaining risks:
- unresolved risks

Next action:
- merge / review / rotate / rerun / investigate
