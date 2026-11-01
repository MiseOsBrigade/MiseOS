# AVAL Animated Collectibles

AVAL is incorporated into MiseOS as the web-native motion layer for collectible-card previews.

It does **not** replace the character's canonical GLB model. The GLB remains the editable and interoperable 3D asset; an `.avl` file is a deterministic prerendered presentation asset used for continuous loops, bounded transitions, authored states, and accessible web playback.

## Why this fits MiseOS

AVAL packages independently decodable motion units and a deterministic state graph into one `.avl` asset. MiseOS can use that model to express collectible states such as:

- `idle`
- `inspect`
- `ability`
- `approved`
- `warning`
- `locked`
- `release-ready`
- `reduced-motion`

The host application controls the active state instead of manually seeking through a video timeline.

## Canonical asset paths

```text
media/images/3d/<group>/<slug>/hero.webp
media/models/3d/<group>/<slug>/<slug>.glb
media/animations/aval/<group>/<slug>/<slug>.avl
media/animations/aval/<group>/<slug>/fallback.webp
metadata/3d/<group>/<slug>.json
cards/3d/<group>/<slug>.md
```

## Runtime installation

```bash
npm install @pixel-point/aval-element@1.0.0
npm install --save-dev @pixel-point/aval-compiler@1.0.0
```

Node.js 22.12.0 or newer is required by the supplied AVAL workspace. Compiling source motion also requires caller-installed FFmpeg, FFprobe, and libx264. MiseOS must not download or silently bundle those native tools.

## Browser integration

Register the element once:

```js
import { defineAvalElement } from "@pixel-point/aval-element";

defineAvalElement();
```

Render a character with a host-owned fallback:

```html
<aval-player
  src="/media/animations/aval/agents/release-sentinel/release-sentinel.avl"
  width="720"
  height="1080"
  aria-label="MiseOS Release Sentinel animated collectible"
>
  <img
    slot="fallback"
    src="/media/animations/aval/agents/release-sentinel/fallback.webp"
    alt="MiseOS Release Sentinel collectible card"
  >
</aval-player>
```

Change an authored state:

```js
const player = document.querySelector("aval-player");
await player?.setState("release-ready");
```

## Metadata extension

Each character metadata record can expose both geometry and motion:

```json
{
  "media": {
    "image": "media/images/3d/agents/release-sentinel/hero.webp",
    "model_3d": "media/models/3d/agents/release-sentinel/release-sentinel.glb",
    "animation_url": "media/animations/aval/agents/release-sentinel/release-sentinel.avl",
    "animation_fallback": "media/animations/aval/agents/release-sentinel/fallback.webp"
  },
  "animation": {
    "format": "aval/0.1",
    "states": ["idle", "inspect", "warning", "release-ready"],
    "default_state": "idle",
    "reduced_motion_state": "reduced-motion"
  }
}
```

## Proof gates

An animated collectible remains `pending-aval` until all of the following are present:

1. The referenced `.avl` file exists.
2. A host-owned fallback image exists.
3. The authored states match metadata.
4. The player successfully loads in a supported browser profile.
5. Unsupported environments retain fallback content.
6. Reduced-motion behavior has been reviewed.
7. Integrity and provenance values have been recorded.
8. The source GLB and prerender source are traceable.
9. Licensing for source media, codec use, and distribution is documented.

## Security and deployment boundaries

- Never inject untrusted `.avl` URLs without origin and integrity controls.
- Keep fallback markup visible until runtime capability checks pass.
- Do not mark browser test evidence as physical-display certification.
- Do not claim Safari support until the selected AVAL release supports and validates it.
- Do not mint placeholder animation URLs.
- Keep AVAL package versions synchronized.

## Attribution

The supplied AVAL source is MIT licensed and identifies copyright as:

> Copyright (c) 2026 AVAL contributors

MiseOS integration code and character assets remain governed by their respective repository and asset licenses. Incorporating AVAL does not transfer ownership of AVAL or remove its attribution requirements.
