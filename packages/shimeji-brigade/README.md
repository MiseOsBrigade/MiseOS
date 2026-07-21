# Shimeji Brigade

Shimeji Brigade is the visual character-runtime layer for MiseOS. It turns approved reference art into validated 128×128 sprite packs that can roam in documentation, demos, and GridOps surfaces.

## Boundary

```text
Shimeji Brigade Studio
  -> upload, crop, clean, canonicalize, derive frames, validate, export

Shimeji Brigade Runtime
  -> load, preview, and animate validated sprite packs

Shimeji Mint
  -> rights attestation, storage, IPFS pinning, and optional publishing
```

No wallet signing, private keys, seed phrases, or minting logic belongs in this package.

## Commands

```bash
pnpm --filter @miseos/shimeji-brigade validate
pnpm --filter @miseos/shimeji-brigade build:packs
pnpm --filter @miseos/shimeji-brigade export:metadata
```

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

- **Mizu** — Ticket Alchemist
- **Kurogami** — Chef Sentinel

The current manifests define the intended frame counts, but `referenceBacked` remains `false` until approved source art and matching frames are committed. This prevents placeholder artwork from being presented as canonical character IP.

## Runtime export

The build step creates one runtime bundle per character plus a metadata bridge document. Runtime bundles contain only animation assets, registry data, and validation evidence.
