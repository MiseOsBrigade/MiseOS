#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { loadRegistry, loadManifests, summarizeRegistry, writeJson, toCsv } from './lib/registry.mjs';
const root = process.cwd();
const registry = loadRegistry(root);
const manifests = loadManifests(root);
const summary = summarizeRegistry(root);
const out = { exportedAt: new Date().toISOString(), registry, summary: summary.counts, manifests };
writeJson(path.join(root, 'dist', 'miseos-registry-index.json'), out);
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'miseos-registry-catalog.csv'), toCsv(manifests.map((manifest) => ({
  id: manifest.id,
  name: manifest.name,
  type: manifest.type,
  version: manifest.version,
  status: manifest.status,
  tier: manifest.analytics.operationalTier,
  criticality: manifest.analytics.criticality,
  registries: Object.keys(manifest.artifacts).join('; '),
  artifacts: Object.values(manifest.artifacts).join('; ')
}))));
console.log('✓ Registry exported to dist/');
