---
name: MiseOS artifact build/typecheck gotchas
description: Recurring build/typecheck traps in MiseOS artifacts — Tailwind v4 dropping CSS font @import, missing DOM lib in tsconfig, framer-motion variant transitions widening.
---

# MiseOS artifact build/typecheck gotchas

## Web fonts must load via index.html <link>, not CSS @import
In Tailwind v4, `@import "tailwindcss"` inlines thousands of rules in place, so any
`@import url('...fonts.googleapis...')` placed *after* it in `index.css` ends up far down
the compiled CSS — past the "@import must precede all other statements" limit — and the
browser silently drops it. Symptom: PostCSS warning in the dev log + custom fonts falling
back to system fonts app-wide while the page otherwise works.
**Why:** the source order looks correct (font @import near the top) but post-inline order is
what the browser sees. **How to apply:** load all brand fonts via a `<link rel="stylesheet">`
in the artifact's `index.html` (with preconnect) and do NOT keep a font `@import` in the CSS.
Verify every token is covered — e.g. dashboard tokens are Inter (sans) / Syne (display) /
Space Mono (mono); loading only Inter leaves display+mono on fallbacks.

## Typecheck failures
Two failures that recur when building/typechecking MiseOS artifacts (esp. video-js ones):

1. **Base tsconfig has no DOM lib.** The shared base tsconfig sets only `es2022` (no `dom`/
   `dom.iterable`). Any artifact using browser APIs (`window`, `document`, `HTMLAudioElement`,
   etc.) fails typecheck until its own `tsconfig.json` adds `"lib": ["es2022","dom","dom.iterable"]`.
   The launch-film artifact needed exactly this.

2. **framer-motion variant transitions widen.** In this repo's framer-motion version, a
   `transition` object literal inside a `Variants` value has its `type`/`ease` string literals
   widened to `string`, which is not assignable to `Transition` and breaks typecheck. Fix:
   cast each such transition object `as Transition` (import the type from framer-motion).

**Why:** Both are environment/version quirks, not logic errors — easy to misdiagnose as code
bugs. **How to apply:** When a new artifact's typecheck errors on DOM globals, add the dom
libs to its tsconfig; when it errors on `Variants`/`Transition` assignability, cast the
transition literals. Verify per-package, e.g. `pnpm --filter @workspace/<pkg> run typecheck`.
