# Repository Governance

Repository governance workflow with its required local repo-health Action.

**Item ID:** `workflow-repo-governance`
**Category:** `workflow`

**Dependencies / prerequisites:**
- `README.md`
- `LICENSE`
- `SECURITY.md`
- `CONTRIBUTING.md`
- `.gitignore`

**Installed paths:**
- `.github/workflows/repo-governance.yml`
- `actions/repo-health/action.yml`
- `actions/repo-health/dist/index.js`

Install:

```bash
bash items/workflow-repo-governance/install.sh .
```

**Notes:**
- The health score is based on expected governance files.
