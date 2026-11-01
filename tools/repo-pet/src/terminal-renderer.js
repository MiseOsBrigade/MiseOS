import fs from "node:fs/promises";
import path from "node:path";
import { isSecretish, truncate } from "./safety.js";

export function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H");
}

export function hideCursor() {
  process.stdout.write("\x1b[?25l");
}

export function showCursor() {
  process.stdout.write("\x1b[?25h");
}

async function listPreview(absPath, showHidden = false) {
  try {
    const entries = await fs.readdir(absPath, { withFileTypes: true });
    return entries
      .filter(entry => showHidden || !entry.name.startsWith("."))
      .sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 22)
      .map(entry => `${entry.isDirectory() ? "📁" : "📄"} ${truncate(entry.name, 60)}${isSecretish(entry.name) ? " [masked]" : ""}`);
  } catch (error) {
    return [`[locked] ${error instanceof Error ? error.message : String(error)}`];
  }
}

export async function renderTerminal(roamer, options = {}) {
  const snapshot = roamer.snapshot();
  const stat = await fs.lstat(snapshot.current).catch(() => null);
  const currentIsDir = stat?.isDirectory();

  clearScreen();
  console.log("MiseOS Repo Pet");
  console.log("────────────────────────────────────────────────────────────");
  console.log(`Character:     ${snapshot.character.sprite} ${snapshot.character.name}`);
  console.log(`Role:          ${snapshot.character.role}`);
  console.log(`Department:    ${snapshot.character.department}`);
  console.log(`Root:          ${snapshot.root}`);
  console.log(`Current:       ${snapshot.current}`);
  console.log(`Visited paths: ${snapshot.visitedCount}`);
  console.log(`Step:          ${snapshot.stepCount}`);
  console.log("Controls:      q / Ctrl+C to quit");
  console.log("");

  if (currentIsDir) {
    console.log(`${snapshot.character.sprite} inside: ${path.basename(snapshot.current) || snapshot.current}`);
    console.log("────────────────────────────────────────────────────────────");
    const preview = await listPreview(snapshot.current, options.showHidden);
    for (const line of preview) console.log(`  ${line}`);
  } else {
    console.log(`${snapshot.character.sprite} inspecting file: ${path.basename(snapshot.current)}`);
  }

  console.log("");
  console.log("Recent trail");
  console.log("────────────────────────────────────────────────────────────");
  for (const event of snapshot.logs) {
    console.log(`  ${truncate(`${event.sprite} ${event.character} ${event.action}: ${event.location}`, 120)}`);
  }
}
