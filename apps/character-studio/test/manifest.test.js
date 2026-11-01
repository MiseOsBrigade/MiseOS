import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { canonicalManifestPayload, ManifestSchema } from '../api/manifestVerifier.js';

test('canonical payload is stable regardless of key insertion order', () => {
  const a = { signature: 'x', b: 2, a: { y: 2, x: 1 } };
  const b = { a: { x: 1, y: 2 }, b: 2, signature: 'x' };
  assert.deepEqual(canonicalManifestPayload(a), canonicalManifestPayload(b));
});

test('manifest schema rejects arbitrary action identifiers', () => {
  const result = ManifestSchema.safeParse({
    schemaVersion: '1.0',
    character: { id: 'miseos.repo', name: 'Repo', version: '1.0.0' },
    asset: { pngPath: '/x.png', sha256: 'a'.repeat(64) },
    hotspots: [{
      id: 'x',
      name: 'x',
      actionId: '../../evil',
      requiresSession: true,
      requiresNft: false,
      shape: { type: 'circle', x: 1, y: 1, r: 1 }
    }],
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 10000).toISOString(),
    keyId: 'k',
    signature: crypto.randomBytes(64).toString('base64url')
  });
  assert.equal(result.success, false);
});
