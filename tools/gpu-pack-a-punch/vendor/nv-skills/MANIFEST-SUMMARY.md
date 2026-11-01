# Vendored Skill Pack Manifest Summary

Source package: uploaded `skills-main.zip`

The full local upgrade artifact includes the complete vendored catalog at `vendor/nv-skills/`.

Generated inventory from the local package:

- Skills indexed: 155
- Components indexed: 16
- Local validation findings: 18 warnings, 0 structural errors
- Execution mode: metadata-only by default

## Review path

1. Apply the full local upgrade package.
2. Run `python scripts/mise/skill_pack_index.py --root vendor/nv-skills --out-dir .mise_out --fail-on-empty`.
3. Run `python scripts/mise/validate_skill_pack.py --root vendor/nv-skills --out .mise_out/skill-pack-validation.json`.
4. Review `.mise_out/skill-pack-index.md` and `.mise_out/skill-pack-validation.json` before merging vendored content.

## Trust boundary

The skill pack is intended for indexing, recommendation, and documentation evidence. Mise must not execute vendored skills automatically.
