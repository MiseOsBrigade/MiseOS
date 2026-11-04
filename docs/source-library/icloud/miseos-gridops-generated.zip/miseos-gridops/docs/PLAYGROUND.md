# MiseOS GridOps Playground Design

## Zones

## 1. Atrium

Global command dashboard with repo health, active agents, open tasks, package drift, secret alerts, CI failures, and cost.

## 2. Mise Grid

Spreadsheet-like operating cockpit with linked tables:
Repos, Tasks, Agents, Tools, Workflows, Evidence, Packages, Secrets, RAG Index, Model Router.

## 3. Repo City

Repos appear as buildings.

Building floors:
- Foundation: README, license, package files
- CI Floor: workflows, tests, lint, build
- Security Floor: secrets, dependencies, permissions
- Package Floor: npm, GHCR, Docker, releases
- Docs Floor: guides, changelogs
- Agent Floor: active autonomous runs
- Evidence Floor: proof trail

## 4. Agent Hangar

Shows every autonomous agent, role, allowed tools, blocked actions, model type, memory scope, cost class, and current mission.

## 5. Evidence Vault

Every claim is tagged:
- CONFIRMED
- INFERRED
- UNKNOWN

No proof means no confirmed claim.

## 6. CI Dojo

CI failure training and repair space:
- log parser
- root cause classifier
- suggested fix
- safe patch preview
- retry history

## 7. Package Forge

Registry and release visualization:
- npm
- GHCR
- Docker
- Maven
- Gradle
- NuGet
- RubyGems

## 8. Secret Quarantine

Redacted secret event tracker. Raw secrets are never stored or displayed.

## 9. Simulation Lab

Modes:
- Ghost Run: explain without changing
- Dry Run: virtual diff only
- Sandbox Run: temporary branch
- PR Run: real pull request
- Deploy Run: restricted, approved only
