import path from "node:path";
import { getDepartment } from "./characters.js";
import { isSecretish } from "./safety.js";
import { truncate } from "./repo-roamer.js";

export function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H");
}

export function hideCursor() {
  process.stdout.write("\x1b[?25l");
}

export function showCursor() {
  process.stdout.write("\x1b[?25h");
}

export async function renderRoamer(roamer) {
  const snapshot = roamer.getSnapshot();
  const character = snapshot.character;
  const department = getDepartment(character.department);
  const listing = await roamer.inspectCurrentDirectory();

  clearScreen();
  console.log("MiseOS Repo Pet");
  console.log("────────────────────────────────────────────────────────────");
  console.log(`${character.sprite} ${character.name} #${character.number} — ${character.title}`);
  console.log(`${character.glyph} ${department.label}: ${department.mantra}`);
  console.log(`Root:          ${snapshot.root}`);
  console.log(`Current:       ${snapshot.current}`);
  console.log(`Visited paths: ${snapshot.visitedCount}`);
  console.log(`Step:          ${snapshot.step}`);
  console.log("Controls:      q / Ctrl+C to quit");
  console.log("");
  console.log(truncate(character.catchphrase, 120));
  console.log("");

  console.log(`Station view: ${path.basename(snapshot.current) || snapshot.current}`);
  console.log("────────────────────────────────────────────────────────────");

  if (listing.error) {
    console.log(`  [locked] ${listing.error}`);
  } else if (!listing.currentIsDirectory) {
    console.log("  [file inspection mode]");
  } else if (listing.entries.length === 0) {
    console.log("  [empty station]");
  } else {
    for (const entry of listing.entries) {
      const icon = entry.isDirectory ? "📁" : "📄";
      const masked = isSecretish(entry.absPath) ? " [masked]" : "";
      const tags = entry.categories.length ? ` · ${entry.categories.join(",")}` : "";
      console.log(`  ${icon} ${truncate(entry.name, 52)}${masked}${tags}`);
    }
    if (listing.totalEntries > listing.entries.length) {
      console.log(`  … ${listing.totalEntries - listing.entries.length} more`);
    }
  }

  console.log("");
  console.log("Recent trail");
  console.log("────────────────────────────────────────────────────────────");

  if (snapshot.trail.length === 0) {
    console.log("  The kitchen is waking up...");
  } else {
    for (const event of snapshot.trail) {
      const prefix = `${event.sprite} ${event.characterName}`;
      const masked = event.masked ? " [masked]" : "";
      const peek = event.peek ? ` | peek: ${event.peek}` : "";
      console.log(`  ${truncate(`${prefix} ${event.verb}: ${event.relativePath}${masked}${peek}`, 124)}`);
    }
  }
}

export function formatEventLine(event) {
  const masked = event.masked ? " [masked]" : "";
  const peek = event.peek ? ` | peek: ${event.peek}` : "";
  return `${event.sprite} ${event.characterName} ${event.verb}: ${event.relativePath}${masked}${peek}`;
}
