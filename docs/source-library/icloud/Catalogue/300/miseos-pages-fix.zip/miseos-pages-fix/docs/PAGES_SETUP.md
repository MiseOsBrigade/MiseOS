# MiseOS GitHub Pages Setup

The MiseOS Pages site is deployed from `main` with a GitHub Actions workflow.

## Required repository setting

Open:

`Settings → Pages → Build and deployment → Source`

Select:

`GitHub Actions`

## Deployment workflow

The workflow at `.github/workflows/pages.yml`:

1. checks out the repository;
2. verifies that `index.html` exists;
3. builds a clean `_site` directory;
4. creates `404.html` from the homepage;
5. adds `.nojekyll`;
6. copies supported static folders;
7. uploads the Pages artifact;
8. deploys through the `github-pages` environment.

## Expected URL

`https://miseosbrigade.github.io/MiseOS/`

## Troubleshooting

- Confirm the repository is public or that the GitHub plan supports private Pages.
- Confirm the Pages source is set to GitHub Actions.
- Open the Actions tab and inspect the `Deploy MiseOS Pages` workflow.
- Confirm the workflow has `pages: write` and `id-token: write` permissions.
- Confirm `index.html` exists at the repository root.
