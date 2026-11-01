# MiseOS Intro Movie

A movie-opening style launch film for the MiseOS repository.

The goal is simple: make the repo feel instantly understandable, memorable, and useful.

## What changed

The launch film now works like a cinematic repo tour:

1. **Trailer opening** — frames MiseOS as the answer to unclear repo structure.
2. **Executive cast reveal** — introduces the core orchestration brigade.
3. **Ops + service split screen** — shows dispatch, cache, delivery, and flow tools.
4. **Engineering/security/platform montage** — explains who builds, checks, and keeps things alive.
5. **Seven-brigade lineup** — shows the top-level system map.
6. **Full cast roll call** — displays all 75 characters in one animated wall.
7. **Convenience commands** — highlights the practical commands people can run immediately.
8. **Final title card** — closes like a movie studio ident.

## Runtime

The full coded intro is about **72 seconds**.

Scene timing lives in:

```ts
artifacts/launch-film/src/components/video/VideoTemplate.tsx
```

## Run it locally

From the repo root:

```bash
pnpm install
pnpm run film:intro
```

Then open the Vite URL shown in the terminal.

## Build it

```bash
pnpm run film:intro:build
```

## Record/export workflow

The launch film is a browser-rendered React animation. The lightest export path is:

1. Run `pnpm run film:intro`.
2. Open the local URL in a browser.
3. Use a screen recorder at 1920×1080.
4. Export as MP4.
5. Replace or add the rendered file under `docs/assets/`.
6. Update the README video link if the filename changes.

## Voiceover option

Use this as an optional narrator track:

> In a world where repositories forget what folder does what, one brigade brings everything into place. Meet MiseOS: 75 agents, 7 brigades, and one organized repo tour. Cook. Typecheck. Build. Roam. Everything in its place before deploy.

## Why this helps the repo

- Makes the repo easier to understand for new visitors.
- Turns the 75-character system into a memorable product experience.
- Shows practical entry points instead of only lore.
- Keeps the intro coded, remixable, and easy to update.
