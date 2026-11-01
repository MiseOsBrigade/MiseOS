const fs = require('node:fs');

function input(name, fallback = '') {
  return (process.env[`INPUT_${name.toUpperCase().replaceAll('-', '_')}`] ?? fallback).trim();
}
function output(name, value) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT || '/dev/stdout', `${name}=${value}\n`);
}

const version = input('version').replace(/^v/, '');
const changelog = input('changelog', 'CHANGELOG.md');
const license = input('license', 'LICENSE');
const failOnError = input('fail-on-error', 'true').toLowerCase() === 'true';
const errors = [];
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) errors.push('Version is not valid semantic versioning');
if (!fs.existsSync(changelog) || fs.statSync(changelog).size === 0) errors.push(`Missing or empty changelog: ${changelog}`);
if (!fs.existsSync(license) || fs.statSync(license).size === 0) errors.push(`Missing or empty license: ${license}`);
const ready = errors.length === 0;
output('release-ready', String(ready));
output('errors', errors.join(' | '));
if (ready) process.stdout.write(`MiseOS Release Sentinel: ${version} is release-ready.\n`);
else {
  for (const error of errors) process.stderr.write(`::error::${error}\n`);
  if (failOnError) process.exitCode = 1;
}
