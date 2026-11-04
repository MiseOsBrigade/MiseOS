import fs from 'node:fs';
import crypto from 'node:crypto';

export function verifyManifestShape(manifest) {
  return Boolean(manifest.version && manifest.asset && manifest.signature && Array.isArray(manifest.hotspots) && manifest.policies?.allowlistOnly === true && manifest.policies?.noEmbeddedCode === true);
}

export function verifyAssetHash(manifest, base = 'frontend') {
  const path = `${base}${manifest.asset.pngPath}`;
  if (!fs.existsSync(path)) return false;
  const actual = crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
  return actual === manifest.asset.sha256;
}

export function verifyManifest(manifest) {
  return verifyManifestShape(manifest);
}
