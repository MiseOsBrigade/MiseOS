# MiseOS Clickable Character Starter

A secure, non-stealthy reference implementation for clickable character-driven workflows.

## Core rule
The PNG is always inert. It never contains or executes code.

Behavior is provided by a validated JSON manifest, explicit user consent, a read-only workflow allowlist, a SHA-256 startup integrity check, and server-side handlers.

## Start
```bash
bash scripts/bootstrap-dev.sh
npm run dev
```
Open `http://localhost:3000`.

## Wallet modes
- `none`
- `evm`
- `neo-onegate`

## Integrity
```bash
npm run hash:registry
npm run verify:registry
npm test
```

Keep `workflow/registry.json` and its digest read-only in production. Use NFT ownership only as authorization context.
