# @goodshyt/mise-orchestra

> Everything in its place, before it hits production.

`mise-orchestra` is a zero-friction CLI that scaffolds the **Mise DevOps Orchestra** configuration system into any repository — no lock-in, no mutations to existing files, and always advisory-first.

---

## Quick start

```bash
npx @goodshyt/mise-orchestra init
```

That's it. Two files are written:

| File | Purpose |
|------|---------|
| `mise.yaml` | Policy config — the single source of truth for your Orchestra rules |
| `.github/workflows/mise-orchestra.yml` | Advisory GitHub Actions workflow |

---

## What gets written

### `mise.yaml`

A fully-commented YAML file with:

- **`mode: advisory`** — posts comments on PRs, never blocks a merge
- **`repo_profile`** — auto-detected heuristic (service / library / infra / data / docs)
- **`policies`** — PR size limits, stewardship rules, security guards
- **`modules`** — feature flags for each Orchestra chef

### `.github/workflows/mise-orchestra.yml`

A GitHub Actions workflow scoped to pull requests and pushes to `main`. Runs
in advisory mode only. Uses `actions/checkout@v6`.

---

## Flags

```
mise-orchestra init [options]

Options:
  --profile <profile>        Repo profile (service | library | infra | data | docs)
                             Auto-detected from marker files when omitted.
  --environment <env>        CI environment (github | gitlab | bitbucket | local)
                             Auto-detected from .git/config when omitted.
  --force                    Overwrite files that already exist.
  --dry-run                  Preview what would be written without touching disk.
  --with-docs                Also write docs/mise-orchestra.md — a team orientation guide.
  -v, --version              Print version number.
  -h, --help                 Display help.
```

---

## Profile auto-detection

`init` inspects top-level marker files to guess your repo type:

| Profile | Detected when |
|---------|---------------|
| `service` | `Dockerfile`, `docker-compose.yml`, `Procfile`, or a private package with a `start` script |
| `library` | `package.json` with `main`/`types`/`exports` and `private` not set to `true` |
| `infra` | `*.tf`, `Chart.yaml`, `Pulumi.yaml`, Ansible config |
| `data` | `*.ipynb`, `dbt_project.yml`, `dags/`, `notebooks/` |
| `docs` | `mkdocs.yml`, `docusaurus.config.js`, `_config.yml` |

Falls back to `service` when signals are absent or tied. Override with `--profile`.

---

## Safety contract

- **Never overwrites** an existing file without `--force`
- **Never runs git commands** that modify history or working tree
- **Never sets mode to `enforced`** — that's always an explicit human decision
- **`--dry-run`** shows exactly what would happen before anything is written

---

## Advancing to enforced mode

When your team trusts the advisory signal, flip one line in `mise.yaml`:

```yaml
mise:
  mode: enforced   # was: advisory
```

Commit, PR, merge. Mise will now fail the check when a policy is violated.

---

## Contributing

```bash
git clone https://github.com/GoodshytGroup/mise-orchestra
cd mise-orchestra
npm ci
npm run build
npm test
```

All tests must pass before opening a PR. Conventional Commits required.

---

## License

MIT © GoodShyt Group
