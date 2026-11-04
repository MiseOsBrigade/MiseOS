# Repo Shemi Roamer use cases

Repo Shemi Roamer is best used as a read-only orientation companion for large repositories, demos, onboarding, and container exploration.

## Best-practice pattern

Use it as a narrated filesystem tour, not as an automation worker.

```bash
node tools/repo-shemi-roamer/shemi-roamer.mjs . --max-depth=4 --tick=700
```

Recommended defaults:

| Context | Command | Why |
| --- | --- | --- |
| New contributor tour | `node tools/repo-shemi-roamer/shemi-roamer.mjs . --max-depth=4 --tick=700` | Shows repo shape without overwhelming the user |
| Maintainer demo | `node tools/repo-shemi-roamer/shemi-roamer.mjs . --max-depth=6 --tick=650 --sprite=🍳` | Gives a lively but bounded walkthrough |
| Container inspection | `node tools/repo-shemi-roamer/shemi-roamer.mjs / --max-depth=3 --tick=900` | Demonstrates the running environment safely |
| Safe code peek | `node tools/repo-shemi-roamer/shemi-roamer.mjs . --max-depth=5 --tick=700 --peek` | Reads only small non-secret-looking source/docs/config files |
| Presentation mode | `node tools/repo-shemi-roamer/shemi-roamer.mjs . --max-depth=3 --tick=1200 --sprite=🦝` | Slower pacing for livestreams or demos |

## Example: onboarding a contributor

1. Start at the repository root.
2. Run the roamer with `--max-depth=4`.
3. Let it surface the major folders.
4. Open the README for any station the roamer visits.
5. Use `--peek` only when you want safe first-line previews.

```bash
node tools/repo-shemi-roamer/shemi-roamer.mjs . --max-depth=4 --tick=700
```

## Example: showing MiseOS as a living repo

Use the roamer after the main quickstart to show that the repo has its own mascot station.

```bash
pnpm run roam:repo
```

Then narrate the metaphor:

> A repo is a kitchen. The roamer is the tiny chef walking the line, checking stations, reading labels, and never touching the knives.

## Safety checklist

- Keep the roamer read-only.
- Do not add shell execution, file writing, deletion, or mutation.
- Keep secret-like path masking enabled.
- Keep symlink traversal disabled.
- Keep dependency, build, cache, and system folders ignored.
- Use depth limits for demos.
- Use `--peek` sparingly.

## Good commit use

Best practice is to keep this roamer as a self-contained tool under:

```text
tools/repo-shemi-roamer/
```

That keeps the mascot optional, discoverable, and separate from production runtime code.
