#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const registryPath = path.join(root, 'registry', 'index.json');
const manifestsDir = path.join(root, 'registry', 'manifests');
const requiredManifestFields = [
  'schemaVersion',
  'id',
  'name',
  'type',
  'version',
  'status',
  'owner',
  'description',
  'artifacts',
  'capabilities',
  'permissions',
  'trust',
  'changePolicy',
  'agentContract'
];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON at ${filePath}: ${error.message}`);
  }
}

function fail(message) {
  console.error(`✖ ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const registry = readJson(registryPath);
assert(registry.id === 'miseos.bootstrap-registry', 'registry/index.json must use id miseos.bootstrap-registry');
assert(Array.isArray(registry.coreArtifacts), 'registry/index.json must include coreArtifacts array');

const seen = new Set();
const files = fs.readdirSync(manifestsDir).filter((file) => file.endsWith('.json')).sort();
assert(files.length > 0, 'registry/manifests must contain at least one manifest');

for (const file of files) {
  const manifestPath = path.join(manifestsDir, file);
  const manifest = readJson(manifestPath);

  for (const field of requiredManifestFields) {
    assert(Object.prototype.hasOwnProperty.call(manifest, field), `${file} missing required field: ${field}`);
  }

  assert(/^miseos\.[a-z0-9][a-z0-9.-]*$/.test(manifest.id), `${file} has invalid id: ${manifest.id}`);
  assert(!seen.has(manifest.id), `duplicate manifest id: ${manifest.id}`);
  seen.add(manifest.id);

  assert(/^\d+\.\d+\.\d+(-[A-Za-z0-9.-]+)?$/.test(manifest.version), `${manifest.id} has invalid semver version`);
  assert(Array.isArray(manifest.capabilities) && manifest.capabilities.length > 0, `${manifest.id} must declare capabilities`);
  assert(Object.keys(manifest.artifacts).length > 0, `${manifest.id} must declare at least one artifact`);
  assert(typeof manifest.agentContract.safeToRunWithoutHuman === 'boolean', `${manifest.id} must declare autonomous safety`);
  assert(typeof manifest.agentContract.requiresNetwork === 'boolean', `${manifest.id} must declare network requirement`);
  assert(Array.isArray(manifest.trust.humanReviewRequiredFor), `${manifest.id} must declare human review gates`);
}

for (const id of registry.coreArtifacts) {
  assert(seen.has(id), `coreArtifacts references missing manifest: ${id}`);
}

if (process.exitCode) {
  console.error('\nRegistry validation failed. Treat missing metadata as unsafe.');
  process.exit(process.exitCode);
}

console.log(`✓ MiseOS registry validated: ${files.length} manifests checked`);
