#!/usr/bin/env node

import process from "node:process";
import readline from "node:readline";
import { RepoRoamer, formatEventLine, listCharacterRows } from "../src/index.js";
import { hideCursor, renderRoamer, showCursor, clearScreen } from "../src/terminal-renderer.js";

function parseArgs(argv) {
  const options = {
    root: ".",
    character: "orchestra-core",
    maxDepth: 5,
    tick: 700,
    steps: null,
    json: false,
    peek: false,
    showHidden: false,
    listCharacters: false
  };

  for (const arg of argv) {
    if (arg.startsWith("--character=")) options.character = arg.split("=")[1];
    else if (arg.startsWith("--max-depth=")) options.maxDepth = Number(arg.split("=")[1]);
    else if (arg.startsWith("--tick=")) options.tick = Number(arg.split("=")[1]);
    else if (arg.startsWith("--steps=")) options.steps = Number(arg.split("=")[1]);
    else if (arg === "--json") options.json = true;
    else if (arg === "--peek") options.peek = true;
    else if (arg === "--show-hidden") options.showHidden = true;
    else if (arg === "--list-characters") options.listCharacters = true;
    else if (arg === "--help" || arg === "-h") printHelpAndExit();
    else if (!arg.startsWith("--")) options.root = arg;
  }

  if (!Number.isFinite(options.maxDepth) || options.maxDepth < 1) options.maxDepth = 5;
  if (!Number.isFinite(options.tick) || options.tick < 100) options.tick = 700;
  if (options.steps !== null && (!Number.isFinite(options.steps) || options.steps < 1)) options.steps = null;

  return options;
}

function printHelpAndExit() {
  console.log(`MiseOS Repo Pet\n\nUsage:\n  repo-pet [root] [options]\n\nOptions:\n  --character=<id>       Character id, for example kurogami-senpai, tensho, or orchestra-core\n  --list-characters      Print available character ids\n  --max-depth=<n>        Maximum directory depth from root, default 5\n  --tick=<ms>            Interactive delay in milliseconds, default 700\n  --steps=<n>            Run finite non-interactive steps and exit\n  --json                 Output JSON lines when used with --steps\n  --peek                 Safely peek first useful line of small non-secret text files\n  --show-hidden          Include hidden files except ignored heavy directories\n  --help                 Show this help\n\nExamples:\n  repo-pet . --character=kurogami-senpai\n  repo-pet / --character=orchestra-core --max-depth=4\n  repo-pet . --character=flash-riku --steps=8 --json\n`);
  process.exit(0);
}

function setupKeyboard(onQuit) {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.on("keypress", (_, key) => {
    if (key?.name === "q" || (key?.ctrl && key?.name === "c")) onQuit();
  });
}

async function runFinite(roamer, steps, asJson) {
  for (let index = 0; index < steps; index += 1) {
    const event = await roamer.step();
    console.log(asJson ? JSON.stringify(event) : formatEventLine(event));
  }
}

async function runInteractive(roamer, tick) {
  let stopped = false;
  const character = roamer.character;

  const quit = () => {
    stopped = true;
    showCursor();
    clearScreen();
    console.log(`${character.sprite} ${character.name} closed the kitchen.`);
    process.exit(0);
  };

  setupKeyboard(quit);
  hideCursor();
  process.on("SIGINT", quit);
  process.on("SIGTERM", quit);
  process.on("exit", showCursor);

  while (!stopped) {
    await roamer.step();
    await renderRoamer(roamer);
    await new Promise(resolve => setTimeout(resolve, tick));
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.listCharacters) {
    console.table(listCharacterRows());
    return;
  }

  const roamer = new RepoRoamer({
    root: options.root,
    character: options.character,
    maxDepth: options.maxDepth,
    peek: options.peek,
    showHidden: options.showHidden
  });

  await roamer.assertReady();

  if (options.steps) {
    await runFinite(roamer, options.steps, options.json);
    return;
  }

  await runInteractive(roamer, options.tick);
}

main().catch(error => {
  showCursor();
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
