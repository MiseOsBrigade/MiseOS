#!/usr/bin/env node
import assert from 'node:assert/strict';
import { loadManifests, summarizeRegistry, scoreManifest } from './lib/registry.mjs';
const manifests = loadManifests(process.cwd());
const summary = summarizeRegistry(process.cwd());
assert.equal(manifests.length, summary.counts.manifests);
assert.ok(manifests.length >= 20, 'expected at least 20 manifests');
assert.ok(summary.gates.allManifestsComplete, 'all manifests should be complete');
for (const manifest of manifests) {
  const score = scoreManifest(manifest);
  assert.ok(score.score >= 0 && score.score <= 100, `${manifest.id} risk score out of range`);
}
console.log(`✓ Tests passed: ${manifests.length} manifests, analytics operational`);
