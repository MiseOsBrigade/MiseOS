import { existsSync, writeFileSync } from 'node:fs';
import { appendGithubOutput, appendStepSummary, readPolicy, runCommand, writeJson } from './mise-utils.mjs';

const policy = readPolicy();
const results = [];

function pushResult(result) {
  results.push({
    command: result.command,
    ok: result.ok,
    status: result.status,
    stdout: result.stdout.slice(-4000),
    stderr: result.stderr.slice(-4000)
  });
}

for (const command of policy.quality.generic.commands) {
  pushResult(runCommand(command));
}

if (existsSync('package.json')) {
  if (existsSync('package-lock.json')) {
    pushResult(runCommand(policy.quality.node.install));
  }
  for (const command of policy.quality.node.commands) {
    pushResult(runCommand(command));
  }
}

if (existsSync('pyproject.toml') || existsSync('requirements.txt') || existsSync('setup.py')) {
  for (const command of policy.quality.python.commands) {
    pushResult(runCommand(command));
  }
}

const ok = results.every((result) => result.ok);
const report = { gate: 'C2 quality-stack', ok, results };
writeJson('mise-quality-report.json', report);
appendGithubOutput({ quality_ok: ok ? 'true' : 'false' });

const rows = results.map((result) => `| \`${result.command}\` | ${result.ok ? 'pass' : 'fail'} | ${result.status} |`).join('\n') || '| none | pass | 0 |';
appendStepSummary(`## C2 Quality Stack\n\n| Command | Result | Exit |\n|---|---:|---:|\n${rows}\n`);
writeFileSync('mise-quality-log.md', results.map((r) => `### ${r.command}\n\nExit: ${r.status}\n\n#### stdout\n\n\`\`\`\n${r.stdout}\n\`\`\`\n\n#### stderr\n\n\`\`\`\n${r.stderr}\n\`\`\`\n`).join('\n'));
console.log(JSON.stringify(report, null, 2));

if (!ok) process.exit(1);
