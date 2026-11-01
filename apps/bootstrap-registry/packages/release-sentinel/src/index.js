#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { loadManifests, scoreManifest, writeJson } from '../../../scripts/lib/registry.mjs';

const dryRun = process.argv.includes('--dry-run');
const root = process.cwd();
const outDir = path.join(root, '.miseos', 'sentinel');
fs.mkdirSync(outDir, { recursive: true });

function classify(manifest) {
  const risk = scoreManifest(manifest);
  const artifacts = Object.keys(manifest.artifacts ?? {});
  const mutating = risk.permissions.some((permission) => permission.includes('write'));
  return {
    id: manifest.id,
    version: manifest.version,
    status: manifest.status,
    artifacts,
    riskScore: risk.score,
    riskLevel: risk.level,
    requiresNetwork: manifest.agentContract?.requiresNetwork ?? false,
    safeToRunWithoutHuman: manifest.agentContract?.safeToRunWithoutHuman ?? false,
    recommendedAction: risk.level === 'high' || mutating ? 'open_review_pr' : 'monitor',
    updatePolicy: manifest.changePolicy
  };
}

const entries = loadManifests(root).map(classify).sort((a,b) => b.riskScore - a.riskScore);
const report = {
  generatedAt: new Date().toISOString(),
  mode: dryRun ? 'dry_run' : 'plan_only',
  summary: 'Release Sentinel does not silently upgrade packages. It creates risk-ranked update plans and requires review for permission, network, security, or major version changes.',
  entries,
  prPlan: entries.filter((entry) => entry.recommendedAction === 'open_review_pr').map((entry) => ({
    title: `chore(registry): review ${entry.id} update surface`,
    labels: ['miseos', 'registry-drift', entry.riskLevel],
    body: `Review ${entry.id}. Risk=${entry.riskScore}. Check permissions, trust metadata, SBOM, provenance, and release notes before merge.`
  }))
};
writeJson(path.join(outDir, 'release-sentinel-report.json'), report);
console.log(JSON.stringify(report, null, 2));
console.error(`Report written to ${path.join(outDir, 'release-sentinel-report.json')}`);
