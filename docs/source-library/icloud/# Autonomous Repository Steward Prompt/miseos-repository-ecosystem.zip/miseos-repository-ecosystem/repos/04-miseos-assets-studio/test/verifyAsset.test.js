import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { verifyAsset } from '../src/verifyAsset.js';
import { canExportAsset } from '../src/entitlements.js';

const asset = JSON.parse(fs.readFileSync(new URL('../examples/cozy-village.asset.json', import.meta.url), 'utf8'));

test('asset verifier passes complete asset', () => {
  assert.equal(verifyAsset(asset).passed, true);
});

test('premium asset export requires entitlement', () => {
  assert.equal(canExportAsset(asset, { ownedPacks: [] }), false);
  assert.equal(canExportAsset(asset, { ownedPacks: ['cozy-village'] }), true);
});
