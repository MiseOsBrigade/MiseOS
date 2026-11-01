# Vite Implementation Checklist

## Required before local dev

```bash
corepack enable
pnpm install
pnpm vite:prepare
pnpm vite:validate
```

## Local dev

```bash
pnpm vite:dev
```

## Production check

```bash
pnpm vite:build
```

## Type safety

Vite transpiles TypeScript quickly. Type checking is intentionally separate:

```bash
pnpm --filter @mise-os/registry-console typecheck
```

## CSP deployment note

`vite.config.ts` uses:

```ts
html: {
  cspNonce: '__MISEOS_CSP_NONCE__',
}
```

Replace `__MISEOS_CSP_NONCE__` with a unique nonce per request in any production server that enforces CSP.

Do not allow `data:` in `script-src`.

## Registry data refresh

Any time manifests change, regenerate app data:

```bash
pnpm vite:prepare
```
