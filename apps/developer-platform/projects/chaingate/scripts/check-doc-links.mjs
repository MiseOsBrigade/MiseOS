import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";

const root = process.cwd();
const markdown = [];
async function walk(dir) {
  for (const entry of await readdir(dir)) {
    if (["node_modules", ".git", "dist", "coverage"].includes(entry)) continue;
    const path = resolve(dir, entry);
    const info = await stat(path);
    if (info.isDirectory()) await walk(path);
    else if (path.endsWith(".md")) markdown.push(path);
  }
}
await walk(root);
const missing = [];
for (const file of markdown) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(/\[[^\]]+\]\((?!https?:|mailto:|#)([^)#]+)(?:#[^)]+)?\)/g)) {
    const target = resolve(dirname(file), match[1]);
    try { await stat(target); } catch { missing.push(`${file.slice(root.length + 1)} -> ${match[1]}`); }
  }
}
if (missing.length) {
  console.error("Broken local documentation links:\n" + missing.join("\n"));
  process.exit(1);
}
console.log(`Checked ${markdown.length} Markdown files.`);
