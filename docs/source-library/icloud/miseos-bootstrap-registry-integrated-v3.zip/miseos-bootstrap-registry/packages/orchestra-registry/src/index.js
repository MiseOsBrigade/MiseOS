#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../..');
const rolesPath = path.join(root, 'registry/orchestra/roles.json');
const roles = JSON.parse(fs.readFileSync(rolesPath, 'utf8'));

export function loadOrchestraRegistry() {
  return roles;
}

export function summarizeOrchestraRegistry(data = roles) {
  return {
    schemaVersion: data.schemaVersion,
    departments: data.departments.length,
    founders: data.founders.length,
    pipelineMasters: data.pipelineMasters.length,
    devopsMappings: data.devopsMetaphorMap.length,
    firstPublishOrder: data.registryBinding.firstPublishOrder
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = summarizeOrchestraRegistry();
  console.log(JSON.stringify(summary, null, 2));
}
