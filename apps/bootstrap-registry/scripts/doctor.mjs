#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
function check(name, command) {
  try { const output = execSync(command, { stdio: ['ignore','pipe','pipe'] }).toString().trim(); console.log(`✓ ${name}: ${output || 'ok'}`); }
  catch { console.log(`! ${name}: not available`); }
}
console.log('MiseOS Bootstrap Registry Doctor');
check('node', 'node --version');
check('pnpm', 'pnpm --version');
check('git', 'git --version');
check('docker', 'docker --version');
for (const file of ['registry/index.json','schemas/mise.registry.schema.json','scripts/analyze-registry.mjs','scripts/scope-check.mjs','.github/workflows/validate-registry.yml']) {
  console.log(fs.existsSync(file) ? `✓ ${file} found` : `✖ ${file} missing`);
}
