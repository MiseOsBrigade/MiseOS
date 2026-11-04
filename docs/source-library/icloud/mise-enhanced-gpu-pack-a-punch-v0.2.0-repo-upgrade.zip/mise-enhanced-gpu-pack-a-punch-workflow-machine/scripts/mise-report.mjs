import { existsSync, readFileSync, writeFileSync } from 'node:fs';

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf8'));
}

const context = readJson('mise-measurement-context.json', {});
const risk = readJson('mise-risk-report.json', {});
const quality = readJson('mise-quality-report.json', {});
const supply = readJson('mise-supply-chain-report.json', {});
const branch = readJson('mise-branch-advisor-report.json', {});
const graph = readJson('mise-stack-graph.json', {});

const marker = '<!-- mise-pack-a-punch-report -->';
const riskPass = risk.level === 'pass';
const qualityPass = quality.ok !== false;
const supplyPass = supply.ok !== false;
const finalState = riskPass && qualityPass && supplyPass ? 'PASS' : risk.level === 'blocked' ? 'BLOCKED' : 'REVIEW';

const md = `${marker}
# Mise Pack-a-Punch Workflow Machine Report

**Final state:** ${finalState}

| Gate | Signal |
|---|---:|
| A0 measurement files | ${context.measurement?.changedFileCount ?? 'n/a'} |
| B1 risk level | ${risk.level ?? 'n/a'} |
| B1 risk score | ${risk.score ?? 'n/a'}/100 |
| C2 quality | ${qualityPass ? 'pass' : 'fail'} |
| D3 supply chain | ${supplyPass ? 'pass' : 'review'} |
| E4 recommended branch | ${branch.top?.branch ? `\`${branch.top.branch}\`` : 'none'} |

## Stack Map

${graph.mermaid || ''}

## Branch Advice

${branch.top ? `Next safe review candidate: \`${branch.top.branch}\` with fitness score **${branch.top.score}/100**. This does not auto-merge.` : 'No branch recommendation available.'}

## Risk Blocks

${risk.blocks?.length ? risk.blocks.map((b) => `- ${b}`).join('\n') : '- None'}

## Operating Rule

This workflow enhances repository quality by measuring, gating, testing, auditing, and reporting. It does not auto-commit, auto-merge, bypass protection, or run privileged fork code.
`;

writeFileSync('mise-pack-a-punch-report.md', md);
console.log(md);
