import fs from "node:fs"; import path from "node:path";
export function loadWorkflowRegistry(filePath){const r=JSON.parse(fs.readFileSync(filePath,"utf8")); for(const [id,p] of Object.entries(r)){if(!/^[a-z0-9_.-]+$/.test(id)||!/^\.\/[A-Za-z0-9._/-]+\.js$/.test(p)||p.includes("..")||path.isAbsolute(p))throw new Error(`Unsafe workflow registry entry: ${id}`);} return Object.freeze(r);}
