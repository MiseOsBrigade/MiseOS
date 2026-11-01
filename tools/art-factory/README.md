# MiseOS Art Factory Option B

Single-file upgraded version for chibi/kawaii/shimeji generation, premium card rendering, sprite sheets, and ERC-721 metadata.

## Quick start

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install Pillow requests python-slugify

mkdir -p input/source_images
cp characters.generated.json input/
cp mise_orchestra_collection_manifest.json input/
cp mise_orchestra_cards.csv input/

python miseos_art_factory_v2_single.py prepare --backend local
python miseos_art_factory_v2_single.py cards
python miseos_art_factory_v2_single.py shimeji
python miseos_art_factory_v2_single.py preview
```

## Fal generation

```bash
export FAL_KEY="..."
python miseos_art_factory_v2_single.py prepare --backend fal
python miseos_art_factory_v2_single.py generate --style chibi --backend fal --limit 5
```

## Backends

- `local` writes prompt job JSON files.
- `fal` submits to Fal queue endpoints.
- `webhook`, `yepcode`, `catalyst` post jobs to a custom endpoint.
- `photoshop` writes Adobe Photoshop cleanup manifests.
