# Publish Mise PR to GitHub

The ChatGPT GitHub connector can edit files in repositories it can access, but it cannot create a brand-new repository from here. Use the GitHub CLI script below to create and push the repo.

## One-command publish

From the extracted `mise-pr` directory:

```bash
bash scripts/create-and-push-github.sh
```

## Manual commands

```bash
gh auth login
cd mise-pr
git init
git add .
git commit -m "Launch Mise PR"
gh repo create DeontewattsV1/mise-pr   --public   --description "Pull requests prepped before review."   --source=.   --remote=origin   --push
```

## After publish

1. Open `https://github.com/DeontewattsV1/mise-pr`.
2. Confirm the README hero renders.
3. Create a test PR to trigger `.github/workflows/mise-pr.yml`.
4. Record or upload `docs/product-hunt/assets/mise-pr-demo.gif` to Product Hunt.
5. Copy `docs/product-hunt/product-hunt-draft.md` into the Product Hunt submission flow.
