# Script Patch Notes

## Purpose

The art factory script now permanently separates character cards from registry/package manifests.

## Fixed

Removed the mixed-loading pattern:

```python
for row in csv_rows(CARDS_CSV_PATH) + csv_rows(REGISTRY_CSV_PATH):
```

Replaced with character-only loading:

```python
for row in csv_rows(CARDS_CSV_PATH):
```

## Added

- `DEFAULT_REGISTRY_MANIFESTS` with 23 registry/package items.
- `load_registry_catalog()`
- `write_registry_catalog_manifest()`
- `write_brand_docs()`
- Updated `cmd_prepare()` to write registry + brand docs.
- Updated `cmd_all()` to write registry + brand docs.

## Outputs

```text
output/merged_roster.json
output/manifests/registry_catalog_manifest.json
output/manifests/REGISTRY_CATALOG.md
README.md
.github/profile/README.md
```

## Count Model

```text
Character cards:        112
Registry manifests:      23
Total ecosystem items:  135
```
