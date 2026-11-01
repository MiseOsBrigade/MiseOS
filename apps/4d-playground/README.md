# Mise 4D Repository Playground

A React + React Three Fiber prototype for visualizing the Mise-en-place Knowledge SheetGrid across four dimensions:

- **Evidence** — sources, claims, citations, and provenance
- **Work** — projects, tasks, tools, and workflows
- **Memory** — objects, snapshots, references, and audit lineage
- **Time** — freshness, review age, and state transitions

## Memory strategy

The app avoids opening a WebGL context for every card.

1. Cards render CSS thumbnails by default.
2. Hovering for 220 ms activates exactly one card canvas.
3. Opening detail mode deactivates card canvases.
4. Detail mode uses the higher-quality renderer and environment.
5. Optional GLB models are cached through `useGLTF`.
6. Closing a heavy model detail explicitly clears its GLTF cache.
7. The telemetry rail compares raw float32 vector bytes with the stored quantized estimate.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Add real GLB/GLTF files

Place models in `public/models/` and thumbnails in `public/thumbnails/`.

Then add these fields to an asset in `src/data/assets.ts`:

```ts
modelUrl: '/models/example.glb',
thumbnail: '/thumbnails/example.webp',
```

When `modelUrl` is absent, the viewer uses a procedural Three.js geometry so the repository works without binary assets.

## Backend integration

Replace `src/data/assets.ts` with an API adapter returning `RepositoryAsset[]`.

Recommended endpoint:

```http
GET /api/assets?dimension=evidence&query=provenance
```

Recommended fields:

```json
{
  "id": "CLM-012",
  "title": "Evidence-Bounded Claim",
  "author": "Aletheia Lattice",
  "summary": "A verified claim linked to a primary source.",
  "status": "Verified",
  "confidence": "High",
  "dimension": "evidence",
  "tags": ["claim", "verified"],
  "sourceId": "SRC-004",
  "modelUrl": "https://cdn.example.com/models/claim-node.glb",
  "thumbnail": "https://cdn.example.com/thumbs/claim-node.webp",
  "lastVerified": "2026-07-12",
  "createdAt": "2026-05-18",
  "updatedAt": "2026-07-12",
  "memoryBytes": 6144,
  "quantizedBytes": 672,
  "geometry": "icosahedron"
}
```

Keep Postgres as metadata truth and serve GLB/GLTF binaries from object storage or a CDN. Do not store large model binaries directly inside Postgres.
