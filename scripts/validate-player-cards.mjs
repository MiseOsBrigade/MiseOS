import fs from 'node:fs';
const errors = [];
const index = JSON.parse(fs.readFileSync('data/player-cards.json', 'utf8'));
const slugs = new Set(JSON.parse(fs.readFileSync('data/characters.json', 'utf8')).map((c) => c.slug));
const files = new Set();
for (const card of index.cards) {
  for (const key of ['file', 'thumbnail']) {
    if (!fs.existsSync(card[key])) errors.push(`missing ${key}: ${card[key]}`);
    else if (fs.statSync(card[key]).size >= 50 * 1024 * 1024) errors.push(`too large: ${card[key]}`);
  }
  if (files.has(card.file)) errors.push(`duplicate file: ${card.file}`);
  files.add(card.file);
  if (card.character_slug && !slugs.has(card.character_slug)) errors.push(`unknown character: ${card.character_slug}`);
}
if (index.count !== index.cards.length) errors.push('count does not match cards');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Validated ${index.cards.length} MiseOS player cards (${index.cards.filter((c) => c.character_slug).length} linked to characters).`);
