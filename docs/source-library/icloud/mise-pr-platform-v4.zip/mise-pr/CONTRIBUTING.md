# Contributing to Mise PR

Mise PR is built around one principle: pull requests should be reviewable before they ask for review.

## Local setup

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[dev]'
pytest -q
ruff check .
mypy mise_pr
```

## Contribution priorities

- Better deterministic review-readiness signals.
- Better policy configuration.
- Safer defaults for enterprise repos.
- Cleaner Markdown and JSON packets.
- Examples for real teams and open-source maintainers.

## Pull request standard

Please include:

- what changed
- why it changed
- how it was tested
- screenshots or sample output when relevant
- any known limitations
