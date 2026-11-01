#!/usr/bin/env node
import path from 'node:path';
import { loadManifests, summarizeRegistry, writeJson, toCsv } from './lib/registry.mjs';

const root = process.cwd();
const summary = summarizeRegistry(root);
const manifests = loadManifests(root);

writeJson(path.join(root, 'reports', 'registry-analytics.json'), summary);
writeJson(path.join(root, 'analytics', 'registry-metrics.json'), summary);
writeJson(path.join(root, 'analytics', 'capability-map.json'), Object.fromEntries(Object.entries(summary.capabilities).sort()));

const riskRows = summary.risks.map((risk) => ({
  id: risk.id,
  name: risk.name,
  type: risk.type,
  risk_score: risk.score,
  risk_level: risk.level,
  permissions: risk.permissions.join('; '),
  reasons: risk.reasons.join('; ')
}));
await import('node:fs').then(({ default: fs }) => {
  fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
  fs.mkdirSync(path.join(root, 'analytics'), { recursive: true });
  fs.writeFileSync(path.join(root, 'reports', 'registry-risk-matrix.csv'), toCsv(riskRows));
  fs.writeFileSync(path.join(root, 'analytics', 'risk-matrix.csv'), toCsv(riskRows));
});

const manifestRows = manifests.map((manifest) => ({
  id: manifest.id,
  name: manifest.name,
  type: manifest.type,
  status: manifest.status,
  version: manifest.version,
  tier: manifest.analytics.operationalTier,
  criticality: manifest.analytics.criticality,
  maturity: manifest.analytics.maturity,
  artifact_registries: Object.keys(manifest.artifacts).join('; '),
  capabilities: manifest.capabilities.length,
  safe_to_run_without_human: manifest.agentContract.safeToRunWithoutHuman,
  requires_network: manifest.agentContract.requiresNetwork,
  execution_mode: manifest.agentContract.executionMode
}));
await import('node:fs').then(({ default: fs }) => fs.writeFileSync(path.join(root, 'reports', 'registry-catalog.csv'), toCsv(manifestRows)));

const mermaid = [
  'flowchart LR',
  '  registry[MiseOS Bootstrap Registry]',
  ...manifests.map((manifest) => `  registry --> ${manifest.id.replaceAll('.', '_')}[${manifest.name.replace(/[\[\]]/g, '')}]`),
  ...manifests.flatMap((manifest) => Object.keys(manifest.artifacts).map((artifact) => `  ${manifest.id.replaceAll('.', '_')} -. ${artifact} .-> ${artifact}_${manifest.id.replaceAll('.', '_')}[${artifact}]`))
].join('\n') + '\n';
await import('node:fs').then(({ default: fs }) => fs.writeFileSync(path.join(root, 'analytics', 'package-graph.mmd'), mermaid));

const md = `# MiseOS Registry Analytics\n\nGenerated: ${summary.generatedAt}\n\n## Summary\n\n- Manifests: ${summary.counts.manifests}\n- High risk: ${summary.counts.highRisk}\n- Medium risk: ${summary.counts.mediumRisk}\n- Low risk: ${summary.counts.lowRisk}\n- High-risk ratio: ${summary.gates.highRiskRatio}\n- All manifests complete: ${summary.gates.allManifestsComplete}\n- All trust gates enabled: ${summary.gates.allTrustEnabled}\n\n## Artifacts by registry\n\n${Object.entries(summary.registries).map(([k,v]) => `- ${k}: ${v}`).join('\n')}\n\n## Risk matrix\n\n| Artifact | Type | Score | Level | Reasons |\n|---|---:|---:|---|---|\n${summary.risks.map((risk) => `| ${risk.id} | ${risk.type} | ${risk.score} | ${risk.level} | ${risk.reasons.join('; ') || 'baseline'} |`).join('\n')}\n\n## Operational tiers\n\n${Object.entries(summary.byTier).map(([k,v]) => `- ${k}: ${v}`).join('\n')}\n`;
await import('node:fs').then(({ default: fs }) => fs.writeFileSync(path.join(root, 'reports', 'registry-analytics.md'), md));
console.log(`✓ Analytics generated for ${summary.counts.manifests} manifests`);
console.log(`✓ Reports written to reports/ and analytics/`);
