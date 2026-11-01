#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { loadManifests, summarizeRegistry, writeJson } from './lib/registry.mjs';

const root = process.cwd();
const manifests = loadManifests(root);
const summary = summarizeRegistry(root);
const orchestra = JSON.parse(fs.readFileSync(path.join(root, 'registry/orchestra/roles.json'), 'utf8'));
const report = {
  generatedAt: new Date().toISOString(),
  repository: 'miseos-bootstrap-registry',
  version: JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version,
  manifestCount: manifests.length,
  scope: '@mise-os',
  containerNamespace: 'ghcr.io/mise-os',
  firstPublishSequence: orchestra.registryBinding.firstPublishOrder,
  integratedCapabilities: {
    orchestraDepartments: orchestra.departments.length,
    founders: orchestra.founders.length,
    pipelineMasters: orchestra.pipelineMasters.length,
    devopsMappings: orchestra.devopsMetaphorMap.length,
    highRiskManifests: summary.counts.highRisk,
    mediumRiskManifests: summary.counts.mediumRisk,
    lowRiskManifests: summary.counts.lowRisk
  },
  nextActions: [
    'Push repository to GitHub as Mise-OS/miseos-bootstrap-registry.',
    'Enable branch protection and required status checks.',
    'Run validate-registry, scorecard, and publish-container workflow in dry-run/manual mode.',
    'Publish ghcr.io/mise-os/miseos-runner first.',
    'Publish @mise-os/cli, @mise-os/policy-engine, and @mise-os/release-sentinel after runner is proven.'
  ]
};
writeJson(path.join(root, 'reports/integration-report.json'), report);
const md = `# MiseOS Bootstrap Registry Integration Report\n\nGenerated: ${report.generatedAt}\n\n## Summary\n\n- Repository: ${report.repository}\n- Version: ${report.version}\n- Manifests: ${report.manifestCount}\n- npm scope: ${report.scope}\n- Container namespace: ${report.containerNamespace}\n- Orchestra departments: ${report.integratedCapabilities.orchestraDepartments}\n- Founders captured: ${report.integratedCapabilities.founders}\n- Pipeline masters captured: ${report.integratedCapabilities.pipelineMasters}\n- DevOps metaphor mappings: ${report.integratedCapabilities.devopsMappings}\n\n## First publish sequence\n\n${report.firstPublishSequence.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}\n\n## Next actions\n\n${report.nextActions.map((item) => `- ${item}`).join('\n')}\n`;
fs.writeFileSync(path.join(root, 'reports/integration-report.md'), md);
console.log(`✓ Integration report generated: ${report.manifestCount} manifests`);
console.log(`✓ First external artifact: ${report.firstPublishSequence[0]}`);
