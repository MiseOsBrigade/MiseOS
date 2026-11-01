# Shimeji Brigade v9 — Unified Production Monorepo

A repo-ready foundation for converting approved reference art into validated Shimeji sprite packs, previewing their behavior, and exporting provenance-ready metadata through a separate Mint bridge.

## Product boundary

```text
Character Studio → crop, clean, canonicalize, derive, validate, export
Runtime Preview  → load and animate validated packs
Shimeji Mint     → rights attestation, storage, IPFS, provenance, publishing
```

No wallet custody, private keys, seed phrases, RPC secrets, or blockchain signing logic are included.

## Current scaffold status

Mizu and Kurogami are represented by validated fallback-safe manifests with zero frames until approved reference-backed PNGs are imported.

## Quick start

```bash
corepack enable
pnpm install
pnpm check
```

## Import existing art

Place approved transparent 128×128 PNGs under:

```text
assets/sprites/<character>/<state>/frame_001.png
```

Then update the corresponding state count in `manifest.json` and run `pnpm check`.

## Canonical identities

- Mizu — blue-haired Ticket Alchemist
- Kurogami — Chef Sentinel

## MiseOS ecosystem boundary

**112 character agents + 23 registry manifests = 135 MiseOS ecosystem items.** Registry manifests are infrastructure/product records, not character cards.
