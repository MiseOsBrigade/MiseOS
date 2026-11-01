# AI Agent Context Guide

Mise PR is designed to be the context hygiene layer before human or AI review.

## Agent consumption contract

Agents should prefer `mise-pr-report.json` when available.

Use these fields first:

- `risk_level`
- `risk_score`
- `attention_budget_minutes`
- `blockers`
- `warnings`
- `recommendations`
- `files[].kind`
- `files[].risky`
- `files[].risk_reasons`

## Agent behavior

A good coding agent should not treat Mise PR as a correctness oracle. Mise PR only answers whether the pull request has enough shape, context, and risk visibility for review.

Recommended agent responses:

- Green: proceed with normal review.
- Yellow: review, but note missing context.
- Amber: ask for improvements before deep review.
- Red: recommend splitting, adding tests, or adding explicit reviewer ownership.

## Do not

- Do not assume a green packet means the code is correct.
- Do not auto-merge based only on Mise PR.
- Do not hide human-review requirements for risky paths.
