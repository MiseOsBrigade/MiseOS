# Repo Health Checklist

Run through this top to bottom. Anything unchecked is a finding — write it down, don't
fix it silently. The list of findings *is* the deliverable for a Repo Health Scan.

## Identity & docs
- [ ] README explains what the repo is and how to run it in under 2 minutes of reading
- [ ] LICENSE file present and correct for intended use
- [ ] CONTRIBUTING.md exists (or explicitly states "not accepting contributions")
- [ ] SECURITY.md exists with a real reporting contact/process
- [ ] CLAUDE.md and/or AGENTS.md present for agent legibility

## Repo hygiene
- [ ] .gitignore covers the actual stack (no `node_modules`, `.env`, build output committed)
- [ ] No secrets in commit history (check with `git log -p | grep -i` for common patterns, or a scanner)
- [ ] No large binary files bloating the repo unnecessarily
- [ ] Branch protection on `main` (require PR review, require CI pass)

## Dependencies
- [ ] Dependabot configured (`.github/dependabot.yml` present and not empty)
- [ ] Lockfile committed and in sync with manifest (`npm ci` succeeds without changes)
- [ ] No dependencies pinned to `*` or unbounded ranges in production manifests
- [ ] No known-vulnerable dependencies (check GitHub's Dependency graph / security tab)

## CI/CD
- [ ] CI runs on every PR, not just main
- [ ] CI actually tests something (not just "install and exit 0")
- [ ] All GitHub Actions pinned to major version tags, not `@main`/`@master`
- [ ] No hardcoded secrets in workflow files — uses `secrets.*` context
- [ ] Build passes on a fresh clone (not just "works on my machine")

## Release process
- [ ] Versioning scheme is consistent (semver or documented alternative)
- [ ] CHANGELOG exists or releases have real release notes
- [ ] Tag naming convention is consistent across history

## Community/PR hygiene
- [ ] Issue templates exist
- [ ] PR template exists
- [ ] Stale/abandoned PRs and issues are triaged, not just accumulating

---

**Output format for a paid scan:** score each section, list top 10 risks ranked by
severity, and hand back 3 things to fix first. Don't hand back the whole checklist as
the deliverable — the checklist is your working doc, the findings are the product.
