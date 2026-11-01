# Memory Index

- [MiseOS API contract](miseos-api-contract.md) — spec-first monorepo: edit openapi.yaml, run one codegen cmd, match route serialization to spec field names, consume generated hooks.
- [MiseOS theming](miseos-theming.md) — brand palette as additive semantic tokens; never retune chart-1..5/status colors; Tailwind v4 opacity works on custom hsl tokens.
- [MiseOS artifacts layout](miseos-artifacts.md) — what each artifact is (dashboard/api-server/mise-orchestra) and how dashboard routing + api-server seed data are structured.
- [MiseOS agent roster count](miseos-agent-roster.md) — official count is 75; roster duplicated in brigade-data.ts + Mascots.tsx, keep in lockstep; never edit attached_assets masters.
- [MiseOS typecheck gotchas](miseos-typecheck-gotchas.md) — base tsconfig lacks DOM lib (add per-artifact); framer-motion variant transitions need `as Transition` cast.
