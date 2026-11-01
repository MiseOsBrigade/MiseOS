# MiseOS Vite Registry Console

The Vite layer adds a fast local UI for the MiseOS Bootstrap Registry.

## Purpose

The console gives MiseOS a browser-native registry view for:

- manifest browsing
- risk surface summaries
- package lane visibility
- GHCR-first publish sequence checks
- dashboard previews before publishing

## Architecture

```text
registry/*.json
  → scripts/generate-vite-registry-data.mjs
  → apps/registry-console/src/generated/*
  → Vite TypeScript app
  → worker risk scoring
  → static dashboard build
```

## Commands

```bash
pnpm vite:prepare
pnpm vite:validate
pnpm vite:dev
pnpm vite:build
pnpm vite:preview
```

## Vite features configured

| Feature | MiseOS implementation |
|---|---|
| npm dependency resolving | Vite dev server handles app dependencies and bare module imports. |
| Pre-bundling | Vite handles dependency pre-bundling for cold-start speed. |
| HMR | `src/main.ts` uses guarded `import.meta.hot` acceptance/disposal. |
| TypeScript | Vite transpiles TS; `tsc --noEmit` handles type checking. |
| `isolatedModules` | Enabled in `tsconfig.json`. |
| `vite/client` | Added to `compilerOptions.types`. |
| HTML entry | `index.html` is the app entry point. |
| CSS Modules | `Dashboard.module.css` with camel-case-only locals. |
| Static assets | SVG logo import and HTML asset references. |
| Raw assets | GLSL imported with `?raw`. |
| JSON imports | Registry index and analytics are imported as JSON. |
| Glob imports | Manifests loaded with `import.meta.glob`. |
| Web Workers | Risk scoring runs in `registry-risk.worker.ts`. |
| CSP nonce | `html.cspNonce` configured with a deployment placeholder. |
| License output | `build.license.fileName = 'license.md'`. |
| Chunk optimization | CSS code splitting and chunk import map enabled. |

## Safety rule

The Vite app is read-only by default. It must not mutate registry state from the browser. Writes stay in CLI, workflow, or reviewed PR paths.
