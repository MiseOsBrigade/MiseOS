# Shimeji Brigade runtime

The Shimeji Brigade runtime is a static p5.js WEBGL scene for two autonomous chibi agents:

- **Mizu**, Ticket Alchemist, Linkers
- **Kurogami**, Chef Sentinel, Sentinels

Open `index.html` through a local static server. The scene combines quaternion rings, a half-angle spinor belt, Hopf links, a particle manifold, and personality-driven roamers with `idle`, `walk`, `climb`, `fall`, `drag`, `interact`, and `perch` states.

## Sprite packs

Manifests live under `assets/sprites/<id>/manifest.json`. Binary PNG frames are intentionally not committed. Generate transparent development frames locally:

```bash
node scripts/generate-placeholder-frames.mjs
```

`src/SpritePackValidator.js` validates declared states, frame names/counts, dimensions, alpha, and PNG headers. Missing or broken frames are safe: the browser renders a procedural blue-haired Mizu or chef-white Kurogami fallback instead of crashing.

## Clean boundary

This runtime contains **no wallet logic, private keys, or minting code**. Shimeji Mint is a separate future boundary for rights attestation, IPFS publication, and Polygon ERC-721/ERC-2981 provenance. The runtime does not make investment or value claims.

See `docs/STUDIO_FLOW.md` and `docs/EXPORT_FORMAT.md` for the asset pipeline.
