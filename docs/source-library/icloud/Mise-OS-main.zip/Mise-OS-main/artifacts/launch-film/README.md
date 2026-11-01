<div align="center">

<img src="../../attached_assets/miseos_agents/07_ecosystem/Community-Rep.png" width="160" alt="Community Rep — Community Liaison" />

# 🎬 The Intro Movie

**Patron brigade · Integrations & Ecosystem** &nbsp;`#A98BE0`
_Connect · Deploy · Extend_

</div>

> _"This is how the world meets the kitchen — before anyone asks what `scripts/` does."_ — **Community Rep**, Community Liaison

The **intro movie** is MiseOS's front door: a movie-opening style, fully coded
launch film that introduces the repo, the tools, the 7 brigades, and all 75
characters.

## What lives here

A coded video artifact built with **React + Framer Motion + GSAP + React Three Fiber**.
It auto-plays, is composed entirely in code, and can be screen-recorded/exported
as an MP4.

- `src/components/video/VideoTemplate.tsx` — the film's scene composition and timing.
- `src/lib/agent-roster.ts` — the film-side cast list for all 75 characters.
- `src/components/video/video_scenes/SceneAllAgents.tsx` — the animated full-cast roll call.
- [`../../docs/INTRO_MOVIE.md`](../../docs/INTRO_MOVIE.md) — storyboard, runtime, and export notes.

> The rendered hero loop and MP4 used across the repo live in
> [`docs/assets/`](../../docs/assets).

## Run this station

From the repo root:

```bash
pnpm run film:intro
```

Or from this package directly:

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/launch-film run dev
```

## Build this station

```bash
pnpm run film:intro:build
```

## Story mode

The latest cut is structured as a movie-style repo tour:

1. Trailer opening: repo structure gets a clear setup.
2. Brigade reveals: the system introduces its stations.
3. Full cast roll call: all 75 characters appear in one animated wall.
4. Convenience commands: `install`, `typecheck`, `build`, and `roam`.
5. Final title card: MiseOS is ready for service.

## Brand

This station wears **Plum** `#A98BE0`. Motion + palette live in the [Design Board](../../docs/DESIGN-SYSTEM.md).

<div align="center"><sub><b>MiseOS</b> · Cook. Orchestrate. Deploy.</sub></div>
