import path from "node:path";
import { root, readJson, listJson, api, sleep } from "./common.mjs";
const cfg=await readJson(path.join(root,'config/project.json'));
const dry=process.argv.includes('--dry-run'); const only=(process.argv.find(x=>x.startsWith('--collection='))||'').split('=')[1];
const selected=cfg.record_collections.filter(c=>!only||c.key===only).sort((a,b)=>a.ingest_order-b.ingest_order);
let ok=0,fail=0;
for(const col of selected){const files=await listJson(path.join(root,col.path)); console.log(`Collection ${col.key}: ${files.length}`); for(const file of files){const body=await readJson(file); try{if(dry) console.log(`[dry] ${body.customId}`); else {const r=await api('/v3/documents',{method:'POST',body:JSON.stringify(body)}); console.log(`${body.customId}: ${r.status} ${r.id}`); await sleep(125);} ok++;}catch(e){console.error(`${body.customId}: ${e.message}`);fail++;}}
}
console.log({ok,fail,dry}); if(fail) process.exit(1);
