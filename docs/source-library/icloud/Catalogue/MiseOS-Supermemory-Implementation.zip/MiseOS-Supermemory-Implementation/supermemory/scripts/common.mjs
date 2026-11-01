import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

export const here = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(here, "..");
export async function readJson(file) { return JSON.parse(await fs.readFile(file, "utf8")); }
export async function listJson(dir) { const out=[]; for (const e of await fs.readdir(dir,{withFileTypes:true})) { const p=path.join(dir,e.name); if(e.isDirectory()) out.push(...await listJson(p)); else if(e.name.endsWith('.json')&&!e.name.startsWith('TEMPLATE-')) out.push(p); } return out; }
export function requireEnv(name){ const v=process.env[name]; if(!v) throw new Error(`Missing ${name}`); return v; }
export async function api(pathname, options={}) { const base=process.env.SUPERMEMORY_API_BASE||"https://api.supermemory.ai"; const key=requireEnv("SUPERMEMORY_API_KEY"); const res=await fetch(`${base}${pathname}`,{...options,headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json',...(options.headers||{})}}); const text=await res.text(); if(!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text}`); return text?JSON.parse(text):null; }
export function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
