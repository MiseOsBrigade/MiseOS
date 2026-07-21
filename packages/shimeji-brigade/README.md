# Shimeji Brigade

Shimeji Brigade is the visual character-runtime layer for MiseOS. It turns approved reference art into validated 128×128 sprite packs that can roam in documentation, demos, and GridOps surfaces.

## Boundary

```text
Shimeji Brigade Studio
  -> upload, crop, clean, canonicalize, derive frames, validate, export

Shimeji Brigade Runtime
  -> load, preview, and animate validated sprite packs

Shimeji Mint
  -> rights attestation, storage, IPFS pinning, and optional Polygon publishing
```

No wallet signing, private keys, seed phrases, production credentials, or minting logic belongs in this package.

## Commands

```bash
pnpm --filter @miseos/shimeji-brigade generate:frames
pnpm --filter @miseos/shimeji-brigade validate
pnpm --filter @miseos/shimeji-brigade build:packs
pnpm --filter @miseos/shimeji-brigade export:metadata
pnpm --filter @miseos/shimeji-brigade build
```

## Character Studio

Open the static Studio prototype at:

```text
packages/shimeji-brigade/studio/index.html
```

The Studio provides the repo-ready UI path for reference upload, crop preview, canonical 128×128 approval, motion state planning, manifest download, and validation preview.

## Pack contract

Every character pack contains a `manifest.json` and seven required states:

- `idle`
- `walk`
- `climb`
- `fall`
- `drag`
- `interact`
- `perch`

Frames must be transparent 128×128 PNG files named `frame_001.png`, `frame_002.png`, and so on.

## Launch characters

| Character | Role | Reference source | Frames |
|---|---|---|---:|
| Mizu | Ticket Alchemist | `IMG_5944 2.pdf` page 1 | 37 |
| Kurogami | Chef Sentinel | `IMG_5944 2.pdf` page 2 | 37 |

The committed generator creates first-pass reference-backed motion frames that preserve visual role, color, and silhouette cues until final hand-drawn animation frames are approved.

## Runtime export

The build step creates one runtime bundle per character plus a metadata bridge document. Runtime bundles contain only animation assets, registry data, validation evidence, and preview config.

## Brand kit

Brand tokens and copy rules live under:

```text
packages/shimeji-brigade/brand/
```
