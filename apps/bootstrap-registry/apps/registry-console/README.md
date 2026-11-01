# @mise-os/registry-console

A Vite-powered dashboard for the MiseOS Bootstrap Registry.

## What this app demonstrates

- Bare module resolving through Vite dev server and pre-bundling.
- TypeScript transpilation with separate `tsc --noEmit` checking.
- `vite/client` environment types.
- JSON imports for registry data.
- `import.meta.glob` for manifest discovery.
- CSS Modules and global CSS.
- Raw asset imports with `?raw`.
- Static asset URL imports.
- Worker construction through `new Worker(new URL(...))`.
- HMR guarded by `if (import.meta.hot)`.
- CSP nonce configuration through `html.cspNonce`.
- Production license output through `build.license`.

## Commands

```bash
pnpm vite:prepare
pnpm --filter @mise-os/registry-console dev
pnpm --filter @mise-os/registry-console typecheck
pnpm --filter @mise-os/registry-console build
```

## Why generated data exists

The app reads registry data from `src/generated/` so Vite can use normal app-root imports. Refresh it with:

```bash
pnpm vite:prepare
```
