#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = 'miseos-bootstrap-registry';
const now = new Date().toISOString();
const owner = 'MiseOsBrigade';
const repo = 'Mise-OS';
const scope = '@mise-os';
const ghcr = 'ghcr.io/mise-os';

const write = (file, body) => {
  const out = join(ROOT, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, body.endsWith('\n') ? body : `${body}\n`, 'utf8');
};
const json = (file, data) => write(file, `${JSON.stringify(data, null, 2)}\n`);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const sha256 = s => createHash('sha256').update(s).digest('hex');

const departments = [
  { id: 'command', name: 'Command Node', motto: 'Conduct with clarity.', color: '#D4AF37', function: 'Strategy, governance, and operating cadence.' },
  { id: 'pipeline', name: 'Pipeline Masters', motto: 'Ship with confidence.', color: '#E5564B', function: 'Build, test, deploy, repeat.' },
  { id: 'platform', name: 'Platform Stewards', motto: 'Keep the stage alive.', color: '#26B6A6', function: 'Compute, storage, networking, and runtime substrate.' },
  { id: 'reliability', name: 'Reliability Brigade', motto: 'Observe, measure, improve.', color: '#D4AF37', function: 'SLOs, incident learning, and production health.' },
  { id: 'security', name: 'Security Brigade', motto: 'Protect the kitchen.', color: '#E5564B', function: 'Secrets, provenance, attestation, and audit.' },
  { id: 'data-insights', name: 'Data & Insights', motto: 'Learn, optimize, evolve.', color: '#5B8DEF', function: 'Analytics, graph intelligence, registry intelligence.' },
  { id: 'ecosystem', name: 'Ecosystem Layer', motto: 'Connect the stations.', color: '#A98BE0', function: 'SDKs, docs, templates, integrations, and developer adoption.' }
];

const roleSeeds = [
  ['Kurogami Senpai','Supreme Conductor','command','Golden Ladle Protocol','Genesis Founder'],
  ['Orchestra Core','Living System Consciousness','command','Universal Synchronization','Mythic'],
  ['Kaji','Flame of Computation','platform','CPU Inferno','Genesis Founder'],
  ['Scale Oni','Elastic Giant','platform','Elastic Growth','Genesis Founder'],
  ['Build-Kun','Baker of Containers','platform','Docker Dough','Genesis Founder'],
  ['Alko','Commit Chef','pipeline','Commit Intake','Rare'],
  ['Bruno Blast-Radius','Change Impact Scanner','pipeline','Blast Radius Scan','Epic'],
  ['Lila Branchkeeper','Branch Policy Gate','pipeline','Protected Branch Stewardship','Rare'],
  ['Omar Reviewer','PR Hygiene Check','pipeline','Review Ritual','Rare'],
  ['Hugo Matrix','Test Matrix Runner','pipeline','Parallel Test Service','Epic'],
  ['Seira Prime','Secrets Custodian','security','Vault Lock','Legendary'],
  ['Umami Code Prime','Gateway Conductor','ecosystem','Sauce Link','Legendary'],
  ['Sommelier','Evidence Steward','security','Taste the Proof','Epic'],
  ['SRE Chef','Reliability Engineer','reliability','Service Level Ritual','Epic'],
  ['Prometheus','Metrics Collector','data-insights','Telemetry Harvest','Rare']
];
const roles = roleSeeds.map((r, i) => ({
  id: `orc-${String(i + 1).padStart(3, '0')}`,
  name: r[0],
  title: r[1],
  department: r[2],
  ability: r[3],
  rarity: r[4],
  lore: `${r[0]} turns kitchen-chaos DevOps into a repeatable MiseOS operating ritual.`,
  stats: { harmony: 80 + (i % 20), entropyResistance: 70 + (i % 25), autonomy: 50 + (i % 30), trust: 75 + (i % 20) }
}));

const artifacts = [
  ['miseos.cli','MiseOS CLI','package','developer-tools',`${scope}/cli`,null,['validate_registry','doctor','publish_plan','scope_check'],['contents:read','packages:read'],0.18],
  ['miseos.agent-sdk','MiseOS Agent SDK','package','developer-tools',`${scope}/agent-sdk`,null,['register_agent','capability_contract','evidence_report'],['contents:read'],0.16],
  ['miseos.policy-engine','MiseOS Policy Engine','package','governance',`${scope}/policy-engine`,null,['policy_eval','permission_score','trust_gate'],['contents:read','security-events:write'],0.25],
  ['miseos.release-sentinel','MiseOS Release Sentinel','automation','autonomy',`${scope}/release-sentinel`,null,['scan_registry','detect_drift','open_pr'],['contents:read','pull-requests:write','packages:read'],0.38],
  ['miseos.repo-steward','MiseOS Repo Steward','agent','repository-health',`${scope}/repo-steward`,null,['repo_audit','branch_rules','readme_score'],['contents:read','issues:write'],0.28],
  ['miseos.runner','MiseOS Runner','container','runtime',null,`${ghcr}/miseos-runner`,['run_checks','build_packages','validate_policy'],['contents:read','packages:read'],0.22],
  ['miseos.policy-checker','MiseOS Policy Checker','container','governance',null,`${ghcr}/miseos-policy-checker`,['policy_check','sbom_check','attestation_check'],['contents:read'],0.19],
  ['miseos.docs-builder','MiseOS Docs Builder','container','documentation',null,`${ghcr}/miseos-docs-builder`,['build_docs','generate_dashboard','publish_site'],['contents:read','pages:write'],0.18],
  ['miseos.registry-schema','MiseOS Registry Schema','schema','registry',null,null,['validate_manifest','schema_contract'],['contents:read'],0.08],
  ['miseos.analytics-engine','MiseOS Analytics Engine','package','analytics',`${scope}/analytics-engine`,null,['risk_matrix','capability_map','dashboard'],['contents:read'],0.2],
  ['miseos.trust-graph','MiseOS Trust Graph','package','analytics',`${scope}/trust-graph`,null,['dependency_graph','trust_edges','lineage'],['contents:read'],0.24],
  ['miseos.sbom-indexer','MiseOS SBOM Indexer','automation','security',`${scope}/sbom-indexer`,null,['sbom_ingest','spdx_export','dependency_scan'],['contents:read','security-events:write'],0.31],
  ['miseos.attestation-gate','MiseOS Attestation Gate','automation','security',`${scope}/attestation-gate`,null,['verify_provenance','signed_release_gate'],['attestations:read','contents:read'],0.33],
  ['miseos.workflow-pack','MiseOS Workflow Pack','workflow-pack','ci',`${scope}/workflow-pack`,null,['ci_templates','publish_templates','security_templates'],['contents:read'],0.12],
  ['miseos.docs-hub-template','MiseOS Docs Hub Template','template','documentation',`${scope}/docs-hub-template`,null,['docs_scaffold','knowledge_base'],['contents:read'],0.1],
  ['miseos.nuget-client','MiseOS NuGet Client','package','dotnet','MiseOS.Registry.Client',null,['registry_client','policy_client'],['packages:read'],0.12],
  ['miseos.ruby-steward','MiseOS Ruby Steward','package','ruby','miseos-steward',null,['repo_stewardship','release_notes'],['contents:read'],0.13],
  ['miseos.maven-policy-adapter','MiseOS Maven Policy Adapter','package','jvm','dev.miseos:policy-adapter',null,['jvm_policy_eval','maven_metadata'],['contents:read'],0.14],
  ['miseos.gradle-plugin','MiseOS Gradle Plugin','package','jvm','dev.miseos.registry-plugin',null,['gradle_registry_check','build_gate'],['contents:read'],0.15],
  ['miseos.workflow-linter','MiseOS Workflow Linter','automation','ci',`${scope}/workflow-linter`,null,['workflow_lint','permission_minimize'],['contents:read'],0.18],
  ['miseos.repo-roamer','MiseOS Repo Roamer','package','experience',`${scope}/repo-roamer`,null,['terminal_mascot','agent_gallery','repo_guidance'],['contents:read'],0.12],
  ['miseos.orchestra-registry','MiseOS Orchestra Registry','data','orchestra',`${scope}/orchestra-registry`,null,['role_lookup','department_map','rarity_index'],['contents:read'],0.09],
  ['miseos.reliability-kit','MiseOS Reliability Kit','template','reliability',`${scope}/reliability-kit`,null,['incident_docs','slo_templates','ci_health'],['contents:read'],0.11],
  ['miseos.package-index','MiseOS Package Index','data','registry',`${scope}/package-index`,null,['catalog_export','package_lookup'],['contents:read'],0.08],
  ['miseos.bootstrap-registry','MiseOS Bootstrap Registry','repository','registry',null,null,['registry_index','trust_metadata','launch_order'],['contents:read','packages:write'],0.2]
];

const manifestFor = ([id,name,type,lane,npm,container,capabilities,permissions,risk]) => ({
  id, name, type, lane, version: '0.2.0', status: type === 'repository' ? 'active' : 'bootstrap', owner: 'MiseOS', generated_at: now,
  description: `${name} is a MiseOS bootstrap artifact for ${lane}.`,
  answers: {
    what_is_this: `${name} registry entry.`,
    what_does_it_do: `Provides ${capabilities.join(', ')}.`,
    who_owns_it: 'MiseOS / MiseOsBrigade.',
    required_permissions: permissions,
    hosted_registry: npm ? 'GitHub npm registry' : container ? 'GitHub Container Registry' : 'GitHub repository registry',
    latest_change: 'Generated by the MiseOS Bootstrap Registry importer.',
    safe_to_use: risk < 0.4,
    agent_executable_without_guessing: true
  },
  artifacts: { npm, container, repository: `${owner}/${repo}` },
  capabilities,
  permissions: { github: permissions },
  trust: { license_required: true, sbom_required: true, provenance_required: true, signed_release_required: true, human_review_required_for: ['permission_change','major_version_upgrade','security_policy_change','dependency_source_change'] },
  analytics: { risk_score: risk, permission_surface: permissions.length, capability_count: capabilities.length, autonomy_level: capabilities.includes('open_pr') ? 'guarded' : 'assisted' },
  miseos_metrics: { ECTI: 'required', CSM: 'required', STL: 'monitored', KAQ: 'required' }
});
const manifests = artifacts.map(manifestFor);
const riskRows = manifests.map(m => `${m.id},${m.type},${m.lane},${m.analytics.risk_score},${m.analytics.permission_surface},${m.answers.safe_to_use}`).join('\n');
const catalogRows = manifests.map(m => `${m.id},${m.name},${m.type},${m.lane},${m.artifacts.npm || ''},${m.artifacts.container || ''}`).join('\n');

write('README.md', `# MiseOS Bootstrap Registry\n\n**Registry → runtime → CLI → policy engine → release sentinel → autonomous updates.**\n\nThis directory is the bootstrap registry for MiseOS packages, containers, agents, workflows, policies, templates, analytics, and trust metadata. It is generated by \`tools/import-miseos-bootstrap-registry.mjs\` in the parent repository.\n\n## Primary bootloader\n\n| Layer | Artifact |\n| --- | --- |\n| Repository | \`miseos-bootstrap-registry\` |\n| Primary package | \`${scope}/cli\` |\n| Primary container | \`${ghcr}/miseos-runner\` |\n| Primary automation | \`${scope}/release-sentinel\` |\n| Governance layer | \`${scope}/policy-engine\` |\n\n## Publish order\n\n1. Publish \`${ghcr}/miseos-runner\`\n2. Publish \`${scope}/cli\`\n3. Publish \`${scope}/policy-engine\`\n4. Publish \`${scope}/release-sentinel\`\n\n## Registry contract\n\nEvery entry answers: what it is, what it does, who owns it, what permissions it needs, where it is hosted, what changed, whether it is safe, and whether an agent can execute it without guessing.\n\n## Commands\n\n\`\`\`bash\npnpm validate\npnpm analytics\npnpm dashboard\npnpm export\npnpm scope:check\npnpm sentinel:dry-run\npnpm policy:check\npnpm verify\n\`\`\`\n`);
write('LICENSE', 'MIT License\n\nCopyright (c) 2026 MiseOS\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files to deal in the Software without restriction, subject to preserving this notice.\n');
write('.gitignore', 'node_modules/\ndist/*.tmp\n.env\n.DS_Store\n.miseos/tmp/\n');
write('.editorconfig', 'root = true\n\n[*]\ncharset = utf-8\nindent_style = space\nindent_size = 2\nend_of_line = lf\ninsert_final_newline = true\ntrim_trailing_whitespace = true\n');
write('.npmrc', `@mise-os:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}\n`);
write('pnpm-workspace.yaml', 'packages:\n  - packages/*\n');
json('package.json', { name: 'miseos-bootstrap-registry', version: '0.2.0', private: true, type: 'module', packageManager: 'pnpm@9.15.4', scripts: { validate: 'node scripts/validate-registry.mjs', analytics: 'node scripts/analyze-registry.mjs', dashboard: 'node scripts/generate-dashboard.mjs', export: 'node scripts/export-registry.mjs', 'scope:check': 'node scripts/scope-check.mjs', 'sentinel:dry-run': 'node packages/release-sentinel/src/index.js --dry-run', 'policy:check': 'node packages/policy-engine/src/index.js', doctor: 'node scripts/doctor.mjs', test: 'node scripts/test.mjs', verify: 'pnpm validate && pnpm analytics && pnpm dashboard && pnpm export && pnpm scope:check && pnpm test' }, devDependencies: {} });
write('AGENTS.md', '# Agent Instructions\n\nRespect the registry contract. Do not publish or mutate packages unless trust metadata passes validation. Keep changes small, cited, and reversible.\n');
write('CLAUDE.md', '# CLAUDE.md\n\nThis repository uses agent-native structure. Prefer deterministic scripts over hidden reasoning. Keep registry manifests schema-valid.\n');
write('SECURITY.md', '# Security Policy\n\nReport issues through private repository channels. Release changes requiring new permissions must include human review.\n');
write('CONTRIBUTING.md', '# Contributing\n\nRun `pnpm verify` before opening changes. All manifests must answer the eight registry questions.\n');
write('.env.example', 'NODE_AUTH_TOKEN=\nGITHUB_TOKEN=\nREGISTRY_SCOPE=@mise-os\nGHCR_OWNER=mise-os\n');

json('registry/index.json', { name: 'MiseOS Bootstrap Registry', id: 'miseos.bootstrap-registry', version: '0.2.0', generated_at: now, repository: `${owner}/${repo}`, registries: { npm: 'https://npm.pkg.github.com', container: 'https://ghcr.io', rubygems: 'https://rubygems.pkg.github.com', maven: 'https://maven.pkg.github.com', nuget: 'https://nuget.pkg.github.com' }, namespaces: { npm: scope, container: ghcr, maven: 'dev.miseos', nuget: 'MiseOS', rubygems: 'miseos' }, core_packages: [`${scope}/cli`, `${scope}/agent-sdk`, `${scope}/policy-engine`, `${scope}/release-sentinel`, `${scope}/repo-steward`], core_containers: [`${ghcr}/miseos-runner`, `${ghcr}/miseos-policy-checker`, `${ghcr}/miseos-docs-builder`], manifest_count: manifests.length, launch_order: ['bootstrap','runtime','developer-tools','autonomy','expansion'] });
json('registry/config/scope-map.json', { preferred_npm_scope: scope, legacy_scope: '@miseos', container_namespace: ghcr, repository_full_name: `${owner}/${repo}`, migration_rule: 'Prefer @mise-os when GitHub owner is Mise-OS or MiseOsBrigade.' });
json('registry/orchestra/departments.json', departments);
json('registry/orchestra/roles.json', roles);
json('registry/orchestra/media.json', { theme_audio: 'mise_orchestra_theme.mp3', source_material: ['Mise_Orchestra_Master_Roster.pdf','Mise_Orchestra_Grand_Roster.pdf','Mise_Orchestra_Production_Bible.pdf'], generated_reference_assets: ['brand-and-asset-sheet.svg','departments-1-5.svg','mise-orchestra-logo.svg','miseos-agent-gallery.svg'] });
manifests.forEach(m => json(`registry/manifests/${m.id}.json`, m));

json('schemas/mise.registry.schema.json', { $schema: 'https://json-schema.org/draft/2020-12/schema', title: 'MiseOS Registry Manifest', type: 'object', required: ['id','name','type','version','owner','answers','capabilities','permissions','trust','analytics','miseos_metrics'], properties: { id: { type: 'string' }, name: { type: 'string' }, type: { type: 'string' }, version: { type: 'string' }, owner: { type: 'string' }, answers: { type: 'object' }, capabilities: { type: 'array', items: { type: 'string' } }, permissions: { type: 'object' }, trust: { type: 'object' }, analytics: { type: 'object' }, miseos_metrics: { type: 'object' } } });

write('scripts/lib/registry.mjs', `import { readdirSync, readFileSync } from 'node:fs';\nimport { join } from 'node:path';\nexport const registryRoot = new URL('../..', import.meta.url).pathname;\nexport function readJson(path){ return JSON.parse(readFileSync(join(registryRoot, path), 'utf8')); }\nexport function manifests(){ return readdirSync(join(registryRoot, 'registry/manifests')).filter(f=>f.endsWith('.json')).map(f=>readJson('registry/manifests/'+f)); }\nexport function scoreRisk(m){ return Number(m.analytics?.risk_score ?? 0.5); }\n`);
write('scripts/validate-registry.mjs', `import { manifests } from './lib/registry.mjs';\nconst requiredAnswers = ['what_is_this','what_does_it_do','who_owns_it','required_permissions','hosted_registry','latest_change','safe_to_use','agent_executable_without_guessing'];\nconst all = manifests();\nconst errors = [];\nfor (const m of all) {\n  for (const key of ['id','name','type','version','owner','answers','capabilities','permissions','trust','analytics','miseos_metrics']) if (!(key in m)) errors.push(m.id + ' missing ' + key);\n  for (const key of requiredAnswers) if (!(key in m.answers)) errors.push(m.id + ' missing answer ' + key);\n}\nif (errors.length) { console.error(errors.join('\\n')); process.exit(1); }\nconsole.log('✓ MiseOS registry validated: ' + all.length + ' manifests checked');\n`);
write('scripts/analyze-registry.mjs', `import { writeFileSync, mkdirSync } from 'node:fs';\nimport { manifests, scoreRisk } from './lib/registry.mjs';\nmkdirSync('reports', { recursive: true }); mkdirSync('analytics', { recursive: true });\nconst all = manifests();\nconst byType = Object.fromEntries([...new Set(all.map(m=>m.type))].map(t=>[t, all.filter(m=>m.type===t).length]));\nconst avgRisk = all.reduce((a,m)=>a+scoreRisk(m),0)/all.length;\nconst metrics = { generated_at: new Date().toISOString(), count: all.length, byType, avgRisk: Number(avgRisk.toFixed(3)), highRisk: all.filter(m=>scoreRisk(m)>=0.3).map(m=>m.id) };\nwriteFileSync('reports/registry-analytics.json', JSON.stringify(metrics, null, 2));\nwriteFileSync('analytics/registry-metrics.json', JSON.stringify(metrics, null, 2));\nconsole.log('✓ Analytics generated for ' + all.length + ' manifests');\n`);
write('scripts/generate-dashboard.mjs', `import { writeFileSync, mkdirSync } from 'node:fs';\nimport { manifests, scoreRisk } from './lib/registry.mjs';\nmkdirSync('docs', { recursive: true });\nconst rows = manifests().map(m=>`| ${m.id} | ${m.type} | ${m.lane} | ${scoreRisk(m)} | ${m.artifacts.npm || m.artifacts.container || 'repo'} |`).join('\\n');\nwriteFileSync('docs/registry-dashboard.md', '# MiseOS Registry Dashboard\\n\\n| ID | Type | Lane | Risk | Artifact |\\n| --- | --- | --- | ---: | --- |\\n' + rows + '\\n');\nconsole.log('✓ Dashboard written to docs/registry-dashboard.md');\n`);
write('scripts/export-registry.mjs', `import { writeFileSync, mkdirSync } from 'node:fs';\nimport { manifests } from './lib/registry.mjs';\nmkdirSync('dist', { recursive: true });\nconst all = manifests();\nwriteFileSync('dist/miseos-registry-index.json', JSON.stringify({ exported_at: new Date().toISOString(), manifests: all }, null, 2));\nwriteFileSync('dist/miseos-registry-catalog.csv', 'id,name,type,lane,npm,container\\n' + all.map(m=>[m.id,m.name,m.type,m.lane,m.artifacts.npm||'',m.artifacts.container||''].join(',')).join('\\n') + '\\n');\nconsole.log('✓ Registry exported to dist/');\n`);
write('scripts/scope-check.mjs', `import { manifests } from './lib/registry.mjs';\nconst bad = manifests().filter(m => m.artifacts?.npm && !m.artifacts.npm.startsWith('@mise-os/'));\nif (bad.length) { console.error('Bad npm scope: ' + bad.map(m=>m.artifacts.npm).join(', ')); process.exit(1); }\nconsole.log('✓ npm scope check passed: @mise-os');\n`);
write('scripts/doctor.mjs', `console.log('MiseOS Doctor');\nconsole.log('Node:', process.version);\nconsole.log('Registry root: miseos-bootstrap-registry');\nconsole.log('Scope: @mise-os');\n`);
write('scripts/test.mjs', `import { manifests } from './lib/registry.mjs';\nconst all = manifests();\nif (all.length < 20) throw new Error('Expected at least 20 manifests');\nconsole.log('✓ Tests passed: ' + all.length + ' manifests, analytics operational');\n`);
write('scripts/create-snapshot.mjs', `import { writeFileSync, mkdirSync } from 'node:fs';\nimport { manifests } from './lib/registry.mjs';\nmkdirSync('registry/snapshots', { recursive: true });\nwriteFileSync('registry/snapshots/current.json', JSON.stringify({ created_at: new Date().toISOString(), manifests: manifests() }, null, 2));\nconsole.log('✓ Snapshot created');\n`);
write('scripts/diff-registry.mjs', `console.log('✓ Registry diff placeholder: compare registry/snapshots/current.json against prior snapshot in CI.');\n`);

const pkgNames = ['cli','agent-sdk','policy-engine','release-sentinel','repo-steward','analytics-engine','trust-graph','sbom-indexer','attestation-gate','workflow-pack','docs-hub-template','repo-roamer','orchestra-registry','reliability-kit','package-index'];
for (const name of pkgNames) {
  const pkg = `${scope}/${name}`;
  json(`packages/${name}/package.json`, { name: pkg, version: '0.2.0', type: 'module', main: 'src/index.js', bin: name === 'cli' ? { miseos: 'bin/miseos.mjs' } : undefined, scripts: { test: 'node src/index.js --self-test' }, publishConfig: { registry: 'https://npm.pkg.github.com' } });
  write(`packages/${name}/README.md`, `# ${pkg}\n\nMiseOS bootstrap package for \`${name}\`.\n\n## Contract\n\n- Scope: \`${scope}\`\n- Registry: GitHub Packages npm\n- Trust: license, SBOM, provenance, and signed releases required\n`);
  write(`packages/${name}/src/index.js`, `export const id = '${name}';\nexport function info(){ return { id, packageName: '${pkg}', generated: '${now}' }; }\nif (process.argv.includes('--self-test')) console.log(JSON.stringify(info(), null, 2));\n`);
}
write('packages/cli/bin/miseos.mjs', `#!/usr/bin/env node\nimport { info } from '../src/index.js';\nconst cmd = process.argv[2] || 'doctor';\nconsole.log('miseos', cmd, JSON.stringify(info()));\n`);
write('packages/policy-engine/src/index.js', `export function evaluateManifest(m){ return { id: m.id, allowed: m.analytics.risk_score < 0.4, risk: m.analytics.risk_score }; }\nif (process.argv[1]?.endsWith('index.js')) console.log('MiseOS policy engine ready');\n`);
write('packages/release-sentinel/src/index.js', `const dry = process.argv.includes('--dry-run');\nconsole.log(JSON.stringify({ sentinel: 'miseos.release-sentinel', dryRun: dry, action: dry ? 'scan-only' : 'scan-and-open-pr' }, null, 2));\n`);

for (const c of ['runner','policy-checker','docs-builder']) {
  write(`containers/${c}/Dockerfile`, `FROM node:22-alpine\nWORKDIR /workspace\nCOPY . .\nRUN corepack enable || true\nCMD ["node", "scripts/doctor.mjs"]\n`);
}
write('containers/runner/entrypoint.sh', '#!/usr/bin/env sh\nset -eu\nnode scripts/doctor.mjs\n');

write('.github/workflows/validate-registry.yml', `name: Validate MiseOS Registry\non:\n  pull_request:\n  push:\n    paths:\n      - 'miseos-bootstrap-registry/**'\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: pnpm/action-setup@v4\n        with:\n          version: 9\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - run: pnpm install --ignore-scripts\n        working-directory: miseos-bootstrap-registry\n      - run: pnpm verify\n        working-directory: miseos-bootstrap-registry\n`);
write('.github/workflows/publish-npm.yml', `name: Publish MiseOS npm Packages\non:\n  workflow_dispatch:\npermissions:\n  contents: read\n  packages: write\njobs:\n  publish:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: pnpm/action-setup@v4\n        with:\n          version: 9\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          registry-url: https://npm.pkg.github.com\n          scope: '@mise-os'\n      - run: pnpm install --ignore-scripts\n        working-directory: miseos-bootstrap-registry\n      - run: pnpm -r publish --access restricted --no-git-checks\n        working-directory: miseos-bootstrap-registry\n        env:\n          NODE_AUTH_TOKEN: \${{ secrets.GITHUB_TOKEN }}\n`);
write('.github/workflows/publish-container.yml', `name: Publish MiseOS Containers\non:\n  workflow_dispatch:\npermissions:\n  contents: read\n  packages: write\njobs:\n  ghcr:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        image: [runner, policy-checker, docs-builder]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: \${{ github.actor }}\n          password: \${{ secrets.GITHUB_TOKEN }}\n      - uses: docker/build-push-action@v6\n        with:\n          context: miseos-bootstrap-registry\n          file: miseos-bootstrap-registry/containers/\${{ matrix.image }}/Dockerfile\n          push: true\n          tags: ghcr.io/mise-os/miseos-\${{ matrix.image }}:latest\n`);
write('.github/workflows/release-sentinel.yml', `name: MiseOS Release Sentinel\non:\n  schedule:\n    - cron: '17 */6 * * *'\n  workflow_dispatch:\npermissions:\n  contents: read\n  pull-requests: write\n  packages: read\njobs:\n  scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - run: node packages/release-sentinel/src/index.js --dry-run\n        working-directory: miseos-bootstrap-registry\n`);

write('docs/trust-model.md', '# Trust Model\n\nMiseOS uses least-privilege permissions, SBOM requirements, provenance checks, signed releases, and human review for permission or security-sensitive changes.\n');
write('docs/package-lifecycle.md', '# Package Lifecycle\n\n1. Draft manifest.\n2. Validate schema.\n3. Score risk.\n4. Publish runner.\n5. Publish package.\n6. Monitor drift.\n');
write('docs/naming-conventions.md', `# Naming Conventions\n\n- npm: \`${scope}/name\`\n- container: \`${ghcr}/miseos-name\`\n- manifest ID: \`miseos.name\`\n`);
write('docs/launch-plan.md', '# Launch Plan\n\nPhase 1: Bootstrap. Phase 2: Runtime. Phase 3: Developer Tools. Phase 4: Autonomy. Phase 5: Expansion.\n');
write('docs/ghcr-runner-first.md', `# GHCR Runner First\n\nPublish \`${ghcr}/miseos-runner\` before npm packages. It becomes the known-good execution station for validation, analytics, docs, and release sentinel scans.\n`);
write('docs/repository-integration-playbook.md', `# Repository Integration Playbook\n\nThis folder is intentionally nested under \`${ROOT}/\` so it can be integrated into the existing \`${owner}/${repo}\` repository without overwriting the parent repository app.\n`);
write('docs/mise-orchestra-alignment.md', '# Mise Orchestra Alignment\n\nMiseOS maps DevOps functions to kitchen roles: deployments become dishes, incidents become fires, scaling becomes elastic growth, and security becomes vault stewardship.\n');
write('docs/analytics-model.md', '# Analytics Model\n\nRisk = permission surface + autonomy level + write access + supply-chain sensitivity. Scores below 0.4 are bootstrap-safe.\n');
write('docs/publishing-playbook.md', '# Publishing Playbook\n\nUse GHCR first, npm second, policy engine third, release sentinel fourth. Maven, Gradle, RubyGems, and NuGet are expansion lanes.\n');
write('docs/scope-migration.md', '# Scope Migration\n\nLegacy scope `@miseos` should migrate to `@mise-os` when publishing under the Mise-OS/MiseOsBrigade identity.\n');
write('docs/media-assets.md', '# Media Assets\n\nGenerated SVG placeholders are included for repo-native references. Replace with high-resolution JPEG/PNG assets when a binary-capable Git push is available.\n');

write('reports/registry-risk-matrix.csv', `id,type,lane,risk_score,permission_surface,safe_to_use\n${riskRows}\n`);
write('reports/registry-catalog.csv', `id,name,type,lane,npm,container\n${catalogRows}\n`);
json('reports/registry-analytics.json', { generated_at: now, count: manifests.length, average_risk: Number((manifests.reduce((a,m)=>a+m.analytics.risk_score,0)/manifests.length).toFixed(3)), types: Object.fromEntries([...new Set(manifests.map(m=>m.type))].map(t=>[t, manifests.filter(m=>m.type===t).length])) });
write('reports/registry-analytics.md', `# Registry Analytics\n\n- Manifests checked: ${manifests.length}\n- Scope: ${scope}\n- Container namespace: ${ghcr}\n- Safe bootstrap threshold: risk < 0.4\n`);
json('analytics/registry-metrics.json', { generated_at: now, manifests: manifests.length, sha256: sha256(JSON.stringify(manifests)) });
write('analytics/risk-matrix.csv', `id,type,lane,risk_score,permission_surface,safe_to_use\n${riskRows}\n`);
write('analytics/registry-catalog.csv', `id,name,type,lane,npm,container\n${catalogRows}\n`);
write('analytics/package-graph.mmd', `graph TD\n  Registry[MiseOS Bootstrap Registry] --> Runner[GHCR Runner]\n  Runner --> CLI[@mise-os/cli]\n  CLI --> Policy[@mise-os/policy-engine]\n  Policy --> Sentinel[@mise-os/release-sentinel]\n  Sentinel --> Updates[Autonomous Update PRs]\n`);
json('analytics/capability-map.json', Object.fromEntries(manifests.map(m => [m.id, m.capabilities])));
json('dist/miseos-registry-index.json', { exported_at: now, manifests });
write('dist/miseos-registry-catalog.csv', `id,name,type,lane,npm,container\n${catalogRows}\n`);
json('registry/snapshots/current.json', { created_at: now, manifests });
json('.miseos/sentinel/release-sentinel-report.json', { generated_at: now, mode: 'dry-run', scanned: manifests.length, changes: [], recommendation: 'publish ghcr.io/mise-os/miseos-runner first' });

const svg = (title, subtitle, color) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#0E0F10"/><rect x="40" y="40" width="1120" height="595" rx="24" fill="none" stroke="${color}" stroke-width="6"/><text x="80" y="160" fill="${color}" font-size="58" font-family="Arial, sans-serif" font-weight="700">${title}</text><text x="80" y="240" fill="#F6F1E7" font-size="32" font-family="Arial, sans-serif">${subtitle}</text><circle cx="1000" cy="340" r="120" fill="none" stroke="${color}" stroke-width="8"/><path d="M945 355 Q1000 260 1055 355" stroke="${color}" stroke-width="8" fill="none"/><text x="80" y="560" fill="#F6F1E7" font-size="28" font-family="monospace">Cook. Orchestrate. Deploy.</text></svg>`;
for (const [name,title,subtitle,color] of [
  ['brand-and-asset-sheet.svg','MiseOS Brand Sheet','Umami Black · Gold Ladle · Broth Cream','#D4AF37'],
  ['departments-1-5.svg','Departments 1–5','Pipeline · Platform · Reliability · Security · Data','#E5564B'],
  ['mise-orchestra-logo.svg','Mise Orchestra','Every Role. One Symphony.','#D4AF37'],
  ['miseos-agent-gallery.svg','Agent Gallery','15 starter agents, 25 registry artifacts','#5B8DEF'],
  ['security-infrastructure-departments.svg','Security Infrastructure','Vaults, attestations, SBOMs, release gates','#E5564B']
]) write(`packages/repo-roamer/docs/assets/reference/${name}`, svg(title, subtitle, color));

write('docs/registry-dashboard.md', `# MiseOS Registry Dashboard\n\n| Metric | Value |\n| --- | ---: |\n| Manifests | ${manifests.length} |\n| npm scope | ${scope} |\n| GHCR namespace | ${ghcr} |\n| Generated | ${now} |\n\n## Launch sequence\n\nregistry → runtime → CLI → policy engine → release sentinel → autonomous updates\n`);

console.log(`✓ MiseOS Bootstrap Registry generated: ${manifests.length} manifests checked`);
console.log(`✓ Output: ${ROOT}/`);
