import fs from 'node:fs';
const errors = [];
const ex = (p, what) => { if (!p || !fs.existsSync(p)) errors.push(`${what}: missing ${p}`); };
const pets = JSON.parse(fs.readFileSync('data/repo-pets.json', 'utf8'));
if (pets.count !== pets.pets.length) errors.push('repo-pets count mismatch');
for (const p of pets.pets) {
  ex(p.dir, `pet ${p.slug} dir`); ex(`${p.dir}/pet.json`, `pet ${p.slug} record`); ex(p.page, `pet ${p.slug} page`);
  for (const s of p.sprites) ex(s, `pet ${p.slug} sprite`);
  for (const c of p.cards) ex(c, `pet ${p.slug} card page`);
  if (p.character) ex(`docs/characters/${p.character}.md`, `pet ${p.slug} character`);
  if (!p.source) errors.push(`pet ${p.slug} has no source`);
}
const agents = JSON.parse(fs.readFileSync('data/agents.json', 'utf8'));
if (agents.count !== agents.agents.length) errors.push('agents count mismatch');
for (const a of agents.agents) {
  ex(a.page, `agent ${a.slug} page`);
  for (const f of a.files) ex(f, `agent ${a.slug} file`);
  if (a.character) ex(`docs/characters/${a.character}.md`, `agent ${a.slug} character`);
  for (const c of a.cards) ex(c, `agent ${a.slug} card page`);
  if (a.pet) ex(`docs/repo-pets/${a.pet}.md`, `agent ${a.slug} pet`);
  if (!a.source) errors.push(`agent ${a.slug} has no source`);
}
const src = JSON.parse(fs.readFileSync('data/source-files.json', 'utf8'));
let added = 0;
for (const r of src.files) {
  if (r.status === 'added' || r.status === 'duplicate') { ex(r.repo_path, `source ${r.original}`); if (r.status === 'added') added++; }
  else if (r.status === 'excluded') { if (!r.reason) errors.push(`excluded ${r.original} has no reason`); }
  else errors.push(`unknown status for ${r.original}`);
  if (r.repo_path && fs.existsSync(r.repo_path) && fs.statSync(r.repo_path).size >= 95 * 1024 * 1024) errors.push(`too large: ${r.repo_path}`);
}
if (added !== src.summary.added) errors.push('source-files summary.added mismatch');
if (errors.length) { console.error(errors.slice(0, 50).join('\n')); console.error(`${errors.length} errors`); process.exit(1); }
console.log(`Validated ${pets.pets.length} repo pets, ${agents.agents.length} agents, ${src.files.length} source-file entries (${added} added).`);
// Image sharpness: every card is stored at its original's native size and its thumbnail is >= 2x the 240px display width (or the original's width).
const cardIdx = JSON.parse(fs.readFileSync('data/player-cards.json', 'utf8'));
const blurry = cardIdx.cards.filter((c) => !c.best_original_size || c.full_size?.[0] !== c.best_original_size[0] || c.thumb_size?.[0] < Math.min(480, c.best_original_size[0]));
if (blurry.length) { console.error(`${blurry.length} cards not built from their best original: ${blurry.slice(0, 5).map((c) => c.file).join(', ')}`); process.exit(1); }
console.log(`Validated ${cardIdx.cards.length} card images at native resolution with 2x thumbnails.`);
