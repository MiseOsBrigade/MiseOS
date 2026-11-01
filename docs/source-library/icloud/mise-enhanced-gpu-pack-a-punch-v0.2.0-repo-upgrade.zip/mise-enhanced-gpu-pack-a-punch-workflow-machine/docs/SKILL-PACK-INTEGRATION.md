# Skill Pack Integration

This upgrade vendors the uploaded `skills-main.zip` under `vendor/nv-skills/` and treats it as an inert, auditable skill catalog.

## What changed

- `vendor/nv-skills/` stores the uploaded skill pack source, docs, component manifests, and license.
- `scripts/mise/skill_pack_index.py` creates deterministic JSON and Markdown indexes from `SKILL.md` and `components.d/*.yml`.
- `scripts/mise/validate_skill_pack.py` scans the pack for structural issues and obvious risky shell patterns without executing skill content.
- `.github/workflows/mise-skill-pack-index.yml` runs the index and validation lane in pull requests.
- `scripts/mise-skill-router.mjs` can recommend relevant skills from a generated index.

## Safety model

Mise does not execute vendored skills automatically. The pack is used as a searchable routing and evidence layer. Execution still belongs to explicit workflows, least-privilege tokens, and isolated runners.

## Local commands

```bash
python scripts/mise/skill_pack_index.py --root vendor/nv-skills --out-dir .mise_out --fail-on-empty
python scripts/mise/validate_skill_pack.py --root vendor/nv-skills --out .mise_out/skill-pack-validation.json
node scripts/mise-skill-router.mjs .mise_out/skill-pack-index.json cuda quantum gpu
```

## GitHub Actions outputs

The workflow uploads:

- `skill-pack-index.json`
- `skill-pack-index.md`
- `skill-pack-validation.json`
