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

No wallet signing, private keys, seed phrases, RPC credentials, or minting logic belongs in this package.

## Commands

```bash
pnpm --filter @miseos/shimeji-brigade validate
pnpm --filter @miseos/shimeji-brigade build:packs
pnpm --filter @miseos/shimeji-brigade export:metadata
```

Candidate PNG frames are stored in `assets/sprite-packs-v8.tar.gz` and extracted deterministically before validation. They pass structural checks but remain visually unapproved until replaced with reference-accurate art derived from the character packet.

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
