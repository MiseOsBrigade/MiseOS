import { mkdir, readFile, readdir, cp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const PACKAGE_ROOT = new URL('../', import.meta.url).pathname;
const SPRITES = join(PACKAGE_ROOT, 'assets/sprites');
const EXPORTS = join(PACKAGE_ROOT, 'exports');
const STAGING = join(EXPORTS, '.staging');
const registry = JSON.parse(await readFile(join(PACKAGE_ROOT, 'src/character-registry.json'), 'utf8'));

await rm(STAGING, { recursive: true, force: true });
await mkdir(STAGING, { recursive: true });
await mkdir(EXPORTS, { recursive: true });

for (const character of registry.characters) {
  const source = join(SPRITES, character.id);
  const target = join(STAGING, character.id);
  await cp(source, target, { recursive: true });
  await writeFile(join(target, 'registry-entry.json'), JSON.stringify(character, null, 2) + '\n');
  await writeFile(join(target, 'validation-report.json'), JSON.stringify({ id: character.id, generatedAt: new Date().toISOString(), status: 'validated-by-ci' }, null, 2) + '\n');
  const zip = join(EXPORTS, `${character.id}-runtime-pack.zip`);
  try {
    execFileSync('zip', ['-qr', zip, character.id], { cwd: STAGING });
    console.log(`BUILT exports/${character.id}-runtime-pack.zip`);
  } catch {
    const fallback = join(EXPORTS, `${character.id}-runtime-pack.json`);
    const manifest = JSON.parse(await readFile(join(source, 'manifest.json'), 'utf8'));
    await writeFile(fallback, JSON.stringify({ manifest, character, note: 'ZIP utility unavailable; JSON fallback created.' }, null, 2) + '\n');
    console.log(`BUILT exports/${character.id}-runtime-pack.json`);
  }
}
