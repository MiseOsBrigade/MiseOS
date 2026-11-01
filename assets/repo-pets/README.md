# Repo pets

Animated Shimeji-style strips for the root README.

- `cutouts/` — 16 character cutouts taken from the Mise Orchestra Season 1 trading-card art (one per character; slug = file name).
- `sprites/<id>/<state>/frame_NNN.png` — Shimeji Brigade sprite frames (walk, idle, perch, climb) for Kurogami and Mizu, rendered from the sprite-pack generator in `apps/developer-platform/packages/shimeji-brigade`.
- `walk-header.svg`, `walk-kitchen.svg`, `walk-footer.svg` — generated, self-contained animated SVGs (frames embedded, no external images).

Regenerate with `node tools/repo-pet/scripts/build-readme-pets.mjs` (`--seed=<text>` for a fixed line-up, `--rotate` for a date-based line-up).
