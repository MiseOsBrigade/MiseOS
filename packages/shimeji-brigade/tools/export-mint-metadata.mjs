import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname;
const registry = JSON.parse(await readFile(join(ROOT, 'src/character-registry.json'), 'utf8'));
const items = [];

for (const character of registry.characters) {
  const manifest = JSON.parse(await readFile(join(ROOT, character.spriteRoot, 'manifest.json'), 'utf8'));
  items.push({
    id: character.id,
    name: character.name,
    description: `${character.role} runtime sprite pack for Shimeji Brigade.`,
    image: null,
    animation_url: null,
    external_url: null,
    attributes: [
      { trait_type: 'Role', value: character.role },
      { trait_type: 'Squad', value: character.squad },
      { trait_type: 'Reference Backed', value: manifest.referenceBacked },
      { trait_type: 'Frame Size', value: `${manifest.frameSize.width}x${manifest.frameSize.height}` }
    ],
    properties: {
      files: [],
      category: 'sprite-pack',
      runtime: 'shimeji-brigade',
      rightsAttestationRequired: true,
      walletBoundary: 'Shimeji Mint only'
    }
  });
}

await mkdir(join(ROOT, 'exports'), { recursive: true });
await writeFile(join(ROOT, 'exports/mint-ready-metadata.json'), JSON.stringify({ schemaVersion: '1.0.0', generatedAt: new Date().toISOString(), items }, null, 2) + '\n');
console.log('BUILT exports/mint-ready-metadata.json');
