# Shimeji Brigade

Shimeji Brigade is the visual character-runtime layer for MiseOS. Version 0.8 unifies the runtime, candidate sprite packs, reference-to-pack boundary, Character Studio direction, validation tooling, runtime exports, and brand system.

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

Candidate PNG frames are stored in `assets/sprite-packs-v8.tar.gz` and extracted deterministically before validation. They pass structural checks but remain visually unapproved until replaced with reference-accurate art derived from the character packet.
## Character Studio

Open the static Studio prototype at:

```text
packages/shimeji-brigade/studio/index.html
```

The Studio provides the repo-ready UI path for reference upload, crop preview, canonical 128×128 approval, motion state planning, manifest download, and validation preview.

## Pack contract

## Character mapping

- Mizu: page 1, blue-haired Ticket Alchemist
- Kurogami: page 2, Chef Sentinel

Each candidate pack contains 37 frames across `idle`, `walk`, `climb`, `fall`, `drag`, `interact`, and `perch`.

## Integrity status

- structural validation: enabled
- PNG dimensions: 128×128
- runtime export: enabled
- Shimeji Mint metadata bridge: enabled
- visual reference fidelity: human approval required
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
