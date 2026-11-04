#!/usr/bin/env node
import fs from "node:fs/promises";
import process from "node:process";

const required = ["README.md","package.json",".mise/brand.json",".mise/characters.json","scripts/mise-roamer.mjs","scripts/brand-folders.mjs"];

function parseMajor(version) {
  return Number(version.replace(/^v/, "").split(".")[0]);
}
async function exists(path) {
  try { await fs.access(path); return true; } catch { return false; }
}
async function main() {
  const ci = process.argv.includes("--ci");
  const nodeMajor = parseMajor(process.version);
  const failures = [];
  if (!Number.isFinite(nodeMajor) || nodeMajor < 24) failures.push(`Node.js 24+ is recommended. Current: ${process.version}`);
  for (const file of required) if (!(await exists(file))) failures.push(`Missing required file: ${file}`);
  if (failures.length > 0) {
    console.error("Mise OS doctor found issues:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(ci ? 1 : 0);
  }
  console.log("Mise OS doctor passed.");
  console.log(`Runtime: ${process.version}`);
  console.log("Service: ready.");
}
main().catch(error => {
  console.error(error);
  process.exit(1);
});
