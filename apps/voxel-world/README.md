# MiseOS GridWorld

Browser-playable 3D voxel simulation for the MiseOS agent ecosystem. The project loads canonical character records from `miseos-ecosystem-135.json` and preserves the separation between **112 character agents** and **23 registry manifests**.

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL, select **Enter simulation**, click the world to lock the pointer, and use **WASD**. Click an agent NPC to inspect its identity and assign a workflow mission.

## Production

```bash
npm test
npm run build
npm run preview
```

Deploy the generated `dist/` directory to Vercel, GitHub Pages, or DigitalOcean App Platform.

## Architecture

- React + TypeScript + Vite
- React Three Fiber / Drei / Three.js
- Zustand local simulation state
- Seeded deterministic voxel terrain
- Instanced terrain meshes
- Canonical agent JSON subset ready to expand to all 112 or 300 future agents

## Extension points

- Replace cube NPCs with GLB character assets.
- Add Rapier rigid-body collision and jump physics.
- Connect GridOps live status endpoints.
- Add portals, quests, inventory, and persistent saves.
- Add chunk streaming for larger worlds.
