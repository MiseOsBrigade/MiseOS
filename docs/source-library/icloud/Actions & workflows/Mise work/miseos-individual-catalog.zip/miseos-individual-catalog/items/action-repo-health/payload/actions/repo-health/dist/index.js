const fs = require('node:fs');

function input(name, fallback = '') {
  return (process.env[`INPUT_${name.toUpperCase().replaceAll('-', '_')}`] ?? fallback).trim();
}
function output(name, value) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT || '/dev/stdout', `${name}=${value}\n`);
}
function fail(message) {
  process.stderr.write(`::error::${message}\n`);
  process.exitCode = 1;
}

const expected = input('expected-files', 'README.md,LICENSE,SECURITY.md,CONTRIBUTING.md,.gitignore')
  .split(',').map((x) => x.trim()).filter(Boolean);
const threshold = Math.max(0, Math.min(100, Number(input('fail-below', '0')) || 0));
const checks = expected.map((file) => ({ file, present: fs.existsSync(file) }));
const present = checks.filter((x) => x.present).length;
const score = expected.length ? Math.round((present / expected.length) * 100) : 100;
const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
const missing = checks.filter((x) => !x.present).map((x) => x.file);

output('score', score);
output('grade', grade);
output('missing-files', missing.join(','));
process.stdout.write(`MiseOS repository health: ${score}/100 (${grade})\n`);
for (const check of checks) process.stdout.write(`${check.present ? 'PASS' : 'MISS'} ${check.file}\n`);
if (score < threshold) fail(`Repository health score ${score} is below required threshold ${threshold}.`);
