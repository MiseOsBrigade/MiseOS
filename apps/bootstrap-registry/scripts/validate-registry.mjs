#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { loadRegistry, loadManifests, flattenPermissions } from './lib/registry.mjs';

const root = process.cwd();
const requiredManifestFields = ['schemaVersion','id','name','type','version','status','owner','description','artifacts','capabilities','permissions','trust','changePolicy','agentContract','analytics','release','answers'];
const requiredTrustFields = ['licenseRequired','sbomRequired','provenanceRequired','signedReleaseRequired','artifactAttestationRequired','scorecardRequired','humanReviewRequiredFor'];
const errors = [];
const warnings = [];
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const assert = (condition, message) => { if (!condition) fail(message); };

const registry = loadRegistry(root);
assert(registry.id === 'miseos.bootstrap-registry', 'registry/index.json must use id miseos.bootstrap-registry');
assert(Array.isArray(registry.coreArtifacts), 'registry/index.json must include coreArtifacts array');
assert(registry.namespaces?.npm, 'registry/index.json must include namespaces.npm');
assert(registry.namespaces?.container?.startsWith('ghcr.io/'), 'container namespace must use ghcr.io');

const manifests = loadManifests(root);
assert(manifests.length > 0, 'registry/manifests must contain at least one manifest');
const seen = new Set();
for (const manifest of manifests) {
  const file = `${manifest.id ?? 'unknown'}.json`;
  for (const field of requiredManifestFields) assert(Object.prototype.hasOwnProperty.call(manifest, field), `${file} missing required field: ${field}`);
  assert(/^miseos\.[a-z0-9][a-z0-9.-]*$/.test(manifest.id), `${file} has invalid id: ${manifest.id}`);
  assert(!seen.has(manifest.id), `duplicate manifest id: ${manifest.id}`);
  seen.add(manifest.id);
  assert(/^\d+\.\d+\.\d+(-[A-Za-z0-9.-]+)?$/.test(manifest.version), `${manifest.id} has invalid semver version`);
  assert(Array.isArray(manifest.capabilities) && manifest.capabilities.length > 0, `${manifest.id} must declare capabilities`);
  assert(Object.keys(manifest.artifacts ?? {}).length > 0, `${manifest.id} must declare at least one artifact`);
  assert(typeof manifest.agentContract?.safeToRunWithoutHuman === 'boolean', `${manifest.id} must declare autonomous safety`);
  assert(typeof manifest.agentContract?.requiresNetwork === 'boolean', `${manifest.id} must declare network requirement`);
  assert(['read_only','advisory_write','approved_write','autonomous_write'].includes(manifest.agentContract?.executionMode), `${manifest.id} must declare valid executionMode`);
  for (const field of requiredTrustFields) assert(Object.prototype.hasOwnProperty.call(manifest.trust ?? {}, field), `${manifest.id} missing trust.${field}`);
  assert(Array.isArray(manifest.trust?.humanReviewRequiredFor), `${manifest.id} must declare human review gates`);
  assert(typeof manifest.analytics?.riskWeight === 'number', `${manifest.id} must declare analytics.riskWeight`);
  for (const question of ['what','does','owner','permissions','registry','changed','safe','agentExecutable']) assert(typeof manifest.answers?.[question] === 'string' && manifest.answers[question].length > 0, `${manifest.id} missing answer: ${question}`);

  const perms = flattenPermissions(manifest.permissions);
  if (perms.some((perm) => perm.includes('write')) && manifest.agentContract?.executionMode === 'read_only') {
    warn(`${manifest.id} requests write permission but declares read_only executionMode`);
  }
  if (manifest.agentContract?.safeToRunWithoutHuman && manifest.agentContract?.executionMode?.includes('write')) {
    warn(`${manifest.id} is autonomous-safe while using write mode; review this carefully`);
  }
}
for (const id of registry.coreArtifacts ?? []) assert(seen.has(id), `coreArtifacts references missing manifest: ${id}`);

const mdir = path.join(root, 'registry', 'manifests');
for (const file of fs.readdirSync(mdir).filter((item) => item.endsWith('.json'))) {
  const id = file.replace(/\.json$/, '');
  assert(seen.has(id), `manifest filename does not match id: ${file}`);
}

for (const warning of warnings) console.warn(`! ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`✖ ${error}`);
  console.error('\nRegistry validation failed. Treat missing metadata as unsafe.');
  process.exit(1);
}
console.log(`✓ MiseOS registry validated: ${manifests.length} manifests checked`);
console.log(`✓ Scope policy: ${registry.namespaces.npm} / ${registry.namespaces.container}`);
