# Reference-to-pack pipeline

The reference-to-pack pipeline turns approved character art into a runtime-safe Shimeji sprite pack.

## Stages

1. Upload reference image or rasterized PDF page.
2. Crop the character silhouette.
3. Clean background to transparency.
4. Approve a canonical 128×128 master.
5. Derive motion frames for seven required states.
6. Validate manifest, frame counts, filenames, PNG format, and dimensions.
7. Export a runtime pack and mint bridge metadata.

## Required states

| State | Frames | Motion cue |
|---|---:|---|
| idle | 6 | light bob and subtle sway |
| walk | 8 | alternating sway and bounce |
| climb | 6 | vertical reach illusion |
| fall | 4 | downward offset and surprised tilt |
| drag | 3 | compressed lateral pull |
| interact | 6 | wave, present, or gesture |
| perch | 4 | settled compact pose |

## Quality bar

A pack is not accepted because frames merely exist. It is accepted when identity survives at 128×128:

1. silhouette fidelity
2. hair/clothing color fidelity
3. recognizable role cue
4. consistent scale across every state
5. transparent PNG frames with no runtime-breaking omissions

## Runtime rule

The runtime may load, preview, and animate packs. It must not sign, mint, custody secrets, or publish on-chain assets.
