import fs from 'node:fs';
const index=JSON.parse(fs.readFileSync('data/characters.json','utf8'));
const errors=[];
if(index.length!==112) errors.push('expected 112 characters');
const seen=new Set();
for(const c of index){
 if(seen.has(c.slug)) errors.push('duplicate '+c.slug); seen.add(c.slug);
 for(const p of [c.profile,c.metadata,c.avatar]) if(!fs.existsSync(p)) errors.push('missing '+p);
 if(fs.existsSync(c.metadata)){const m=JSON.parse(fs.readFileSync(c.metadata,'utf8'));if(!m.workflow?.proof_gate) errors.push('missing proof gate '+c.slug);}
}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Validated 112 MiseOS character profiles.');
