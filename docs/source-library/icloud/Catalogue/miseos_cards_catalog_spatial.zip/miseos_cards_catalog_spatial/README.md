# MiseOS Spatial Brigade Cards Catalog

> **112 character agents + 23 registry manifests = 135 MiseOS ecosystem items.**

This build cleans up, extends, and reframes the roster into an interactive spatial-screen card catalog.

## Included

- `index.html`, `styles.css`, `app.js`: searchable static catalog with 3D hover, filters, and metadata drawer.
- `metadata/*.json`: 112 character metadata files.
- `assets/images/`: reference art when aligned, branded placeholders when art is not yet mapped.
- `assets/reference/`: all 105 PDF pages rendered as reference images.
- `assets/thumbnails/`: low-resolution reference thumbnails.
- `media/animation`, `video`, `models`, `audio`, `ar`: extension slots and slot manifests.
- `catalog/cards-catalog.json|csv`: flattened catalog.
- `registry/registry-manifests.json`: separate 23-item infrastructure catalog.
- `taxonomy/taxonomy.json`: departments, rarities, record kinds, registry types, provenance, brand, stats, workflows, and media taxonomy.
- `deployment/upload_to_spaces.py`: DigitalOcean Spaces uploader. Dry-run by default.
- `deployment/minty-uri-map.template.json`: token URI mapping template.
- `deployment/validate_catalog.py`: count and metadata validator.
- `miseos_cards_catalog_spatial.xlsx`: extended workbook.

## Run locally

```bash
python3 -m http.server 4175
# open http://localhost:4175
```

## Validate

```bash
python3 deployment/validate_catalog.py
```

## Upload to DigitalOcean Spaces

```bash
python3 -m pip install boto3
cp deployment/.env.example .env
# export the variables through your secret manager
python3 deployment/upload_to_spaces.py
python3 deployment/upload_to_spaces.py --apply
```

The uploader does not upload empty `.slot.json` placeholders. Add the real animation, video, GLB, audio, and USDZ files before the production upload.

## Minty activation

`deployment/minty-uri-map.template.json` is intentionally not activated. Confirm the target Minty contract/dashboard, network, token numbering, CDN base URL, and approved license before setting token URIs.

Registry manifests remain product infrastructure and are excluded from the 112-token character collection.
