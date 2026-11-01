#!/usr/bin/env node
import { loadRegistry, loadManifests } from './lib/registry.mjs';
const registry = loadRegistry(process.cwd());
const manifests = loadManifests(process.cwd());
const expectedScope = registry.namespaces?.npm;
const mismatches = [];
for (const manifest of manifests) {
  const npmName = manifest.artifacts?.npm;
  if (npmName && expectedScope && !npmName.startsWith(`${expectedScope}/`)) {
    mismatches.push(`${manifest.id}: ${npmName} should use ${expectedScope}/...`);
  }
}
if (mismatches.length) {
  for (const mismatch of mismatches) console.error(`✖ ${mismatch}`);
  process.exit(1);
}
console.log(`✓ npm scope check passed: ${expectedScope}`);
