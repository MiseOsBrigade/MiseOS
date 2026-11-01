#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const IGNORED = new Set([".git","node_modules","dist","build","coverage",".next",".turbo",".cache",".venv","venv","__pycache__"]);

function parseArgs(argv) {
  const options = { root: ".", check: false, force: false, dryRun: false };
  for (const arg of argv) {
    if (arg === "--check") options.check = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (!arg.startsWith("--")) options.root = arg;
  }
  return options;
}
async function exists(absPath) {
  try { await fs.access(absPath); return true; } catch { return false; }
}
function stationName(root, dir) {
  const rel = path.relative(root, dir);
  if (!rel) return "Repository Root";
  return rel.split(path.sep).map(part => part.replace(/[-_]/g, " ")).join(" / ");
}
function cardFor(root, dir) {
  const station = stationName(root, dir);
  const rel = path.relative(root, dir) || ".";
  return `# Mise OS Station Card

**Station:** ${station}  
**Path:** \`${rel}\`  
**Brand:** Mise OS  
**Tagline:** Everything In Its Place.

## Purpose

This folder is a branded Mise OS kitchen station. Keep its ingredients organized, its responsibilities clear, and its service trail observable.

## Local rules

- Keep secrets out of this folder.
- Keep generated files out unless they are intentional artifacts.
- Keep docs close to the system they explain.
- Keep agent work reviewable by humans.
- Keep folder ownership obvious.

## Service loop

\`\`\`text
Intent → Orchestrate → Execute → Observe → Improve
\`\`\`

Cook. Orchestrate. Deploy. Observe.
`;
}
async function walk(root, dir, dirs = []) {
  dirs.push(dir);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.isSymbolicLink() || IGNORED.has(entry.name)) continue;
    await walk(root, path.join(dir, entry.name), dirs);
  }
  return dirs;
}
async function main() {
  const options = parseArgs(process.argv.slice(2));
  const root = path.resolve(options.root);
  const dirs = await walk(root, root);
  const missing = [];
  for (const dir of dirs) {
    const target = path.join(dir, "MISE.md");
    const hasCard = await exists(target);
    if (options.check) {
      if (!hasCard) missing.push(path.relative(root, target));
      continue;
    }
    if (hasCard && !options.force) continue;
    if (options.dryRun) {
      console.log(`[dry-run] write ${path.relative(root, target)}`);
      continue;
    }
    await fs.writeFile(target, cardFor(root, dir), "utf8");
    console.log(`branded ${path.relative(root, target)}`);
  }
  if (options.check) {
    if (missing.length === 0) {
      console.log("All folders have Mise OS branding cards.");
      return;
    }
    console.error(`Missing ${missing.length} station cards:`);
    for (const item of missing) console.error(`- ${item}`);
    process.exitCode = 1;
  }
}
main().catch(error => {
  console.error(error);
  process.exit(1);
});
