import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { canonicalManifestPayload } from '../api/manifestVerifier.js';

const templatePath = process.argv[2] ?? './manifest/clickable-character.manifest.template.json';
const outputPath = process.argv[3] ?? './frontend/manifest/clickable-character.manifest.json';
const keyPath = process.env.MANIFEST_PRIVATE_KEY_PATH ?? './keys/manifest-private.pem';

const manifest = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
manifest.signature = crypto.sign(
  null,
  canonicalManifestPayload(manifest),
  fs.readFileSync(keyPath, 'utf8')
).toString('base64url');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
console.log(`Signed manifest written to ${outputPath}`);
