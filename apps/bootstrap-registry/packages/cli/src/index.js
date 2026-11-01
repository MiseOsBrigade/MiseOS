#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const args = process.argv.slice(2);
const cwd = process.cwd();
const scripts = {
  'doctor': 'doctor.mjs',
  'registry validate': 'validate-registry.mjs',
  'registry analyze': 'analyze-registry.mjs',
  'registry dashboard': 'generate-dashboard.mjs',
  'registry export': 'export-registry.mjs',
  'registry snapshot': 'create-snapshot.mjs',
  'registry diff': 'diff-registry.mjs',
  'scope check': 'scope-check.mjs'
};
const gitAreas = new Set(['repo', 'prep', 'sync', 'dispatch', 'hold', 'pick', 'undo', 'rewind', 'align', 'trace', 'release']);
function readJson(relativePath) { return JSON.parse(fs.readFileSync(path.join(cwd, relativePath), 'utf8')); }
function printHelp() {
  console.log(`MiseOS CLI

Registry:
  miseos doctor
  miseos registry validate
  miseos registry analyze
  miseos registry dashboard
  miseos registry export
  miseos registry snapshot
  miseos registry diff
  miseos scope check
  miseos package inspect <manifest-id>

Git command layer:
  miseos repo status
  miseos prep stage .
  miseos prep commit -m "message"
  miseos sync pull origin main
  miseos dispatch push origin main
  miseos hold stash "work in progress"
  miseos undo commit HEAD
  miseos trace log
`);
}
function run(script, extra=[]) {
  const result = spawnSync(process.execPath, [path.join(cwd, 'scripts', script), ...extra], { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}
const command = args.join(' ');
if (args.length === 0 || args.includes('--help') || args.includes('-h')) printHelp();
else if (gitAreas.has(args[0])) run('mise-git.mjs', args);
else if (scripts[command]) run(scripts[command]);
else if (args[0] === 'package' && args[1] === 'inspect' && args[2]) {
  const manifestPath = path.join('registry', 'manifests', `${args[2]}.json`);
  if (!fs.existsSync(path.join(cwd, manifestPath))) { console.error(`Manifest not found: ${manifestPath}`); process.exit(1); }
  console.log(JSON.stringify(readJson(manifestPath), null, 2));
} else if (command === 'registry inspect') {
  const registry = readJson('registry/index.json');
  console.log(JSON.stringify({ id: registry.id, version: registry.version, bootSequence: registry.bootSequence, coreArtifacts: registry.coreArtifacts, namespaces: registry.namespaces }, null, 2));
} else { console.error(`Unknown command: ${command}`); printHelp(); process.exit(1); }
