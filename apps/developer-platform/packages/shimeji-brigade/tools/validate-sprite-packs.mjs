import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('../assets/sprites/', import.meta.url);
const REQUIRED_STATES = ['idle', 'walk', 'climb', 'fall', 'drag', 'interact', 'perch'];
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

async function pngSize(path) {
  const data = await readFile(path);
  if (!data.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('not a PNG');
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

async function validatePack(dirent) {
  const root = join(ROOT.pathname, dirent.name);
  const manifest = JSON.parse(await readFile(join(root, 'manifest.json'), 'utf8'));
  const errors = [];
  const warnings = [];

  if (manifest.id !== dirent.name) errors.push('manifest id must match directory name');
  if (manifest.frameSize?.width !== 128 || manifest.frameSize?.height !== 128) {
    errors.push('frameSize must be 128x128');
  }

  for (const stateName of REQUIRED_STATES) {
    const expected = manifest.states?.[stateName];
    if (!Number.isInteger(expected) || expected < 0) {
      errors.push(`${stateName}: invalid frame count`);
      continue;
    }
    const stateDir = join(root, stateName);
    let files = [];
    try {
      files = (await readdir(stateDir)).filter((name) => /^frame_\d{3}\.png$/.test(name)).sort();
    } catch {
      if (expected > 0) errors.push(`${stateName}: missing directory`);
      else warnings.push(`${stateName}: fallback-only state`);
      continue;
    }
    if (files.length !== expected) errors.push(`${stateName}: expected ${expected}, found ${files.length}`);
    for (const file of files) {
      const path = join(stateDir, file);
      if (!(await stat(path)).isFile()) continue;
      try {
        const size = await pngSize(path);
        if (size.width !== 128 || size.height !== 128) errors.push(`${stateName}/${file}: must be 128x128`);
      } catch (error) {
        errors.push(`${stateName}/${file}: ${error.message}`);
      }
    }
  }

  return { id: manifest.id, errors, warnings };
}

const dirs = (await readdir(ROOT, { withFileTypes: true })).filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'));
let failed = false;
for (const dir of dirs) {
  const result = await validatePack(dir);
  failed ||= result.errors.length > 0;
  console.log(`${result.errors.length ? 'FAIL' : 'PASS'} ${result.id} (${result.warnings.length} warnings, ${result.errors.length} errors)`);
  for (const warning of result.warnings) console.warn(`  WARN ${warning}`);
  for (const error of result.errors) console.error(`  ERROR ${error}`);
}
if (failed) process.exit(1);
