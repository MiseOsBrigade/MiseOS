import fs from 'node:fs';
import path from 'node:path';
const errors = [];
const index = JSON.parse(fs.readFileSync('data/player-cards.json', 'utf8'));
for (const card of index.cards) {
  if (!card.page) { errors.push(`no page for card ${card.file}`); continue; }
  if (!fs.existsSync(card.page)) errors.push(`missing page ${card.page} for ${card.file}`);
  if (card.entity_slug) {
    if (card.page !== `docs/characters/${card.entity_slug}.md`) errors.push(`matched card ${card.file} does not resolve to its character page`);
    if (!fs.existsSync(`data/characters/${card.entity_slug}.json`)) errors.push(`missing detail record for ${card.entity_slug}`);
  } else if (!card.page.startsWith('docs/cards/')) errors.push(`unmatched card ${card.file} must resolve to a card page`);
}
const UNDEF = 'Not yet defined in the source material';
let links = 0;
for (const dir of ['docs/characters', 'docs/cards', 'docs/agents', 'docs/repo-pets']) {
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const p = path.join(dir, f); const body = fs.readFileSync(p, 'utf8');
    for (const m of body.matchAll(/(?:src|href)="([^"#]+)"|\]\((?!https?:)([^)#\s]+)(?:#[^)]*)?\)/g)) {
      const target = path.normalize(path.join(dir, decodeURI(m[1] ?? m[2]))); links++;
      if (!fs.existsSync(target)) errors.push(`${p}: broken link ${m[1] ?? m[2]}`);
    }
  }
}
for (const f of fs.readdirSync('data/characters')) {
  const e = JSON.parse(fs.readFileSync(path.join('data/characters', f), 'utf8'));
  for (const k of ['role', 'lore', 'signature_phrase']) if (e[k] !== UNDEF && !e.sources?.[k]) errors.push(`${f}: ${k} has no source`);
  for (const c of e.cards) for (const k of ['file', 'thumbnail']) if (!fs.existsSync(c[k])) errors.push(`${f}: missing image ${c[k]}`);
}
const readme = fs.readFileSync('README.md', 'utf8');
for (const m of readme.matchAll(/<a href="\.\/(docs\/(?:characters|cards)\/[^"]+)"/g)) if (!fs.existsSync(m[1])) errors.push(`README links missing page ${m[1]}`);
if (errors.length) { console.error(errors.slice(0, 50).join('\n')); console.error(`${errors.length} errors`); process.exit(1); }
console.log(`Validated ${index.cards.length} cards -> pages (${index.cards.filter((c) => c.entity_slug).length} character pages, ${index.cards.filter((c) => !c.entity_slug).length} card pages), ${links} page links.`);
