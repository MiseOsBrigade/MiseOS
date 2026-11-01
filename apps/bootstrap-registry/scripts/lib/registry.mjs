import fs from 'node:fs';
import path from 'node:path';

export function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON at ${filePath}: ${error.message}`);
  }
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function listManifestFiles(root = process.cwd()) {
  const manifestsDir = path.join(root, 'registry', 'manifests');
  return fs.readdirSync(manifestsDir)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => path.join(manifestsDir, file));
}

export function loadManifests(root = process.cwd()) {
  return listManifestFiles(root).map((filePath) => readJson(filePath));
}

export function loadRegistry(root = process.cwd()) {
  return readJson(path.join(root, 'registry', 'index.json'));
}

export function flattenPermissions(permissions = {}) {
  const out = [];
  for (const [surface, grants] of Object.entries(permissions)) {
    if (typeof grants === 'object' && grants !== null) {
      for (const [name, level] of Object.entries(grants)) out.push(`${surface}.${name}:${level}`);
    } else {
      out.push(`${surface}:${grants}`);
    }
  }
  return out.sort();
}

export function scoreManifest(manifest) {
  const reasons = [];
  let score = Math.round((manifest.analytics?.riskWeight ?? 0.3) * 30);
  const perms = flattenPermissions(manifest.permissions);
  const joined = perms.join(' ');
  const add = (points, reason) => { score += points; reasons.push(reason); };

  if (joined.includes('write')) add(18, 'write permission requested');
  if (joined.includes('id-token:write')) add(12, 'OIDC token minting allowed');
  if (joined.includes('attestations:write')) add(10, 'artifact attestation writes allowed');
  if (joined.includes('pages:write')) add(8, 'GitHub Pages write access');
  if (joined.includes('security-events:write')) add(8, 'security events write access');
  if (manifest.agentContract?.requiresNetwork) add(12, 'network access required');
  if (!manifest.agentContract?.safeToRunWithoutHuman) add(15, 'not autonomous-safe');
  if (manifest.agentContract?.executionMode === 'approved_write') add(10, 'approved write execution mode');
  if (manifest.agentContract?.executionMode === 'autonomous_write') add(25, 'autonomous write execution mode');
  if (!manifest.trust?.provenanceRequired) add(18, 'provenance not required');
  if (!manifest.trust?.artifactAttestationRequired) add(16, 'artifact attestation not required');
  if (!manifest.trust?.scorecardRequired) add(8, 'Scorecard not required');
  if ((manifest.capabilities ?? []).some((cap) => /pull_request|publish|open_|write|pages/.test(cap))) add(8, 'mutating capability present');

  const normalized = Math.min(100, score);
  const level = normalized >= 60 ? 'high' : normalized >= 30 ? 'medium' : 'low';
  return { id: manifest.id, name: manifest.name, type: manifest.type, score: normalized, level, reasons, permissions: perms };
}

export function completenessScore(manifest) {
  const required = ['schemaVersion','id','name','type','version','status','owner','description','artifacts','capabilities','permissions','trust','changePolicy','agentContract','analytics','release','answers'];
  const present = required.filter((key) => Object.prototype.hasOwnProperty.call(manifest, key)).length;
  return Number((present / required.length).toFixed(3));
}

export function summarizeRegistry(root = process.cwd()) {
  const registry = loadRegistry(root);
  const manifests = loadManifests(root);
  const risks = manifests.map(scoreManifest);
  const byType = {};
  const byTier = {};
  const byCriticality = {};
  const permissions = {};
  const capabilities = {};
  const registries = {};

  for (const manifest of manifests) {
    byType[manifest.type] = (byType[manifest.type] ?? 0) + 1;
    byTier[manifest.analytics?.operationalTier ?? 'unknown'] = (byTier[manifest.analytics?.operationalTier ?? 'unknown'] ?? 0) + 1;
    byCriticality[manifest.analytics?.criticality ?? 'unknown'] = (byCriticality[manifest.analytics?.criticality ?? 'unknown'] ?? 0) + 1;
    for (const item of flattenPermissions(manifest.permissions)) permissions[item] = (permissions[item] ?? 0) + 1;
    for (const cap of manifest.capabilities ?? []) capabilities[cap] = (capabilities[cap] ?? 0) + 1;
    for (const key of Object.keys(manifest.artifacts ?? {})) registries[key] = (registries[key] ?? 0) + 1;
  }

  const trustCompliance = manifests.map((manifest) => {
    const keys = ['licenseRequired','sbomRequired','provenanceRequired','signedReleaseRequired','artifactAttestationRequired','scorecardRequired'];
    const passed = keys.filter((key) => manifest.trust?.[key] === true).length;
    return { id: manifest.id, passed, total: keys.length, ratio: Number((passed / keys.length).toFixed(3)) };
  });

  return {
    generatedAt: new Date().toISOString(),
    registry: { id: registry.id, version: registry.version, name: registry.name },
    counts: {
      manifests: manifests.length,
      coreArtifacts: registry.coreArtifacts?.length ?? 0,
      highRisk: risks.filter((risk) => risk.level === 'high').length,
      mediumRisk: risks.filter((risk) => risk.level === 'medium').length,
      lowRisk: risks.filter((risk) => risk.level === 'low').length
    },
    byType,
    byTier,
    byCriticality,
    registries,
    permissions,
    capabilities,
    risks,
    completeness: manifests.map((manifest) => ({ id: manifest.id, score: completenessScore(manifest) })),
    trustCompliance,
    gates: {
      allManifestsComplete: manifests.every((manifest) => completenessScore(manifest) >= 0.95),
      allTrustEnabled: trustCompliance.every((row) => row.ratio === 1),
      highRiskRatio: Number((risks.filter((risk) => risk.level === 'high').length / Math.max(1, risks.length)).toFixed(3))
    }
  };
}

export function toCsv(rows) {
  if (rows.length === 0) return '';
  const keys = Object.keys(rows[0]);
  const escape = (value) => {
    const text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return [keys.join(','), ...rows.map((row) => keys.map((key) => escape(row[key])).join(','))].join('\n') + '\n';
}
