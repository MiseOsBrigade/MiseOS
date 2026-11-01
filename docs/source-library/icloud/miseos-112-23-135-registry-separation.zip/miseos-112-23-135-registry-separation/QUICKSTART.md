# Quickstart

1. Drop your 112-character card inputs into `input/`:

```text
input/characters.generated.json
input/mise_orchestra_collection_manifest.json
input/mise_orchestra_cards.csv
```

2. Keep registry/package items in:

```text
input/miseos-registry-catalog.csv
```

3. Run:

```bash
python miseos_art_factory_v2_single.py prepare --backend local
```

Expected model:

```text
Character cards:        112
Registry manifests:      23
Total ecosystem items:  135
```

The script writes:

```text
output/merged_roster.json
output/manifests/registry_catalog_manifest.json
output/manifests/REGISTRY_CATALOG.md
README.md
.github/profile/README.md
```
