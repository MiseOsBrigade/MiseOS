import { api } from "./common.mjs";
const q=process.argv.slice(2).join(' ');
const body={containerTag:process.env.SUPERMEMORY_CONTAINER_TAG||'miseos-character-core'}; if(q) body.q=q;
const result=await api('/v4/profile',{method:'POST',body:JSON.stringify(body)}); console.log(JSON.stringify(result,null,2));
