#!/usr/bin/env node
import { summarizeRegistry, scoreManifest, loadManifests } from '../../../scripts/lib/registry.mjs';

export { scoreManifest as scoreManifestRisk };

export function evaluateRegistry(registryRoot = process.cwd()) {
  const summary = summarizeRegistry(registryRoot);
  return {
    generatedAt: summary.generatedAt,
    counts: summary.counts,
    gates: summary.gates,
    reports: summary.risks,
    highRisk: summary.risks.filter((report) => report.level === 'high').map((report) => report.id),
    permissionHotspots: Object.entries(summary.permissions).sort((a,b) => b[1]-a[1]).slice(0, 20)
  };
}

export function evaluateManifestById(id, registryRoot = process.cwd()) {
  const manifest = loadManifests(registryRoot).find((item) => item.id === id);
  if (!manifest) throw new Error(`Manifest not found: ${id}`);
  return scoreManifest(manifest);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = evaluateRegistry(process.cwd());
  console.log(JSON.stringify(report, null, 2));
  if (process.argv.includes('--enforced') && report.highRisk.length > 0) process.exitCode = 1;
}
