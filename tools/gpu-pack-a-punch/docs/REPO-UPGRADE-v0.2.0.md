# Repository Upgrade v0.2.0

Target repository: `DeontewattsV1/Mise-Enhanced-GPU-Pack-a-Punch`

## Upgrade contents

This release upgrades the GitHub Actions runner pack into a repository-ready system:

1. Base Mise Pack-a-Punch workflow machine.
2. Optional GPU complexity lane for trusted ephemeral self-hosted runners.
3. Vendored skill-pack catalog from the uploaded `skills-main.zip` in the full package.
4. Skill index, validation, and routing scripts.
5. Documentation for the skill-pack trust boundary.

## Recommended branch

```bash
git checkout -b upgrade/v0.2.0-skill-pack
```

## Validation

```bash
python scripts/mise/skill_pack_index.py --root vendor/nv-skills --out-dir .mise_out --fail-on-empty
python scripts/mise/validate_skill_pack.py --root vendor/nv-skills --out .mise_out/skill-pack-validation.json
node scripts/mise-skill-router.mjs .mise_out/skill-pack-index.json cuda gpu
```

## Merge policy

Do not auto-merge. Review the generated skill-pack index and validation artifact first.
