#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { loadManifests, writeJson } from './lib/registry.mjs';
const root = process.cwd();
const baselinePath = process.argv[2] ?? path.join(root, 'registry', 'snapshots', 'baseline.json');
const current = Object.fromEntries(loadManifests(root).map((manifest) => [manifest.id, manifest]));
const report = { generatedAt: new Date().toISOString(), baseline: baselinePath, added: [], removed: [], changed: [] };
if (!fs.existsSync(baselinePath)) {
  report.note = 'No baseline snapshot found. Run pnpm snapshot, then copy current.json to baseline.json when accepted.';
} else {
  const baselineRaw = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  const baseline = Object.fromEntries((baselineRaw.manifests ?? []).map((manifest) => [manifest.id, manifest]));
  for (const id of Object.keys(current)) {
    if (!baseline[id]) report.added.push(id);
    else {
      const before = JSON.stringify(baseline[id]);
      const after = JSON.stringify({ id: current[id].id, version: current[id].version, artifacts: current[id].artifacts, permissions: current[id].permissions, trust: current[id].trust, capabilities: current[id].capabilities });
      if (before !== after) report.changed.push(id);
    }
  }
  for (const id of Object.keys(baseline)) if (!current[id]) report.removed.push(id);
}
writeJson(path.join(root, 'reports', 'registry-diff.json'), report);
console.log(JSON.stringify(report, null, 2));
