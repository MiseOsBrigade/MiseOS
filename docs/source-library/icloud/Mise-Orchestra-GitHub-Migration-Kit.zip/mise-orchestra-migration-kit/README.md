# Mise Orchestra — Replit to GitHub Migration Kit

This kit is a safe handoff package for moving the **Mise Orchestra** Replit app into a GitHub repository.

## What is included

- `replit-export-data/` — CSV exports currently available in the workspace.
- `pages-assets/` — uploaded `.pages` planning/design documents currently available in the workspace.
- `docs/context-pasted.txt` — prior context captured from the working session.
- `scripts/replit-to-github-copy.sh` — shell script to run inside the Replit app Shell after creating the destination GitHub repo.
- `.gitignore` — safe default ignore file for Node/Python/Replit-style apps.

## Recommended destination repo

`MiseOsBrigade/Mise-Orchestra`

Create this repo on GitHub first, then run the copy script from the Replit Shell.

## Safe migration flow

1. Open the Replit app: `Mise Orchestra`.
2. Open the Replit Shell.
3. Make sure secrets are stored in Replit Secrets and not in source files.
4. Create a GitHub repo named `Mise-Orchestra` under `MiseOsBrigade`.
5. Run `scripts/replit-to-github-copy.sh` from inside the Replit project root.

## Important

Do not commit `.env`, private keys, service-account JSON files, database dumps containing live credentials, or token files.
