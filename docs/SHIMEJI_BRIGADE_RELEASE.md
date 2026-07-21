# Shimeji Brigade consolidated release

Shimeji Brigade is the MiseOS character-runtime layer for reference-backed autonomous sprite agents.

## Current consolidated package

- v6 sprite-pack contract and CI validator
- real 37-frame state plan for Mizu and Kurogami
- v8 Character Studio static UI
- brand tokens, CSS variables, logo direction, and copy rules
- runtime ZIP export flow
- mint-ready metadata bridge export

## Clean boundary

```text
Shimeji Brigade Studio
  -> upload, crop, clean, canonicalize, derive frames, validate, export

Shimeji Brigade Runtime
  -> load, preview, and animate exported sprite packs

Shimeji Mint
  -> rights attestation, storage, IPFS pinning, Polygon ERC-721 / ERC-2981 provenance
```

No wallet signing, private keys, seed phrases, production credentials, or minting logic belong in the Brigade package.

## Local verification

```bash
pnpm --filter @miseos/shimeji-brigade generate:frames
pnpm --filter @miseos/shimeji-brigade validate
pnpm --filter @miseos/shimeji-brigade build:packs
pnpm --filter @miseos/shimeji-brigade export:metadata
```

The generator creates 37 transparent 128×128 PNG frames per launch character:

- idle: 6
- walk: 8
- climb: 6
- fall: 4
- drag: 3
- interact: 6
- perch: 4

## Output locations

```text
packages/shimeji-brigade/assets/sprites/<id>/
packages/shimeji-brigade/reports/reference-frame-generation.json
packages/shimeji-brigade/exports/<id>-runtime-pack.zip
packages/shimeji-brigade/exports/mint-ready-metadata.json
packages/shimeji-brigade/studio/index.html
```
