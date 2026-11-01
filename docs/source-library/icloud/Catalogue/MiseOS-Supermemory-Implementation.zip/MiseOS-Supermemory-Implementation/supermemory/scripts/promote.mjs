import fs from 'node:fs/promises'; import path from 'node:path'; import {root,readJson} from './common.mjs';
const [,,proposalFile,newRecordId]=process.argv; if(!proposalFile||!newRecordId) throw new Error('Usage: node promote.mjs <proposal-json> <new-record-id>');
const p=await readJson(path.resolve(proposalFile)); if(p.metadata.canon_status!=='PROPOSED') throw new Error('Input must be PROPOSED');
const stamp=new Date().toISOString().replace(/[:.]/g,'-'); const archived={...p,customId:`archive-${p.customId}-${stamp}`,metadata:{...p.metadata,record_kind:'archived_version',record_id:`ARCHIVE-${p.metadata.record_id}`,canon_status:'CANON',approval_status:'archived',archived:true,superseded_by:newRecordId}};
await fs.writeFile(path.join(root,'records/archive',`${archived.customId}.json`),JSON.stringify(archived,null,2));
const promoted={...p,customId:newRecordId.toLowerCase(),metadata:{...p.metadata,record_id:newRecordId,canon_status:'CANON',approval_status:'approved',version:'1.0',source_type:'approved_proposal'}};
await fs.writeFile(path.join(root,'records/governance',`${newRecordId.toLowerCase()}.json`),JSON.stringify(promoted,null,2)); console.log(`Promoted ${p.customId} -> ${newRecordId}`);
