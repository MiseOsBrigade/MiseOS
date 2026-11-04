# Repository Copy Pack

Use this file when setting up the GitHub repository, writing posts, or creating launch material.

---

## Homepage Copy

### Headline

Mise-en-Preplist Self-Unzip GitHub Bootstrap

### Subheadline

Prep. Unzip. Test. Commit. Serve.

### Description

A GitHub-ready bootstrap repository that works like a clean prep kitchen. Start with a README, workflow, safe unzip script, and payload archive. Run one GitHub Actions workflow to safely extract the payload, validate the setup, and commit the expanded project back to the repo.

---

## Who It Is For

- Builders who need repeatable starter repos.
- Developers shipping template repositories.
- Educators creating classroom project kits.
- Teams that want a clean handoff from compressed project payload to working GitHub repo.
- Operators who prefer step-by-step checklists over vague setup instructions.

---

## Core Promise

```text
Push the prep kit. Run the workflow. Get a plated repo.
```

---

## Feature Bullets

- Interactive README with step-by-step operating flow.
- GitHub Actions workflow for manual bootstrap execution.
- Safe unzip script that blocks path traversal and absolute-path archive entries.
- Payload manifest so users can inspect what will be unpacked.
- Automatic dependency install and test execution when `package.json` exists.
- Bootstrap marker to prevent accidental repeated extraction.
- Re-run path using `force = true` for intentional payload refreshes.

---

## GitHub About Section

**Description**

```text
Prep-kitchen themed GitHub bootstrap repo that safely unzips a payload, runs tests, and commits the expanded project.
```

**Website**

Leave blank unless you publish docs or a landing page.

**Topics**

```text
github-actions bootstrap-template self-unzip zip-safe template-repo automation ci starter-kit developer-tools
```

---

## Release Notes Template

```md
## Mise-en-Preplist vX.Y.Z

### Added
- New prep station:

### Changed
- Updated workflow behavior:

### Fixed
- Resolved service issue:

### Operator Notes
- Run `Bootstrap Unzip` manually after pushing this release if the payload changed.
```

---

## README CTA Options

```md
Start here: push this repo to GitHub, open Actions, and run **Bootstrap Unzip**.
```

```md
Use this when you want a starter repo that expands itself safely after the first GitHub push.
```

```md
Replace `bootstrap/payload.zip` with your own project, update the manifest, and run the prep service.
```

---

## Short Explainer

Mise-en-Preplist solves the awkward first mile of repo setup. Instead of asking users to manually copy files in the right order, the repo ships with a prepared payload and a workflow that safely unpacks it. The metaphor is a prep kitchen: ingredients are staged before service, the line runs in order, and nothing gets plated until quality control passes.

---

## Safety Copy

This repo does not execute code from the README. The README is the guide. GitHub Actions runs the automation after the workflow is committed and manually triggered. The unzip step validates archive paths before extraction so payload files cannot escape the repository root.
