# MiseOS Full Roster and Taxonomy Metadata

> **112 character agents + 23 registry manifests = 135 MiseOS ecosystem items.**

This package separates the collectible character roster from product infrastructure.

## Contents

- `data/characters.json` and `data/characters.csv` - canonical 112-character roster.
- `registry/registry-manifests.json` and `.csv` - canonical 23-item product catalog.
- `data/miseos-ecosystem-135.json` - combined ecosystem envelope with separate arrays.
- `taxonomy/taxonomy.json` and `.csv` - record kinds, departments, rarities, registry types, brand tokens, and provenance rules.
- `photo-alignment/photo-alignment.json` and `.csv` - all 105 uploaded PDF pages aligned to canonical records when possible.
- `thumbnails/` - low-resolution page references used for visual alignment.
- `miseos_full_roster_taxonomy.xlsx` - workbook view of all metadata.

## Provenance

- 92 character records are directly transcribed from the supplied roster text.
- 20 visually distinct cards from PDF pages 9-28 complete the canonical 112-character count.
- The PDF contains repeated cards and additional visual-only concepts; those are retained in `photo-alignment` without being silently promoted into the canonical roster.
- Registry manifests remain product infrastructure and are never counted as characters.

## Counts

### Departments

- Data & Insight Kitchen: 20
- Operations Kitchen: 24
- Pipeline Kitchen: 19
- Platform Kitchen: 18
- Reliability Kitchen: 16
- Security Kitchen: 15

### Rarities

- Common: 40
- Epic: 19
- Genesis: 15
- Legendary: 6
- Mythic: 2
- Rare: 30

### Photo alignment

- PDF pages: 105
- Pages matched to a canonical character or registry manifest: 60
- Visual-reference-only pages: 45
