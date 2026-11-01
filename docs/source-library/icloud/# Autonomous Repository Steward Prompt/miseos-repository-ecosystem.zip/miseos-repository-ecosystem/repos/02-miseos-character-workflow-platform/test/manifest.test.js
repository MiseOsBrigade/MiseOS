import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { verifyManifestShape, verifyAssetHash } from '../api/manifestVerifier.js';
import { executeWorkflow } from '../api/workflowExecutor.js';

const manifest = JSON.parse(fs.readFileSync(new URL('../manifest/clickable-character.manifest.example.json', import.meta.url), 'utf8'));
const registry = JSON.parse(fs.readFileSync(new URL('../workflow/registry.json', import.meta.url), 'utf8'));

test('manifest is valid and asset hash matches', () => {
  assert.equal(verifyManifestShape(manifest), true);
  assert.equal(verifyAssetHash(manifest), true);
});

test('hotspot actions are allowlisted and executable', async () => {
  for (const h of manifest.hotspots) {
    assert.equal(Object.hasOwn(registry, h.actionId), true);
    const result = await executeWorkflow(h.actionId, { hotspotId: h.id });
    assert.equal(result.ok, true);
  }
});
