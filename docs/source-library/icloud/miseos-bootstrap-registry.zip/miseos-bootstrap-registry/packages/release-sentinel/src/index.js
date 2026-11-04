#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const dryRun = process.argv.includes('--dry-run');
const root = process.cwd();
const manifestsDir = path.join(root, 'registry', 'manifests');
const outDir = path.join(root, '.miseos', 'sentinel');
fs.mkdirSync(outDir, { recursive: true });

function loadManifests() {
  return fs.readdirSync(manifestsDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(manifestsDir, file), 'utf8')));
}

function classify(manifest) {
  const artifacts = Object.keys(manifest.artifacts ?? {});
  return {
    id: manifest.id,
    version: manifest.version,
    status: manifest.status,
    artifacts,
    requiresNetwork: manifest.agentContract?.requiresNetwork ?? false,
    safeToRunWithoutHuman: manifest.agentContract?.safeToRunWithoutHuman ?? false,
    action: artifacts.length === 0 ? 'block_missing_artifact' : 'monitor'
  };
}

const report = {
  generatedAt: new Date().toISOString(),
  mode: dryRun ? 'dry_run' : 'plan_only',
  summary: 'Release Sentinel baseline report. External registry lookup is intentionally disabled in starter mode.',
  entries: loadManifests().map(classify)
};

const reportPath = path.join(outDir, 'release-sentinel-report.json');
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
console.error(`Report written to ${reportPath}`);
