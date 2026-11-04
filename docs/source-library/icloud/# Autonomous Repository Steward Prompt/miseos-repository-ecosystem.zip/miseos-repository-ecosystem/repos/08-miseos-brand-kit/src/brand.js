import fs from 'node:fs';
const brand = JSON.parse(fs.readFileSync(new URL('../tokens/miseos.tokens.json', import.meta.url), 'utf8'));

export function getColor(name) {
  return brand.colors[name];
}

export function getCharacter(id) {
  return brand.characters.find(character => character.id === id);
}
