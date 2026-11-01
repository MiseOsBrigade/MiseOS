import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..', '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-pets-'));
fs.cpSync(path.join(repoRoot, 'assets', 'repo-pets'), path.join(tmp, 'assets', 'repo-pets'), { recursive: true });
fs.mkdirSync(path.join(tmp, 'data'));
fs.copyFileSync(path.join(repoRoot, 'data', 'characters.json'), path.join(tmp, 'data', 'characters.json'));
for (const f of ['walk-header.svg', 'walk-kitchen.svg', 'walk-footer.svg']) fs.rmSync(path.join(tmp, 'assets', 'repo-pets', f), { force: true });

execFileSync(process.execPath, [path.join(here, '..', 'scripts', 'build-readme-pets.mjs'), `--root=${tmp}`, '--seed=test'], { stdio: 'pipe' });
for (const f of ['walk-header.svg', 'walk-kitchen.svg', 'walk-footer.svg']) {
  const svg = fs.readFileSync(path.join(tmp, 'assets', 'repo-pets', f), 'utf8');
  assert.ok(svg.startsWith('<svg'), `${f} is an svg`);
  assert.ok(Buffer.byteLength(svg) < 2 * 1024 * 1024, `${f} is under 2 MB`);
  assert.ok(svg.includes('data:image/png;base64,'), `${f} embeds its frames`);
  assert.ok(!/href="(https?:|\.\.?\/)/.test(svg), `${f} has no external images`);
  assert.ok(svg.includes('prefers-reduced-motion'), `${f} respects reduced motion`);
  assert.ok((svg.match(/@keyframes w\d+m/g) ?? []).length >= 4, `${f} has walkers`);
}
// Same seed => same output; the committed strips are reproducible.
const again = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-pets-'));
fs.cpSync(tmp, again, { recursive: true });
execFileSync(process.execPath, [path.join(here, '..', 'scripts', 'build-readme-pets.mjs'), `--root=${again}`, '--seed=test'], { stdio: 'pipe' });
assert.equal(fs.readFileSync(path.join(again, 'assets/repo-pets/walk-header.svg'), 'utf8'), fs.readFileSync(path.join(tmp, 'assets/repo-pets/walk-header.svg'), 'utf8'));
console.log('readme pets: 3 animated strips verified');
