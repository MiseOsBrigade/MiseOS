# Polyrepo Manifest Validation

Validates a system release manifest whose component refs are immutable semantic-version tags or commit SHAs.

**Item ID:** `workflow-polyrepo-manifest`
**Category:** `workflow`

**Installed paths:**
- `.github/workflows/polyrepo-manifest-lint.yml`
- `scripts/validate_polyrepo_manifest.py`
- `release.yaml`

Install:

```bash
bash items/workflow-polyrepo-manifest/install.sh .
```

**Notes:**
- Edit YOUR-ORG component references in release.yaml before using it.
