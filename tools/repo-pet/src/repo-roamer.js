import fs from "node:fs/promises";
import path from "node:path";
import {
  CODE_EXTENSIONS,
  isHiddenName,
  isIgnoredEntry,
  isSecretish,
  maskPath,
  relativeDepth,
  truncate
} from "./safety.js";
import { findCharacter } from "./characters.js";

const FILE_PERSONALITIES = [
  { test: file => /package\.json$/i.test(file), action: "aligns the service board" },
  { test: file => /README\.md$/i.test(file), action: "studies the kitchen lore" },
  { test: file => /AGENTS\.md$|CLAUDE\.md$/i.test(file), action: "checks the agent station card" },
  { test: file => /Dockerfile$/i.test(file) || /\.dockerfile$/i.test(file), action: "inspects the container kitchen" },
  { test: file => /\.(js|mjs|cjs|ts|tsx|jsx)$/i.test(file), action: "traces the JavaScript station" },
  { test: file => /\.(ya?ml|toml|json)$/i.test(file), action: "reads configuration mise en place" },
  { test: file => /\.(md|mdx|txt)$/i.test(file), action: "reads documentation crumbs" }
];

async function safeStat(absPath) {
  try {
    return await fs.lstat(absPath);
  } catch {
    return null;
  }
}

async function safeListDir(absPath, showHidden = false) {
  try {
    const entries = await fs.readdir(absPath, { withFileTypes: true });
    return entries
      .filter(entry => showHidden || !isHiddenName(entry.name))
      .filter(entry => !isIgnoredEntry(path.join(absPath, entry.name), entry.name))
      .filter(entry => !entry.isSymbolicLink())
      .sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      });
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error), entries: [] };
  }
}

function chooseWeighted(items) {
  if (items.length === 0) return null;
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item.value;
  }
  return items.at(-1).value;
}

function describeFile(absPath) {
  const match = FILE_PERSONALITIES.find(rule => rule.test(absPath));
  return match?.action ?? "pokes an unfamiliar artifact";
}

async function maybePeekFile(absPath) {
  if (isSecretish(absPath)) return "[masked: secret-like filename]";
  const ext = path.extname(absPath).toLowerCase();
  if (!CODE_EXTENSIONS.has(ext) && path.basename(absPath) !== "Dockerfile") return null;
  const stat = await safeStat(absPath);
  if (!stat || !stat.isFile() || stat.size > 80_000) return null;
  try {
    const content = await fs.readFile(absPath, "utf8");
    const firstUsefulLine = content
      .split("\n")
      .map(line => line.trim())
      .find(line => line && !line.startsWith("//") && !line.startsWith("#"));
    return firstUsefulLine ? truncate(firstUsefulLine, 100) : "[empty or comments only]";
  } catch {
    return null;
  }
}

export class RepoRoamer {
  constructor(options = {}) {
    this.root = path.resolve(options.root ?? ".");
    this.current = this.root;
    this.character = findCharacter(options.character ?? "orchestra-core");
    this.maxDepth = Number.isFinite(options.maxDepth) ? options.maxDepth : 5;
    this.peek = Boolean(options.peek);
    this.showHidden = Boolean(options.showHidden);
    this.visited = new Set([this.root]);
    this.stepCount = 0;
    this.logs = [];
  }

  async initialize() {
    const stat = await safeStat(this.root);
    if (!stat || !stat.isDirectory()) {
      throw new Error(`Repo Pet root must be an existing directory: ${this.root}`);
    }
    return this;
  }

  async step() {
    this.stepCount += 1;
    const currentStat = await safeStat(this.current);
    if (!currentStat) return this.#record("retreats from a missing path", this.root);
    if (currentStat.isFile()) {
      this.current = path.dirname(this.current);
      return this.#record("hops back into directory", this.current);
    }

    const listed = await safeListDir(this.current, this.showHidden);
    if (listed.error) {
      this.current = path.dirname(this.current);
      return this.#record("avoids a locked room", listed.error);
    }

    const depth = relativeDepth(this.root, this.current);
    const choices = [];
    for (const entry of listed) {
      const abs = path.join(this.current, entry.name);
      if (entry.isDirectory() && depth < this.maxDepth) {
        const likesPath = this.character.preferredPaths?.some(part => abs.includes(part));
        choices.push({ value: abs, weight: likesPath ? 8 : 5 });
      } else if (entry.isFile()) {
        const likesFile = this.character.preferredPaths?.some(part => abs.includes(part));
        choices.push({ value: abs, weight: likesFile ? 4 : 2 });
      }
    }

    const parent = path.dirname(this.current);
    if (this.current !== this.root && parent !== this.current) {
      choices.push({ value: parent, weight: 3 });
    }

    const chosen = chooseWeighted(choices);
    if (!chosen) return this.#record("finds a clean dead end", this.current);

    const chosenStat = await safeStat(chosen);
    this.current = chosen;
    this.visited.add(chosen);

    if (chosenStat?.isDirectory()) return this.#record("wanders into", chosen);
    if (chosenStat?.isFile()) {
      let note = describeFile(chosen);
      if (this.peek) {
        const peek = await maybePeekFile(chosen);
        if (peek) note += ` | peek: ${peek}`;
      }
      return this.#record(note, chosen);
    }

    return this.#record("keeps moving", chosen);
  }

  snapshot() {
    return {
      root: this.root,
      current: this.current,
      character: this.character,
      visitedCount: this.visited.size,
      stepCount: this.stepCount,
      logs: [...this.logs]
    };
  }

  #record(action, location) {
    const event = {
      at: new Date().toISOString(),
      step: this.stepCount,
      sprite: this.character.sprite,
      character: this.character.name,
      action,
      location: maskPath(location)
    };
    this.logs.unshift(event);
    this.logs = this.logs.slice(0, 12);
    return event;
  }
}

export function formatEventLine(event) {
  return `${event.sprite} ${event.character} ${event.action}: ${event.location}`;
}
