#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { summarizeRegistry } from './lib/registry.mjs';

const root = process.cwd();
const summary = summarizeRegistry(root);
const badge = summary.gates.allTrustEnabled && summary.gates.allManifestsComplete ? 'PASS' : 'REVIEW';
const md = `# MiseOS Registry Dashboard\n\n**Status:** ${badge}  \n**Generated:** ${summary.generatedAt}\n\n## Bootloader\n\n\`registry → runtime → CLI → policy engine → release sentinel → analytics → autonomous updates\`\n\n## Key metrics\n\n| Metric | Value |\n|---|---:|\n| Manifests | ${summary.counts.manifests} |\n| Core artifacts | ${summary.counts.coreArtifacts} |\n| High risk | ${summary.counts.highRisk} |\n| Medium risk | ${summary.counts.mediumRisk} |\n| Low risk | ${summary.counts.lowRisk} |\n| High-risk ratio | ${summary.gates.highRiskRatio} |\n| All trust gates enabled | ${summary.gates.allTrustEnabled} |\n| All manifests complete | ${summary.gates.allManifestsComplete} |\n\n## Registry coverage\n\n| Registry lane | Artifacts |\n|---|---:|\n${Object.entries(summary.registries).sort().map(([name, count]) => `| ${name} | ${count} |`).join('\n')}\n\n## Risk matrix\n\n| Artifact | Type | Risk | Level |\n|---|---|---:|---|\n${summary.risks.sort((a,b) => b.score - a.score).map((risk) => `| ${risk.id} | ${risk.type} | ${risk.score} | ${risk.level} |`).join('\n')}\n\n## Permission hotspots\n\n| Permission | Count |\n|---|---:|\n${Object.entries(summary.permissions).sort((a,b) => b[1]-a[1]).map(([perm, count]) => `| ${perm} | ${count} |`).join('\n')}\n\n## Next actions\n\n1. Keep mutation-capable artifacts in approved-write mode.\n2. Publish GHCR runner first, then CLI and policy engine.\n3. Run \`pnpm verify\` before publishing any package.\n4. Require human review for permission, network, and major-version changes.\n`;
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs', 'registry-dashboard.md'), md);
console.log('✓ Dashboard written to docs/registry-dashboard.md');
