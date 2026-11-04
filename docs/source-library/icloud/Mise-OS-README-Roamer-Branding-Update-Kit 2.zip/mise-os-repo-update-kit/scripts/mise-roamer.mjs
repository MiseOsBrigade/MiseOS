#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import readline from "node:readline";

const VERSION = "0.2.0";
const DEFAULT_IGNORED_NAMES = new Set([
  ".git", ".hg", ".svn", "node_modules", ".next", ".nuxt", ".svelte-kit",
  ".turbo", ".cache", ".parcel-cache", "dist", "build", "coverage",
  "__pycache__", ".pytest_cache", ".mypy_cache", ".venv", "venv", "env",
  "proc", "sys", "dev", "run", "tmp", "private", "var/lib", "var/cache", "var/log"
]);
const SECRETISH_RE = /(^\.env$|\.env\.|secret|token|credential|private[_-]?key|id_rsa|id_dsa|\.pem$|\.p12$|\.pfx$|\.key$|kubeconfig|password|passwd|shadow|vault|\.npmrc$|\.netrc$)/i;
const CODE_EXTENSIONS = new Set([".js",".mjs",".cjs",".ts",".tsx",".jsx",".py",".go",".rs",".java",".cs",".php",".rb",".md",".mdx",".json",".yaml",".yml",".toml",".html",".css",".scss",".sh",".sql",".dockerfile"]);
const DEFAULT_CHARACTERS = [
  { id: "kurogami-senpai", name: "Kurogami Senpai", role: "Chef de Cuisine", sprite: "🖤", focus: ["architecture","routing","coordination"], message: "sets the service rhythm" },
  { id: "tensho", name: "Tensho", role: "Expediter", sprite: "🎫", focus: ["queues","handoffs","issues"], message: "calls tickets with precision" },
  { id: "mizu", name: "Mizu", role: "Prep Chef", sprite: "🌊", focus: ["docs","prep","staging"], message: "preps the station" },
  { id: "umami-code", name: "Umami Code", role: "Saucier", sprite: "🍜", focus: ["api","sdk","integrations"], message: "balances the API sauce" },
  { id: "kaji", name: "Kaji", role: "Grillardin", sprite: "🔥", focus: ["build","runtime","performance"], message: "turns up compute heat" },
  { id: "yume", name: "Yume", role: "Pastry Chef", sprite: "🍰", focus: ["assets","creative","releases"], message: "polishes the garnish" },
  { id: "iron-hashi", name: "Iron Hashi", role: "Boucher", sprite: "🔪", focus: ["tests","lint","checks"], message: "slices through validation" },
  { id: "null-chan", name: "Null-chan", role: "Plongeur", sprite: "🧼", focus: ["cleanup","refactor","dead-code"], message: "keeps the sink clean" },
  { id: "flash-riku", name: "Flash Riku", role: "Runner", sprite: "🥷", focus: ["deploy","release","ci"], message: "runs the pass" },
  { id: "seira", name: "Seira", role: "Sommelier", sprite: "🔐", focus: ["vault","secrets","policy"], message: "guards the secret cellar" },
  { id: "kuro-guard", name: "Kuro Guard", role: "Steward", sprite: "🛡️", focus: ["auth","rbac","threat-model"], message: "watches the perimeter" },
  { id: "scale-oni", name: "Scale Oni", role: "Rotisseur", sprite: "👹", focus: ["containers","cloud","traffic"], message: "tests the dinner rush" },
  { id: "build-kun", name: "Build-Kun", role: "Boulanger", sprite: "🥖", focus: ["docker","packages","builds"], message: "proofs the build dough" },
  { id: "streama", name: "Streama", role: "Poissonier", sprite: "💧", focus: ["logs","events","observability"], message: "listens to service streams" },
  { id: "orchestra-core", name: "Orchestra Core", role: "Chef Spirit", sprite: "🎼", focus: ["readme","brand","governance"], message: "conducts the brigade" }
];
const FILE_PERSONALITIES = [
  { test: f => /package\.json$/i.test(f), message: "checks the dependency pantry" },
  { test: f => /\.(js|mjs|cjs|ts|tsx|jsx)$/i.test(f), message: "sniffs around the JavaScript wiring" },
  { test: f => /\.(md|mdx|txt)$/i.test(f), message: "reads the repository lore" },
  { test: f => /Dockerfile$/i.test(f) || /\.dockerfile$/i.test(f), message: "inspects the container kitchen" },
  { test: f => /\.(ya?ml|toml|json)$/i.test(f), message: "studies the configuration spells" },
  { test: f => /\.(py|rb|go|rs|java|cs|php)$/i.test(f), message: "examines backend machinery" },
  { test: f => /\.(png|jpe?g|gif|webp|svg)$/i.test(f), message: "checks the plated visual garnish" }
];

function parseArgs(argv) {
  const options = { root: ".", maxDepth: 5, tickMs: 700, chef: null, sprite: null, peek: false, showHidden: false, once: false, json: false, quiet: false };
  for (const arg of argv) {
    if (arg.startsWith("--max-depth=")) options.maxDepth = Number(arg.split("=")[1]);
    else if (arg.startsWith("--tick=")) options.tickMs = Number(arg.split("=")[1]);
    else if (arg.startsWith("--chef=")) options.chef = arg.split("=")[1];
    else if (arg.startsWith("--sprite=")) options.sprite = arg.split("=")[1] || options.sprite;
    else if (arg === "--peek") options.peek = true;
    else if (arg === "--show-hidden") options.showHidden = true;
    else if (arg === "--once") options.once = true;
    else if (arg === "--json") options.json = true;
    else if (arg === "--quiet") options.quiet = true;
    else if (arg === "--help" || arg === "-h") { printHelp(); process.exit(0); }
    else if (!arg.startsWith("--")) options.root = arg;
  }
  if (!Number.isFinite(options.maxDepth) || options.maxDepth < 1) options.maxDepth = 5;
  if (!Number.isFinite(options.tickMs) || options.tickMs < 100) options.tickMs = 700;
  return options;
}
function printHelp() {
  console.log(`Mise OS Repo Roamer v${VERSION}

Usage:
  node scripts/mise-roamer.mjs [root] [options]

Options:
  --chef=<id>         Pick a chef, for example seira or kurogami-senpai
  --sprite=<emoji>   Override the chef sprite
  --max-depth=<n>    Maximum folder depth from root
  --tick=<ms>        Delay between moves
  --peek             Safely read small, non-secret-looking files
  --show-hidden      Include hidden files and folders
  --once             Render one move and exit
  --json             Emit JSON event lines
  --quiet            Reduce header noise`);
}
function ansi(code, value) { return (!process.stdout.isTTY || process.env.NO_COLOR) ? value : `\x1b[${code}m${value}\x1b[0m`; }
function gold(v) { return ansi("38;5;220", v); }
function green(v) { return ansi("38;5;108", v); }
function cream(v) { return ansi("38;5;230", v); }
function dim(v) { return ansi("2", v); }
function clearScreen() { if (process.stdout.isTTY) process.stdout.write("\x1b[2J\x1b[H"); }
function hideCursor() { if (process.stdout.isTTY) process.stdout.write("\x1b[?25l"); }
function showCursor() { if (process.stdout.isTTY) process.stdout.write("\x1b[?25h"); }
function truncate(value, max = 90) { return value.length <= max ? value : `${value.slice(0, max - 1)}…`; }
function isHiddenName(name) { return name.startsWith("."); }
function isIgnoredEntry(absPath, name) {
  if (DEFAULT_IGNORED_NAMES.has(name)) return true;
  const normalized = absPath.split(path.sep).join("/");
  return [...DEFAULT_IGNORED_NAMES].some(ignored => normalized.endsWith(`/${ignored}`));
}
function isSecretish(nameOrPath) { return SECRETISH_RE.test(nameOrPath); }
function relativeDepth(root, target) {
  const rel = path.relative(root, target);
  return (!rel || rel === ".") ? 0 : rel.split(path.sep).filter(Boolean).length;
}
async function safeStat(absPath) { try { return await fs.lstat(absPath); } catch { return null; } }
async function safeReadJson(absPath, fallback) { try { return JSON.parse(await fs.readFile(absPath, "utf8")); } catch { return fallback; } }
async function loadCharacters(root) {
  const loaded = await safeReadJson(path.join(root, ".mise", "characters.json"), null);
  return Array.isArray(loaded) && loaded.length > 0 ? loaded : DEFAULT_CHARACTERS;
}
function pickChef(characters, requestedId) {
  if (requestedId) {
    const found = characters.find(c => c.id === requestedId || c.name.toLowerCase() === requestedId.toLowerCase());
    if (found) return found;
  }
  return characters[Math.floor(Math.random() * characters.length)];
}
async function safeListDir(absPath, options) {
  try {
    const entries = await fs.readdir(absPath, { withFileTypes: true });
    return entries
      .filter(e => options.showHidden || !isHiddenName(e.name))
      .filter(e => !isIgnoredEntry(path.join(absPath, e.name), e.name))
      .filter(e => !e.isSymbolicLink())
      .sort((a,b) => a.isDirectory() && !b.isDirectory() ? -1 : (!a.isDirectory() && b.isDirectory() ? 1 : a.name.localeCompare(b.name)));
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error), entries: [] };
  }
}
async function maybePeekFile(absPath) {
  if (isSecretish(absPath)) return "[masked: secret-like filename]";
  const ext = path.extname(absPath).toLowerCase();
  const base = path.basename(absPath);
  if (!CODE_EXTENSIONS.has(ext) && base !== "Dockerfile") return null;
  const stat = await safeStat(absPath);
  if (!stat || !stat.isFile() || stat.size > 80_000) return null;
  try {
    const content = await fs.readFile(absPath, "utf8");
    const line = content.split("\n").map(s => s.trim()).find(s => s && !s.startsWith("//") && !s.startsWith("#") && !s.startsWith("<!--"));
    return line ? truncate(line, 100) : "[empty or comments only]";
  } catch { return null; }
}
async function readStationBranding(absDir) {
  try {
    const content = await fs.readFile(path.join(absDir, "MISE.md"), "utf8");
    const title = content.split("\n").find(line => line.startsWith("# "));
    return title ? title.replace(/^#\s+/, "") : "Mise OS branded station";
  } catch { return null; }
}
function describeFile(absPath, chef) {
  const lower = absPath.toLowerCase();
  const focusHit = chef.focus?.find(f => lower.includes(String(f).toLowerCase()));
  if (focusHit) return `${chef.message} around ${focusHit}`;
  const match = FILE_PERSONALITIES.find(rule => rule.test(absPath));
  return match?.message ?? "pokes an unfamiliar artifact";
}
function chooseWeighted(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) { roll -= item.weight; if (roll <= 0) return item.value; }
  return items.at(-1)?.value ?? null;
}
function createLogLine(chef, action, location) {
  return `${new Date().toLocaleTimeString()} ${chef.sprite} ${chef.name} ${action}: ${location}`;
}
async function nextMove(state, options) {
  const currentStat = await safeStat(state.current);
  if (!currentStat) {
    state.current = path.dirname(state.current);
    state.logs.unshift(createLogLine(state.chef, "retreats from missing path", state.current));
    return;
  }
  if (currentStat.isFile()) {
    state.current = path.dirname(state.current);
    state.logs.unshift(createLogLine(state.chef, "hops back into the station", state.current));
    return;
  }
  const listed = await safeListDir(state.current, options);
  if (listed.error) {
    const parent = path.dirname(state.current);
    state.current = parent === state.current ? options.root : parent;
    state.logs.unshift(createLogLine(state.chef, "avoids locked room", listed.error));
    return;
  }
  const depth = relativeDepth(options.root, state.current);
  const dirs = [], files = [];
  for (const entry of listed) {
    const abs = path.join(state.current, entry.name);
    if (entry.isDirectory() && depth < options.maxDepth) dirs.push(abs);
    else if (entry.isFile()) files.push(abs);
  }
  const parent = path.dirname(state.current);
  const canMoveUp = state.current !== options.root && parent !== state.current;
  const choices = [...dirs.map(v => ({ value: v, weight: 5 })), ...files.map(v => ({ value: v, weight: 2 }))];
  if (canMoveUp) choices.push({ value: parent, weight: 3 });
  if (choices.length === 0) {
    state.logs.unshift(createLogLine(state.chef, "finds a dead end and turns around", state.current));
    if (canMoveUp) state.current = parent;
    return;
  }
  const chosen = chooseWeighted(choices);
  const chosenStat = await safeStat(chosen);
  state.current = chosen;
  state.visited.add(chosen);
  if (chosenStat?.isDirectory()) {
    const branding = await readStationBranding(chosen);
    state.logs.unshift(createLogLine(state.chef, "wanders into", `${chosen}${branding ? ` | station: ${branding}` : ""}`));
  } else if (chosenStat?.isFile()) {
    let line = createLogLine(state.chef, describeFile(chosen, state.chef), chosen);
    if (options.peek) {
      const peek = await maybePeekFile(chosen);
      if (peek) line += ` | peek: ${peek}`;
    }
    state.logs.unshift(line);
  }
  state.logs = state.logs.slice(0, 10);
}
async function render(state, options) {
  if (options.json) {
    console.log(JSON.stringify({ step: state.step, chef: state.chef.id, current: state.current, visited: state.visited.size, latest: state.logs[0] ?? null }));
    return;
  }
  clearScreen();
  const stat = await safeStat(state.current);
  if (!options.quiet) {
    console.log(gold("Mise OS Repo Roamer"));
    console.log(dim("────────────────────────────────────────────────────────────"));
    console.log(`${cream("Chef:")}     ${state.chef.sprite} ${state.chef.name} — ${state.chef.role}`);
    console.log(`${cream("Root:")}     ${options.root}`);
    console.log(`${cream("Current:")}  ${state.current}`);
    console.log(`${cream("Mode:")}     ${options.peek ? "peek-safe read mode" : "metadata-only read mode"}`);
    console.log(`${cream("Visited:")}  ${state.visited.size}`);
    console.log(`${cream("Step:")}     ${state.step}`);
    console.log(`${cream("Controls:")} q / Ctrl+C to quit\n`);
  }
  if (stat?.isDirectory()) {
    const listed = await safeListDir(state.current, options);
    const station = await readStationBranding(state.current);
    console.log(`${state.chef.sprite} inside: ${green(path.basename(state.current) || state.current)}`);
    if (station) console.log(`${gold("Station:")} ${station}`);
    console.log(dim("────────────────────────────────────────────────────────────"));
    if (listed.error) console.log(`  [locked] ${listed.error}`);
    else if (listed.length === 0) console.log("  [empty]");
    else {
      for (const entry of listed.slice(0, 22)) {
        console.log(`  ${entry.isDirectory() ? "📁" : "📄"} ${truncate(entry.name, 60)}${isSecretish(entry.name) ? " [masked]" : ""}`);
      }
      if (listed.length > 22) console.log(`  … ${listed.length - 22} more`);
    }
  } else {
    console.log(`${state.chef.sprite} inspecting file: ${green(path.basename(state.current))}`);
  }
  console.log(`\n${gold("Recent trail")}`);
  console.log(dim("────────────────────────────────────────────────────────────"));
  for (const log of state.logs.length ? state.logs : ["The kitchen is opening..."]) console.log(`  ${truncate(log, 120)}`);
}
function setupKeyboard(onQuit) {
  if (!process.stdin.isTTY) return;
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (_, key) => {
    if (key?.name === "q" || (key?.ctrl && key?.name === "c")) onQuit();
  });
}
async function main() {
  const options = parseArgs(process.argv.slice(2));
  options.root = path.resolve(options.root);
  const rootStat = await safeStat(options.root);
  if (!rootStat || !rootStat.isDirectory()) {
    console.error(`Root must be an existing directory: ${options.root}`);
    process.exit(1);
  }
  const characters = await loadCharacters(options.root);
  const chef = pickChef(characters, options.chef);
  if (options.sprite) chef.sprite = options.sprite;
  const state = { chef, current: options.root, visited: new Set([options.root]), logs: [], step: 0 };
  const quit = () => {
    showCursor();
    clearScreen();
    console.log(`${chef.sprite} ${chef.name} went back to the pantry.`);
    process.exit(0);
  };
  setupKeyboard(quit);
  hideCursor();
  process.on("SIGINT", quit);
  process.on("SIGTERM", quit);
  process.on("exit", showCursor);
  while (true) {
    state.step += 1;
    await nextMove(state, options);
    await render(state, options);
    if (options.once) break;
    await new Promise(resolve => setTimeout(resolve, options.tickMs));
  }
  showCursor();
}
main().catch(error => {
  showCursor();
  console.error(error);
  process.exit(1);
});
