import fs from "node:fs/promises";
import path from "node:path";
import { getCharacter } from "./characters.js";
import {
  isSafePeekTarget,
  isSecretish,
  safeLstat,
  safeReadDir,
  shouldSkipEntry
} from "./safety.js";

const CATEGORY_MATCHERS = Object.freeze([
  { category: "ci", re: /(\.github|workflow|action|ci|cd|pipeline|deploy)/i },
  { category: "docker", re: /(dockerfile|docker-compose|container|image|compose)/i },
  { category: "infra", re: /(infra|terraform|pulumi|k8s|kubernetes|helm|cloud|worker|wrangler)/i },
  { category: "api", re: /(api|route|controller|handler|endpoint|gateway|mcp|connector)/i },
  { category: "tests", re: /(test|spec|e2e|playwright|vitest|jest|pytest|smoke)/i },
  { category: "schemas", re: /(schema|zod|types|model|contract|openapi|jsonschema)/i },
  { category: "security", re: /(security|auth|policy|permission|rbac|acl|firewall)/i },
  { category: "secrets", re: /(secret|vault|token|credential|key|env)/i },
  { category: "logs", re: /(log|metric|trace|observability|telemetry|alert)/i },
  { category: "docs", re: /(readme|docs?|guide|manual|adr|changelog|license)/i },
  { category: "assets", re: /(asset|public|static|image|icon|sprite|mascot|character)/i },
  { category: "build", re: /(build|dist|bundle|package|lock|rollup|vite|webpack|tsconfig)/i },
  { category: "cleanup", re: /(tmp|cache|cleanup|lint|format|ignore|garbage|null)/i },
  { category: "data", re: /(data|stream|queue|event|bus|topic|etl|warehouse|sql|db|database)/i },
  { category: "performance", re: /(perf|benchmark|load|capacity|scale|rate|latency)/i },
  { category: "config", re: /(config|settings|toml|ya?ml|json|rc$|ini)/i },
  { category: "scripts", re: /(script|bin|cli|cmd|task|makefile)/i },
  { category: "deploy", re: /(deploy|release|ship|vercel|netlify|fly|railway|render)/i }
]);

export class RepoRoamer {
  constructor(options = {}) {
    const root = path.resolve(options.root ?? ".");
    this.options = {
      root,
      maxDepth: normalizePositiveNumber(options.maxDepth, 5),
      showHidden: Boolean(options.showHidden),
      followSymlinks: Boolean(options.followSymlinks),
      peek: Boolean(options.peek)
    };
    this.character = getCharacter(options.character ?? "orchestra-core");
    this.state = {
      current: root,
      visited: new Set([root]),
      step: 0,
      trail: []
    };
  }

  async assertReady() {
    const stat = await safeLstat(this.options.root);
    if (!stat || !stat.isDirectory()) {
      throw new Error(`Root must be an existing directory: ${this.options.root}`);
    }
  }

  async step() {
    await this.assertReady();
    this.state.step += 1;

    const currentStat = await safeLstat(this.state.current);
    if (!currentStat) {
      return this.#retreat("avoids a missing path", this.state.current);
    }

    if (currentStat.isFile()) {
      return this.#retreat(this.character.verbs.retreat, this.state.current);
    }

    if (!currentStat.isDirectory()) {
      return this.#retreat("avoids a non-directory artifact", this.state.current);
    }

    const listed = await this.#listCurrentDirectory();
    if (listed.error) {
      return this.#retreat("avoids a locked room", listed.error);
    }

    const choices = this.#buildChoices(listed.entries);
    if (choices.length === 0) {
      return this.#retreat("finds a dead end", this.state.current);
    }

    const chosen = chooseWeighted(choices);
    this.state.current = chosen.absPath;
    this.state.visited.add(chosen.absPath);

    const stat = await safeLstat(chosen.absPath);
    const event = await this.#createEventForChoice(chosen, stat);
    this.#pushTrail(event);
    return event;
  }

  getSnapshot() {
    return {
      root: this.options.root,
      current: this.state.current,
      step: this.state.step,
      visitedCount: this.state.visited.size,
      character: this.character,
      trail: [...this.state.trail]
    };
  }

  async inspectCurrentDirectory(limit = 24) {
    const stat = await safeLstat(this.state.current);
    if (!stat?.isDirectory()) {
      return { currentIsDirectory: false, entries: [], error: null };
    }

    const listed = await this.#listCurrentDirectory();
    return {
      currentIsDirectory: true,
      entries: listed.entries.slice(0, limit),
      totalEntries: listed.entries.length,
      error: listed.error
    };
  }

  async #listCurrentDirectory() {
    const { entries, error } = await safeReadDir(this.state.current);
    if (error) return { entries: [], error };

    const filtered = entries
      .filter(entry => this.options.followSymlinks || !entry.isSymbolicLink())
      .map(entry => ({
        name: entry.name,
        absPath: path.join(this.state.current, entry.name),
        isDirectory: entry.isDirectory(),
        isFile: entry.isFile(),
        isSymbolicLink: entry.isSymbolicLink(),
        categories: categorizePath(path.join(this.state.current, entry.name))
      }))
      .filter(entry =>
        !shouldSkipEntry({
          absPath: entry.absPath,
          name: entry.name,
          showHidden: this.options.showHidden
        })
      )
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

    return { entries: filtered, error: null };
  }

  #buildChoices(entries) {
    const depth = relativeDepth(this.options.root, this.state.current);
    const canMoveUp = this.state.current !== this.options.root;
    const choices = [];

    for (const entry of entries) {
      if (entry.isDirectory && depth < this.options.maxDepth) {
        choices.push({ ...entry, weight: this.#weightFor(entry, "directories") });
      } else if (entry.isFile) {
        choices.push({ ...entry, weight: this.#weightFor(entry, "files") });
      }
    }

    if (canMoveUp) {
      choices.push({
        name: "..",
        absPath: path.dirname(this.state.current),
        isDirectory: true,
        isFile: false,
        categories: ["parent"],
        weight: this.character.roamingBias.parent ?? 2
      });
    }

    return choices.filter(choice => choice.weight > 0);
  }

  #weightFor(entry, fallbackCategory) {
    const bias = this.character.roamingBias;
    const base = bias[fallbackCategory] ?? 1;
    const categoryBonus = entry.categories.reduce((sum, category) => sum + (bias[category] ?? 0), 0);
    return base + categoryBonus;
  }

  async #createEventForChoice(choice, stat) {
    const categories = choice.categories;
    const primaryCategory = categories[0] ?? "file";
    const verb = selectVerb(this.character.verbs, primaryCategory, stat);
    const peek = this.options.peek && stat?.isFile() ? await maybePeekFile(choice.absPath, stat.size) : null;

    return {
      step: this.state.step,
      time: new Date().toISOString(),
      characterId: this.character.id,
      characterName: this.character.name,
      sprite: this.character.sprite,
      glyph: this.character.glyph,
      verb,
      path: choice.absPath,
      relativePath: path.relative(this.options.root, choice.absPath) || ".",
      type: stat?.isDirectory() ? "directory" : stat?.isFile() ? "file" : "unknown",
      categories,
      masked: isSecretish(choice.absPath),
      peek
    };
  }

  async #retreat(verb, detail) {
    const parent = path.dirname(this.state.current);
    const nextPath = parent === this.state.current ? this.options.root : parent;
    const previousPath = this.state.current;
    this.state.current = nextPath;

    const event = {
      step: this.state.step,
      time: new Date().toISOString(),
      characterId: this.character.id,
      characterName: this.character.name,
      sprite: this.character.sprite,
      glyph: this.character.glyph,
      verb,
      path: previousPath,
      relativePath: path.relative(this.options.root, previousPath) || ".",
      type: "retreat",
      categories: ["parent"],
      masked: false,
      detail,
      peek: null
    };

    this.#pushTrail(event);
    return event;
  }

  #pushTrail(event) {
    this.state.trail.unshift(event);
    this.state.trail = this.state.trail.slice(0, 12);
  }
}

export function categorizePath(absPath) {
  const normalized = absPath.split(path.sep).join("/");
  return CATEGORY_MATCHERS.filter(matcher => matcher.re.test(normalized)).map(matcher => matcher.category);
}

export function relativeDepth(root, target) {
  const rel = path.relative(root, target);
  if (!rel || rel === ".") return 0;
  return rel.split(path.sep).filter(Boolean).length;
}

export async function maybePeekFile(absPath, sizeBytes) {
  if (!isSafePeekTarget(absPath, sizeBytes)) {
    return isSecretish(absPath) ? "[masked: secret-like filename]" : null;
  }

  try {
    const content = await fs.readFile(absPath, "utf8");
    const firstUsefulLine = content
      .split("\n")
      .map(line => line.trim())
      .find(line => line && !line.startsWith("//") && !line.startsWith("#"));

    return firstUsefulLine ? truncate(firstUsefulLine, 110) : "[empty or comments only]";
  } catch {
    return null;
  }
}

export function chooseWeighted(items) {
  const total = items.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
  if (total <= 0) return items[0];

  let roll = Math.random() * total;
  for (const item of items) {
    roll -= Math.max(0, item.weight);
    if (roll <= 0) return item;
  }

  return items.at(-1);
}

export function truncate(value, max = 90) {
  if (typeof value !== "string") return "";
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

function normalizePositiveNumber(value, fallback) {
  const normalized = Number(value);
  return Number.isFinite(normalized) && normalized > 0 ? normalized : fallback;
}

function selectVerb(verbs, category, stat) {
  if (stat?.isDirectory()) return verbs.enterDirectory;
  if (category === "config" || category === "secrets" || category === "security") return verbs.inspectConfig;
  if (category === "docs") return verbs.inspectDocs;
  if (category === "tests") return verbs.inspectTests;
  return verbs.inspectFile;
}
