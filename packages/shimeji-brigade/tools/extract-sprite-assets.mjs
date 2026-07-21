import { access, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const archive = join(PACKAGE_ROOT, 'assets', 'sprite-packs-v8.tar.gz');
const sprites = join(PACKAGE_ROOT, 'assets', 'sprites');

await access(archive);
await mkdir(sprites, { recursive: true });
execFileSync('tar', ['-xzf', archive, '-C', PACKAGE_ROOT], { stdio: 'inherit' });
console.log('Extracted candidate sprite frames from assets/sprite-packs-v8.tar.gz');
