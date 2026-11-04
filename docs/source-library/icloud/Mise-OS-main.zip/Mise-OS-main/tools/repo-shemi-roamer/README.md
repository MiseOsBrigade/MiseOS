<div align="center">

<img src="../../attached_assets/miseos_agents/02_kitchen_operations/Mizu.png" width="150" alt="Mizu — Flow Coordinator" />

# 🍜 Repo Shemi Roamer

**Patron brigade · Kitchen Operations** &nbsp;`#E97B22`

_A Shimeji-style terminal chef that wanders your repository (or the whole container) like a tiny DevOps mascot._

</div>

> A **Shimeji** is a little desktop companion that walks and climbs around your
> screen. **Shemi** is the MiseOS twist: instead of your desktop, the little chef
> roams the **filesystem** — opening directories, peeking at files, and narrating
> the journey in your terminal. It never writes, deletes, or mutates anything.

## Roam the current repo

```bash
node tools/repo-shemi-roamer/shemi-roamer.mjs . --max-depth=6 --tick=650
```

Or use the main repository script:

```bash
pnpm run roam:repo
```

## Roam the whole container filesystem

```bash
node tools/repo-shemi-roamer/shemi-roamer.mjs / --max-depth=4 --tick=800
```

Or use the main repository script:

```bash
pnpm run roam:container
```

## Let the chef peek inside files (safely)

By default it only reads filesystem **metadata**. Add `--peek` to let the chef read
small, non-secret-looking source/config/docs files. Secret-like filenames
(`.env`, `*.key`, `*.pem`, `kubeconfig`, anything matching `secret|token|credential`…)
are always **masked**.

```bash
node tools/repo-shemi-roamer/shemi-roamer.mjs . --max-depth=6 --tick=650 --peek
```

Or use the main repository script:

```bash
pnpm run roam:repo:peek
```

## Best-practice use cases

Use Repo Shemi Roamer for:

- new contributor orientation
- live repository demos
- shallow container exploration
- safe source/docs/config previews
- explaining the MiseOS kitchen metaphor in motion

Read the full playbook in **[USE-CASES.md](USE-CASES.md)**.

## Install as a local CLI

```bash
chmod +x tools/repo-shemi-roamer/shemi-roamer.mjs
cd tools/repo-shemi-roamer && npm link
shemi . --max-depth=6 --tick=650 --sprite=🦝
```

## Flags

| Flag | Default | Meaning |
| --- | --- | --- |
| `<path>` | `.` | Root directory to roam |
| `--max-depth=N` | `5` | How deep the chef will wander |
| `--tick=MS` | `700` | Milliseconds between steps |
| `--sprite=EMOJI` | `🧑‍🍳` | The character that roams |
| `--peek` | off | Read small, non-secret files |
| `--show-hidden` | off | Include dotfiles |

Press **`q`** or **Ctrl+C** to send the chef back to the pantry.

## Why it's safe

- **Read-only.** It calls `lstat`, `readdir`, and (with `--peek`) `readFile` — nothing else.
- **Secret-aware.** Secret-like names are masked and never opened.
- **Skips the noise.** `.git`, `node_modules`, `dist`, `coverage`, `/proc`, `/sys`, and friends are ignored.
- **Symlink-safe.** Symbolic links are not followed.

<div align="center">
<sub><b>MiseOS</b> · everything in its place</sub>
</div>
