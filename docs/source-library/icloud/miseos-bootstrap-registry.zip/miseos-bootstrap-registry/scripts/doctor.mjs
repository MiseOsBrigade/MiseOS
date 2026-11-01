#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';

function check(name, command) {
  try {
    const output = execSync(command, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
    console.log(`✓ ${name}: ${output || 'ok'}`);
  } catch {
    console.log(`! ${name}: not available`);
  }
}

console.log('MiseOS Bootstrap Registry Doctor');
check('node', 'node --version');
check('pnpm', 'pnpm --version');
check('git', 'git --version');
check('docker', 'docker --version');
console.log(fs.existsSync('registry/index.json') ? '✓ registry/index.json found' : '✖ registry/index.json missing');
console.log(fs.existsSync('schemas/mise.registry.schema.json') ? '✓ registry schema found' : '✖ registry schema missing');
