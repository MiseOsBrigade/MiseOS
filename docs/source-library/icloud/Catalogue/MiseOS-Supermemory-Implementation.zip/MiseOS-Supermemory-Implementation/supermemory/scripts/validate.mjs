import path from "node:path";
import { root, readJson, listJson } from "./common.mjs";
const cfg=await readJson(path.join(root,'config/project.json'));
const files=await listJson(path.join(root,'records'));
const ids=new Set(); let errors=0;
for(const file of files){const r=await readJson(file); const req=['customId','content','containerTag','entityContext','metadata']; for(const k of req) if(!(k in r)){console.error(`${file}: missing ${k}`);errors++;}
if(r.containerTag!==cfg.container_tag){console.error(`${file}: wrong containerTag`);errors++;}
if(r.entityContext?.length>1500){console.error(`${file}: entityContext >1500`);errors++;}
if(ids.has(r.customId)){console.error(`${file}: duplicate customId ${r.customId}`);errors++;} ids.add(r.customId);
for(const k of cfg.metadata_contract.required) if(!(k in (r.metadata||{}))){console.error(`${file}: missing metadata.${k}`);errors++;}
for(const [k,v] of Object.entries(r.metadata||{})) if(v!==null&&typeof v==='object'){console.error(`${file}: nested metadata ${k}`);errors++;}
}
console.log(`Validated ${files.length} records; errors=${errors}`); if(errors) process.exit(1);
