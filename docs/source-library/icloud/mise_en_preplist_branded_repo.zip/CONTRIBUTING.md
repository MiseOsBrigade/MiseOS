# Contributing to Mise-en-Preplist

Thanks for helping keep the prep line clean.

## Contribution Standard

Every change should make the repo easier to operate, safer to bootstrap, or clearer to explain.

Before opening a pull request:

- [ ] Keep instructions step-by-step.
- [ ] Avoid implying that the README executes automation.
- [ ] Keep workflow changes readable.
- [ ] Preserve safe unzip behavior.
- [ ] Update `bootstrap/payload-manifest.txt` when payload contents change.
- [ ] Run tests when applicable.

## Local Check

```bash
python3 scripts/safe_unzip.py bootstrap/payload.zip /tmp/mise-en-preplist-test
npm test
```

If the payload does not contain a Node project, skip `npm test` unless the extracted project defines it.

## Commit Style

Use simple conventional-style commits:

```text
feat: add payload validation step
fix: correct manifest order
docs: update setup instructions
chore: refresh brand assets
```

## Pull Request Flow

1. Create a branch.
2. Make the smallest useful change.
3. Run local checks.
4. Open a PR using the prep ticket template.
5. Explain the station affected and the expected operator result.
