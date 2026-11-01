import fs from 'node:fs';
import { verifyManifest, manifestId } from '../api/manifestVerifier.js';

const input = process.argv[2] ?? './frontend/manifest/clickable-character.manifest.json';
const manifest = verifyManifest(JSON.parse(fs.readFileSync(input, 'utf8')));
console.log(JSON.stringify({ valid: true, manifestId: manifestId(manifest), character: manifest.character }, null, 2));
