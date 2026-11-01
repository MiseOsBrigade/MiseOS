# MiseOS Repo Reliability Kit

A drop-in kit that makes a GitHub repo **agent-legible, CI-sane, and dependency-safe** in one PR.

Built by [@Mise-OS](https://github.com/Mise-OS) — the same conventions used across `@goodshyt/mise-orchestra`, `@goodshyt/mother-mcp`, and `@goodshyt/mas`.

## What this fixes

| Problem | Fixed by |
|---|---|
| AI coding tools (Claude, Codex, Cursor) can't figure out your repo | `templates/CLAUDE.md`, `templates/AGENTS.md` |
| Dependabot is unconfigured or noisy | `.github/dependabot.yml` |
| CI is missing, broken, or copy-pasted from a tutorial | `.github/workflows/*` |
| No security policy, no contributing guide, no PR template | `templates/SECURITY.md`, `templates/CONTRIBUTING.md`, `templates/PULL_REQUEST_TEMPLATE.md` |
| No reliability practices before something breaks | `docs/sre-starter-checklist.md`, `docs/incident-template.md`, `docs/postmortem-template.md` |
| No idea what's actually wrong with the repo | `docs/repo-health-checklist.md` |

## Install (5 minutes)

```bash
git clone https://github.com/Mise-OS/miseos-repo-reliability-kit.git /tmp/miseos-kit
cp /tmp/miseos-kit/templates/AGENTS.md ./AGENTS.md
cp /tmp/miseos-kit/templates/CLAUDE.md ./CLAUDE.md
cp /tmp/miseos-kit/templates/SECURITY.md ./SECURITY.md
cp /tmp/miseos-kit/templates/CONTRIBUTING.md ./CONTRIBUTING.md
mkdir -p .github
cp /tmp/miseos-kit/templates/PULL_REQUEST_TEMPLATE.md ./.github/PULL_REQUEST_TEMPLATE.md
cp /tmp/miseos-kit/.github/dependabot.yml ./.github/dependabot.yml
cp /tmp/miseos-kit/.github/workflows/ci-node.yml ./.github/workflows/ci.yml   # pick the right ci-*.yml for your stack
```

Then edit `AGENTS.md` and `CLAUDE.md` to name your actual stack, and delete whichever `ci-*.yml` files don't apply.

## Ecosystems covered

Cargo (Rust) · Composer (PHP) · Go · Maven (Java) · npm (JS/TS) · NuGet (.NET) · pip (Python) · RubyGems · Pub (Dart/Flutter) · GitHub Actions

## This is the free tier

This repo is the public proof-of-work. The paid version (**Agent-Ready Repo Conversion**, $249) is this kit *applied to your actual repo* — stack-specific CI, real Dependabot grouping rules, a CLAUDE.md written from your actual architecture instead of a template, and a PR that ships it. [Message me to get a scan.]

## License

MIT — use it, fork it, sell your own service with it. Attribution appreciated, not required.
