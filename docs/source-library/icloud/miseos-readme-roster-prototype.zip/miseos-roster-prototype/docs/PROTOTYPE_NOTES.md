# Prototype Notes

This proof was built locally only. It does not merge, push, or modify any remote repository.

## Inputs Used

- `characters.generated.json` — core 75-character roster.
- `mise_orchestra_cards.csv` — Season 1 / expansion collectible card overlay.
- `mise_orchestra_collection_manifest.json` — Polygon / ERC-721 / ERC-2981 creator collectible manifest.
- `miseos-registry-catalog.csv` — package and registry catalog.
- Uploaded visual references — holo phone, Mystic card, GitHub design-system roster screenshots, department cards, brand guides, and kitchen dashboard images.

## Generated Output

- `index.html` — interactive proof UI.
- `README.md` — repo README replacement draft.
- `data/all-characters.json` — merged core + expansion roster.
- `characters/<id>/README.md` — character folders.
- `teams/<department>/TEAM.md` — team folders.
- `assets/characters/<id>/*.svg` — generated proof card/avatar assets.

## Roster Counts

```json
{
  "core75": 75,
  "collection_manifest_cards": 23,
  "expansion_only_added": 17,
  "prototype_total_cards": 92,
  "departments": {
    "pipeline": 19,
    "platform": 18,
    "reliability": 16,
    "security": 15,
    "data-insight": 20,
    "operations": 4
  },
  "rarities": {
    "genesis": 15,
    "rare": 23,
    "common": 39,
    "epic": 10,
    "mythic": 2,
    "legendary": 3
  }
}
```

## Next Build Pass

1. Replace generated SVG placeholders with final isolated PNG/WebP sprites.
2. Add real animation URIs / 3D model slots.
3. Convert cards into a React component for the real repo dashboard.
4. Add GitHub Pages workflow once you approve the proof.
5. Add Minty/DigitalOcean metadata deployment script.
