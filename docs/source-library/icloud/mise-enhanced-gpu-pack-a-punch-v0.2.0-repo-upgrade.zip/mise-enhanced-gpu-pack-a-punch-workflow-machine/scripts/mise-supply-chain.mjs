import { existsSync } from 'node:fs';
import { appendGithubOutput, appendStepSummary, runCommand, writeJson } from './mise-utils.mjs';

const results = [];
if (existsSync('package-lock.json')) {
  results.push(runCommand('npm audit --audit-level=high --omit=dev --json'));
} else if (existsSync('package.json')) {
  results.push({ command: 'npm audit', ok: true, status: 0, stdout: 'Skipped: package-lock.json not present.', stderr: '' });
}

if (existsSync('requirements.txt') || existsSync('pyproject.toml')) {
  results.push({ command: 'python dependency audit', ok: true, status: 0, stdout: 'Skipped by default: install pip-audit in your project if you want blocking Python dependency audit.', stderr: '' });
}

const critical = results.some((r) => !r.ok && /critical/i.test(`${r.stdout}\n${r.stderr}`));
const report = { gate: 'D3 supply-chain-scan', ok: !critical, critical, results };
writeJson('mise-supply-chain-report.json', report);
appendGithubOutput({ supply_chain_ok: critical ? 'false' : 'true' });
appendStepSummary(`## D3 Supply Chain Scan\n\n- Critical dependency signal: **${critical ? 'yes' : 'no'}**\n- Commands: ${results.length || 0}\n`);
console.log(JSON.stringify(report, null, 2));
if (critical) process.exit(1);
