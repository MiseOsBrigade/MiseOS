# Copy-to-repo instructions

Target repository:

```text
https://github.com/DeontewattsV1/mise-brigade-de-repo
```

This kit does **not** push anything. It is designed to be copied into the repository and reviewed before commit.

## Recommended location

```text
brand/
├── assets/
│   ├── svg/
│   └── png/
├── snippets/
├── docs/
├── github/
├── brand.css
└── brand.tokens.json
```

## Local copy command

From the folder containing this kit:

```bash
mkdir -p /path/to/mise-brigade-de-repo/brand
rsync -av --exclude ".DS_Store" ./ /path/to/mise-brigade-de-repo/brand/
```

## Optional commit commands

```bash
git status
git add brand README.md
git commit -m "brand: add Mise Brigade de Repo chef-code kit"
```

Do not push until the rendered README and SVGs are reviewed locally.
