#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const command = args.join(' ');
const cwd = process.cwd();

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(cwd, relativePath), 'utf8'));
}

function printHelp() {
  console.log(`MiseOS CLI

Usage:
  miseos doctor
  miseos registry validate
  miseos registry inspect
  miseos package inspect <manifest-id>
`);
}

function runNodeScript(script) {
  const result = spawnSync(process.execPath, [script], { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printHelp();
} else if (command === 'doctor') {
  runNodeScript(path.join(cwd, 'scripts', 'doctor.mjs'));
} else if (command === 'registry validate') {
  runNodeScript(path.join(cwd, 'scripts', 'validate-registry.mjs'));
} else if (command === 'registry inspect') {
  const registry = readJson('registry/index.json');
  console.log(JSON.stringify({
    id: registry.id,
    version: registry.version,
    bootSequence: registry.bootSequence,
    coreArtifacts: registry.coreArtifacts
  }, null, 2));
} else if (args[0] === 'package' && args[1] === 'inspect' && args[2]) {
  const manifestPath = path.join('registry', 'manifests', `${args[2]}.json`);
  if (!fs.existsSync(path.join(cwd, manifestPath))) {
    console.error(`Manifest not found: ${manifestPath}`);
    process.exit(1);
  }
  console.log(JSON.stringify(readJson(manifestPath), null, 2));
} else {
  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}
