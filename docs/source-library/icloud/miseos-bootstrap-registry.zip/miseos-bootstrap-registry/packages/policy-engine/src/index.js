#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

export function scoreManifestRisk(manifest) {
  let score = 0;
  const reasons = [];

  const permissions = JSON.stringify(manifest.permissions ?? {});
  if (permissions.includes('write')) {
    score += 25;
    reasons.push('write permission requested');
  }
  if (manifest.agentContract?.requiresNetwork) {
    score += 15;
    reasons.push('network access required');
  }
  if (!manifest.agentContract?.safeToRunWithoutHuman) {
    score += 20;
    reasons.push('not safe for autonomous execution');
  }
  if (!manifest.trust?.provenanceRequired) {
    score += 25;
    reasons.push('provenance not required');
  }
  if (!manifest.trust?.signedReleaseRequired) {
    score += 15;
    reasons.push('signed release not required');
  }

  return {
    id: manifest.id,
    riskScore: Math.min(score, 100),
    level: score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low',
    reasons
  };
}

export function evaluateRegistry(registryRoot = process.cwd()) {
  const manifestsDir = path.join(registryRoot, 'registry', 'manifests');
  const reports = fs.readdirSync(manifestsDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(manifestsDir, file), 'utf8')))
    .map(scoreManifestRisk);

  return {
    generatedAt: new Date().toISOString(),
    reports,
    highRisk: reports.filter((report) => report.level === 'high').map((report) => report.id)
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = evaluateRegistry(process.cwd());
  console.log(JSON.stringify(report, null, 2));
  if (process.argv.includes('--enforced') && report.highRisk.length > 0) {
    process.exitCode = 1;
  }
}
