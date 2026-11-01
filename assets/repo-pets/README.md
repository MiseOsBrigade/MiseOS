# Repo pets

Animated Shimeji-style strips for the root README.

- `cutouts/` — character cutouts at native card resolution (~400px tall, from the 768×1075 Mise Orchestra Season 1 trading cards, background removed at full resolution with rembg isnet-anime; crop boxes in `cutouts/cutouts.json`, rebuild with `python3 tools/repo-pet/scripts/build-cutouts.py`) plus 384px animal mascot cutouts from the 1024px brigade art (native alpha). Shimeji frames are 128px pixel art drawn at native size with `image-rendering: pixelated`.
- `sprites/<id>/<state>/frame_NNN.png` — Shimeji Brigade sprite frames (walk, idle, perch, climb) for Kurogami and Mizu, rendered from the sprite-pack generator in `apps/developer-platform/packages/shimeji-brigade`.
- `walk-header.svg`, `walk-kitchen.svg`, `walk-footer.svg` — generated, self-contained animated SVGs (frames embedded, no external images).

Regenerate with `node tools/repo-pet/scripts/build-readme-pets.mjs` (`--seed=<text>` for a fixed line-up, `--rotate` for a date-based line-up).
