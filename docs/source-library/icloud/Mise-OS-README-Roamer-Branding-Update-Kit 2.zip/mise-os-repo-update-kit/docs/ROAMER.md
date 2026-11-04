# Mise OS Repo Roamer

The repo roamer is a terminal-native Shimeji-style mascot system.

```bash
npm run roam
npm run roam:peek
npm run roam:container
node scripts/mise-roamer.mjs . --chef=seira --max-depth=6 --tick=650
```

## Safety model

The roamer is read-only by design.

- It never writes or deletes files.
- It skips common dependency, build, cache, and system folders.
- It masks secret-like filenames.
- `--peek` only reads small, non-secret-looking text files.
