#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import readline from "node:readline";

const DEFAULT_IGNORED_NAMES = new Set([
  ".git",
  "node_modules",
  ".next",
  ".turbo",
  ".cache",
  "dist",
  "build",
  "coverage",
  "__pycache__",
  ".venv",
  "venv",
  "proc",
  "sys",
  "dev",
  "run",
  "tmp",
  "var/lib",
  "var/cache",
  "var/log"
]);

const SECRETISH_RE =
  /(^\.env$|\.env\.|secret|token|credential|private[_-]?key|id_rsa|id_dsa|\.pem$|\.p12$|\.key$|kubeconfig|password)/i;

const FILE_PERSONALITIES = [
  {
    test: file => /package\.json$/i.test(file),
    message: "checks the dependency pantry"
  },
  {
    test: file => /\.(js|mjs|cjs|ts|tsx|jsx)$/i.test(file),
    message: "sniffs around the JavaScript wiring"
  },
  {
    test: file => /\.(md|mdx|txt)$/i.test(file),
    message: "reads the repository lore"
  },
  {
    test: file => /Dockerfile$/i.test(file) || /\.dockerfile$/i.test(file),
    message: "inspects the container kitchen"
  },
  {
    test: file => /\.(ya?ml|toml|json)$/i.test(file),
    message: "studies the configuration spells"
  },
  {
    test: file => /\.(py|rb|go|rs|java|cs|php)$/i.test(file),
    message: "examines backend machinery"
  }
];

const CODE_EXTENSIONS = new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".cs",
  ".php",
  ".rb",
  ".md",
  ".mdx",
  ".json",
  ".yaml",
  ".yml",
  ".toml",
  ".html",
  ".css"
]);

function parseArgs(argv) {
  const options = {
    root: ".",
    maxDepth: 5,
    tickMs: 700,
    sprite: "🧑‍🍳",
    peek: false,
    showHidden: false
  };

  for (const arg of argv) {
    if (arg.startsWith("--max-depth=")) {
      options.maxDepth = Number(arg.split("=")[1]);
    } else if (arg.startsWith("--tick=")) {
      options.tickMs = Number(arg.split("=")[1]);
    } else if (arg.startsWith("--sprite=")) {
      options.sprite = arg.split("=")[1] || options.sprite;
    } else if (arg === "--peek") {
      options.peek = true;
    } else if (arg === "--show-hidden") {
      options.showHidden = true;
    } else if (!arg.startsWith("--")) {
      options.root = arg;
    }
  }

  if (!Number.isFinite(options.maxDepth) || options.maxDepth < 1) {
    options.maxDepth = 5;
  }

  if (!Number.isFinite(options.tickMs) || options.tickMs < 100) {
    options.tickMs = 700;
  }

  return options;
}

function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H");
}

function hideCursor() {
  process.stdout.write("\x1b[?25l");
}

function showCursor() {
  process.stdout.write("\x1b[?25h");
}

function truncate(value, max = 90) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

function isHiddenName(name) {
  return name.startsWith(".");
}

function isIgnoredEntry(absPath, name) {
  if (DEFAULT_IGNORED_NAMES.has(name)) return true;

  const normalized = absPath.split(path.sep).join("/");
  return [...DEFAULT_IGNORED_NAMES].some(ignored =>
    normalized.endsWith(`/${ignored}`)
  );
}

function isSecretish(nameOrPath) {
  return SECRETISH_RE.test(nameOrPath);
}

function relativeDepth(root, target) {
  const rel = path.relative(root, target);
  if (!rel || rel === ".") return 0;
  return rel.split(path.sep).filter(Boolean).length;
}

async function safeStat(absPath) {
  try {
    return await fs.lstat(absPath);
  } catch {
    return null;
  }
}

async function safeListDir(absPath, options) {
  try {
    const entries = await fs.readdir(absPath, { withFileTypes: true });

    return entries
      .filter(entry => options.showHidden || !isHiddenName(entry.name))
      .filter(entry => !isIgnoredEntry(path.join(absPath, entry.name), entry.name))
      .filter(entry => !entry.isSymbolicLink())
      .sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      entries: []
    };
  }
}

async function maybePeekFile(absPath) {
  if (isSecretish(absPath)) {
    return "[masked: secret-like filename]";
  }

  const ext = path.extname(absPath).toLowerCase();
  if (!CODE_EXTENSIONS.has(ext) && path.basename(absPath) !== "Dockerfile") {
    return null;
  }

  const stat = await safeStat(absPath);
  if (!stat || !stat.isFile() || stat.size > 80_000) {
    return null;
  }

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

function describeFile(absPath) {
  const match = FILE_PERSONALITIES.find(rule => rule.test(absPath));
  return match?.message ?? "pokes an unfamiliar artifact";
}

function chooseWeighted(items) {
  if (items.length === 0) return null;

  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;

  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item.value;
  }

  return items[items.length - 1].value;
}

function createLogLine(sprite, action, location) {
  const time = new Date().toLocaleTimeString();
  return `${time} ${sprite} ${action}: ${location}`;
}

async function nextMove(state, options) {
  const currentStat = await safeStat(state.current);

  if (!currentStat) {
    state.current = path.dirname(state.current);
    state.logs.unshift(createLogLine(options.sprite, "retreats from missing path", state.current));
    return;
  }

  if (currentStat.isFile()) {
    const parent = path.dirname(state.current);
    state.current = parent;
    state.logs.unshift(createLogLine(options.sprite, "hops back into directory", parent));
    return;
  }

  const listed = await safeListDir(state.current, options);

  if (listed.error) {
    const parent = path.dirname(state.current);
    state.current = parent === state.current ? options.root : parent;
    state.logs.unshift(createLogLine(options.sprite, "avoids locked room", listed.error));
    return;
  }

  const entries = listed;
  const depth = relativeDepth(options.root, state.current);

  const directories = [];
  const files = [];

  for (const entry of entries) {
    const abs = path.join(state.current, entry.name);

    if (entry.isDirectory()) {
      if (depth < options.maxDepth) {
        directories.push(abs);
      }
    } else if (entry.isFile()) {
      files.push(abs);
    }
  }

  const parent = path.dirname(state.current);
  const canMoveUp = state.current !== options.root && parent !== state.current;

  const choices = [
    ...directories.map(abs => ({ value: abs, weight: 5 })),
    ...files.map(abs => ({ value: abs, weight: 2 }))
  ];

  if (canMoveUp) {
    choices.push({ value: parent, weight: 3 });
  }

  if (choices.length === 0) {
    state.logs.unshift(
      createLogLine(options.sprite, "finds a dead end and turns around", state.current)
    );

    if (canMoveUp) state.current = parent;
    return;
  }

  const chosen = chooseWeighted(choices);
  if (!chosen) return;

  const chosenStat = await safeStat(chosen);
  state.current = chosen;
  state.visited.add(chosen);

  if (chosenStat?.isDirectory()) {
    state.logs.unshift(createLogLine(options.sprite, "wanders into", chosen));
  } else if (chosenStat?.isFile()) {
    const fileAction = describeFile(chosen);
    let line = createLogLine(options.sprite, fileAction, chosen);

    if (options.peek) {
      const peek = await maybePeekFile(chosen);
      if (peek) line += ` | peek: ${peek}`;
    }

    state.logs.unshift(line);
  }

  state.logs = state.logs.slice(0, 10);
}

async function render(state, options) {
  clearScreen();

  const cwd = state.current;
  const stat = await safeStat(cwd);
  const currentIsDir = stat?.isDirectory();

  console.log("Repo Shemi Roamer");
  console.log("────────────────────────────────────────────────────────────");
  console.log(`Sprite:        ${options.sprite}`);
  console.log(`Root:          ${options.root}`);
  console.log(`Current:       ${cwd}`);
  console.log(`Mode:          ${options.peek ? "peek-safe read mode" : "metadata-only read mode"}`);
  console.log(`Visited paths: ${state.visited.size}`);
  console.log(`Step:          ${state.step}`);
  console.log("Controls:      q / Ctrl+C to quit");
  console.log("");

  if (currentIsDir) {
    const listed = await safeListDir(cwd, options);

    console.log(`${options.sprite} inside: ${path.basename(cwd) || cwd}`);
    console.log("────────────────────────────────────────────────────────────");

    if (listed.error) {
      console.log(`  [locked] ${listed.error}`);
    } else if (listed.length === 0) {
      console.log("  [empty]");
    } else {
      for (const entry of listed.slice(0, 22)) {
        const icon = entry.isDirectory() ? "📁" : "📄";
        const secretMarker = isSecretish(entry.name) ? " [masked]" : "";
        console.log(`  ${icon} ${truncate(entry.name, 60)}${secretMarker}`);
      }

      if (listed.length > 22) {
        console.log(`  … ${listed.length - 22} more`);
      }
    }
  } else {
    console.log(`${options.sprite} inspecting file: ${path.basename(cwd)}`);
  }

  console.log("");
  console.log("Recent trail");
  console.log("────────────────────────────────────────────────────────────");

  if (state.logs.length === 0) {
    console.log("  The little repo chef is waking up...");
  } else {
    for (const log of state.logs) {
      console.log(`  ${truncate(log, 120)}`);
    }
  }
}

function setupKeyboard(onQuit) {
  readline.emitKeypressEvents(process.stdin);

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on("keypress", (_, key) => {
    if (key?.name === "q" || (key?.ctrl && key?.name === "c")) {
      onQuit();
    }
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

  const state = {
    current: options.root,
    visited: new Set([options.root]),
    logs: [],
    step: 0
  };

  let stopped = false;

  const quit = () => {
    stopped = true;
    showCursor();
    clearScreen();
    console.log(`${options.sprite} Repo Shemi went back to the pantry.`);
    process.exit(0);
  };

  setupKeyboard(quit);
  hideCursor();

  process.on("SIGINT", quit);
  process.on("SIGTERM", quit);
  process.on("exit", showCursor);

  while (!stopped) {
    state.step += 1;
    await nextMove(state, options);
    await render(state, options);
    await new Promise(resolve => setTimeout(resolve, options.tickMs));
  }
}

main().catch(error => {
  showCursor();
  console.error(error);
  process.exit(1);
});
