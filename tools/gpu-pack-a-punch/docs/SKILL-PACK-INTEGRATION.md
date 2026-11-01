# Skill Pack Integration

This upgrade integrates the uploaded `skills-main.zip` as a vendored skill catalog for the Mise Pack-a-Punch runner.

## Trust boundary

Vendored skill content is treated as metadata by default. Mise indexes and validates the catalog, but does not execute skill instructions automatically.

## Empty vendor state

If `vendor/nv-skills/` is empty (no SKILL.md files yet), the scripts emit warning artifacts and exit 0 so CI can proceed. This supports pre-populated review branches where the full skill pack is applied later.

## Review path

1. Apply the full local upgrade package (`./apply-upgrade.sh`).
2. Run the indexing and validation commands.
3. Review generated evidence artifacts.
4. Merge when evidence looks safe.

## Added lanes

- `scripts/mise/skill_pack_index.py` creates deterministic JSON and Markdown indexes from `SKILL.md` files and `components.d/*.yml` manifests.
- `scripts/mise/validate_skill_pack.py` scans the pack for missing structure and obvious risky shell patterns without executing content.
- `scripts/mise-skill-router.mjs` recommends matching skills from a generated index.
- `.github/workflows/mise-skill-pack-index.yml` uploads reviewable evidence artifacts.

## Local commands

```bash
python scripts/mise/skill_pack_index.py --root vendor/nv-skills --out-dir .mise_out --fail-on-empty
python scripts/mise/validate_skill_pack.py --root vendor/nv-skills --out .mise_out/skill-pack-validation.json
node scripts/mise-skill-router.mjs .mise_out/skill-pack-index.json cuda gpu
```

## Full artifact

The complete local upgrade package includes the full vendored skill tree under `vendor/nv-skills/` and is available as `mise-enhanced-gpu-pack-a-punch-v0.2.0-repo-upgrade.zip`.
