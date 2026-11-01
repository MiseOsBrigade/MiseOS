# MiseOS Media Assets

The uploaded `mise_orchestra_theme.mp3` was treated as a brand/source asset for the registry integration.

## Current metadata

| Asset | Duration | Channels | Sample rate | Repo handling |
|---|---:|---:|---:|---|
| `mise_orchestra_theme.mp3` | 22.0s | 2 | 44.1 kHz | Metadata only; do not commit binary audio into the bootstrap registry by default. |

## Why metadata only

The bootstrap registry should stay lightweight and code-first. Heavy media belongs in one of these later lanes:

1. GitHub Release assets
2. A dedicated `miseos-media-kit` repository
3. A CDN-backed docs hub
4. A design system package if the assets become part of product UI

## Registry usage

The theme can later support:

- Animated GitHub Pages docs intro
- Launch trailer
- Registry dashboard ambience
- Mise Orchestra character gallery
- Product walkthrough video
