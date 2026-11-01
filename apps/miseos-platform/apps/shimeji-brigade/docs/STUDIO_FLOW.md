# Shimeji Brigade studio flow

The studio turns a rights-cleared character reference into a runtime-safe pack:

```text
upload → crop → cleanup → canonical 128×128 → derive frames → validate → export
```

1. **Upload:** record the reference source and rights note; do not put private attachments in the public pack.
2. **Crop:** preserve a consistent transparent canvas and a readable silhouette.
3. **Cleanup:** remove background noise, accidental marks, and unsafe metadata.
4. **Canonical 128×128:** center the chibi and keep padding stable across frames.
5. **Derive frames:** create `idle`, `walk`, `climb`, `fall`, `drag`, `interact`, and `perch`.
6. **Validate:** check manifest state counts, `frame_###.png` names, dimensions, bit depth, and alpha.
7. **Export:** emit the manifest, frames, registry entry, validation report, and preview configuration.

Missing frames are an expected development state. The runtime uses a procedural fallback and reports the missing station instead of crashing.
