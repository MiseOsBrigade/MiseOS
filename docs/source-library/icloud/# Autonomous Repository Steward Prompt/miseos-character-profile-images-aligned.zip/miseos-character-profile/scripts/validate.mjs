import fs from 'node:fs';
const cards=JSON.parse(fs.readFileSync('data/characters.json','utf8'));
const ids=new Set(), slugs=new Set(), errors=[];
for(const c of cards){
  if(ids.has(c.id)) errors.push(`duplicate id ${c.id}`); ids.add(c.id);
  if(slugs.has(c.slug)) errors.push(`duplicate slug ${c.slug}`); slugs.add(c.slug);
  for(const p of [`characters/${c.slug}/README.md`,`characters/${c.slug}/metadata.json`,`assets/characters/${c.slug}/profile.svg`])
    if(!fs.existsSync(p)) errors.push(`missing ${p}`);
  if(!c.workflow?.proof_gate) errors.push(`missing proof gate ${c.slug}`);
}
if(errors.length){ console.error(errors.join('\n')); process.exit(1); }
console.log(`Validated ${cards.length} MiseOS character profiles.`);
