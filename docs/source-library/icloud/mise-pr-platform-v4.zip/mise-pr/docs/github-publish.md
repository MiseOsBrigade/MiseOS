# Publish Mise PR to GitHub

This repository is prepared for GitHub Marketplace as a single-action repository.

## Existing target repo

`https://github.com/DeontewattsV1/mise-pr`

## Push from local checkout

```bash
git init
git remote add origin https://github.com/DeontewattsV1/mise-pr.git
git add .
git commit -m "Launch Mise PR"
git branch -M main
git push -u origin main
```

## Publish release

```bash
bash scripts/publish-release.sh
```

Then edit the GitHub release and select **Publish this Action to the GitHub Marketplace**.

## Marketplace compatibility note

This action repo keeps workflow examples in `docs/examples/workflows` instead of `.github/workflows` so the root action repository remains Marketplace-ready.
