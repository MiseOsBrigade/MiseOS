# 4D Visualization Architecture

## Coordinate model

The interface uses four application dimensions rather than claiming literal four-dimensional rendering.

| Coordinate | Purpose |
|---|---|
| Evidence | Source, claim, citation, and verification state |
| Work | Project, task, tool, and workflow state |
| Memory | Content object, snapshot, reference, and audit lineage |
| Time | Freshness, age, deadline, and state transition |

## WebGL policy

- Grid cards are static until activation.
- A single global `activeViewerId` permits one card canvas.
- Detail mode becomes the only high-quality canvas.
- Reduced-motion preferences disable automatic rotation.
- Real models are loaded through `useGLTF` and may be cleared on close.
- Procedural geometry provides a zero-binary fallback.

## Storage boundary

Postgres stores:

- metadata
- relations
- vector references
- memory telemetry
- provenance
- status and freshness

Object storage/CDN stores:

- `.glb`
- `.gltf`
- textures
- thumbnails
- environment maps

The API returns signed or public asset URLs. The UI never needs database credentials.
