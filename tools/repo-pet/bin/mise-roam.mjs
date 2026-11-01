#!/usr/bin/env node
import process from "node:process";
import readline from "node:readline";
import { RepoRoamer, formatEventLine, listCharacters } from "../src/index.js";
import { hideCursor, renderTerminal, showCursor, clearScreen } from "../src/terminal-renderer.js";

function parseArgs(argv) {
  const options = {
    root: ".",
    character: "orchestra-core",
    maxDepth: 5,
    tickMs: 700,
    steps: null,
    peek: false,
    json: false,
    showHidden: false,
    listCharacters: false
  };

  for (const arg of argv) {
    if (arg.startsWith("--character=")) options.character = arg.split("=")[1];
    else if (arg.startsWith("--max-depth=")) options.maxDepth = Number(arg.split("=")[1]);
    else if (arg.startsWith("--tick=")) options.tickMs = Number(arg.split("=")[1]);
    else if (arg.startsWith("--steps=")) options.steps = Number(arg.split("=")[1]);
    else if (arg === "--peek") options.peek = true;
    else if (arg === "--json") options.json = true;
    else if (arg === "--show-hidden") options.showHidden = true;
    else if (arg === "--list-characters") options.listCharacters = true;
    else if (!arg.startsWith("--")) options.root = arg;
  }

  if (!Number.isFinite(options.maxDepth) || options.maxDepth < 1) options.maxDepth = 5;
  if (!Number.isFinite(options.tickMs) || options.tickMs < 100) options.tickMs = 700;
  if (options.steps !== null && (!Number.isFinite(options.steps) || options.steps < 1)) options.steps = null;
  return options;
}

function setupKeyboard(onQuit) {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.on("keypress", (_, key) => {
    if (key?.name === "q" || (key?.ctrl && key?.name === "c")) onQuit();
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.listCharacters) {
    for (const character of listCharacters()) {
      console.log(`${character.number}. ${character.sprite} ${character.name} — ${character.role}`);
    }
    return;
  }

  const roamer = new RepoRoamer(options);
  await roamer.initialize();

  let stopped = false;
  const quit = () => {
    stopped = true;
    showCursor();
    clearScreen();
    console.log("🍳 MiseOS Repo Pet went back to the kitchen.");
    process.exit(0);
  };

  setupKeyboard(quit);
  hideCursor();
  process.on("SIGINT", quit);
  process.on("SIGTERM", quit);
  process.on("exit", showCursor);

  let count = 0;
  while (!stopped) {
    count += 1;
    const event = await roamer.step();
    if (options.json) console.log(JSON.stringify(event));
    else await renderTerminal(roamer, options);

    if (options.steps !== null && count >= options.steps) {
      showCursor();
      if (!options.json) console.log("\nService complete.");
      return;
    }

    await new Promise(resolve => setTimeout(resolve, options.tickMs));
  }
}

main().catch(error => {
  showCursor();
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
