import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const suspicious = [/sk-[A-Za-z0-9_-]{20,}/, /ghp_[A-Za-z0-9_]{20,}/, /xox[baprs]-[A-Za-z0-9-]{20,}/];
const ignored = new Set(["node_modules", "dist", ".git"]);
let failed = false;
function walk(dir){ for (const name of readdirSync(dir)){ if (ignored.has(name)) continue; const path = join(dir, name); const stat = statSync(path); if (stat.isDirectory()) walk(path); else if (/\.(ts|js|json|md|html|yml|yaml)$/.test(name)){ const content = readFileSync(path, "utf8"); for (const pattern of suspicious){ if (pattern.test(content)){ console.error(`Potential secret found in ${path}`); failed = true; } } } } }
walk(root);
if (failed) process.exit(1);
console.log("No obvious secrets found in FileOps package.");
