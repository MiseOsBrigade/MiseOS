# Sprite-pack export format

Each character export has this shape:

```text
<character>/
  manifest.json
  <state>/frame_001.png
  ...
```

The manifest declares `id`, `frameSize`, `states`, `format`, and `transparent`. Every state count is exact and every frame is a transparent 8-bit 128×128 PNG.

An export bundle should also include:

```json
{
  "manifest": "manifest.json",
  "frames": ["idle/frame_001.png"],
  "registry": {
    "id": "mizu",
    "spriteRoot": "assets/sprites/mizu",
    "referenceSource": "IMG_5944 2(2).pdf page 1"
  },
  "validationReport": { "ok": true, "errors": [], "warnings": [] },
  "preview": { "state": "idle", "background": "#07130f", "scale": 1 }
}
```

The repository intentionally omits binary frames. Run `node scripts/generate-placeholder-frames.mjs` locally to generate transparent development placeholders.
