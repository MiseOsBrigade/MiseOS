#!/usr/bin/env node
import path from 'node:path';
import { summarizeRegistry, loadManifests, writeJson } from './lib/registry.mjs';
const root = process.cwd();
const snapshot = {
  createdAt: new Date().toISOString(),
  summary: summarizeRegistry(root),
  manifests: loadManifests(root).map((manifest) => ({
    id: manifest.id,
    version: manifest.version,
    artifacts: manifest.artifacts,
    permissions: manifest.permissions,
    trust: manifest.trust,
    capabilities: manifest.capabilities
  }))
};
writeJson(path.join(root, 'registry', 'snapshots', 'current.json'), snapshot);
console.log('✓ Snapshot written to registry/snapshots/current.json');
