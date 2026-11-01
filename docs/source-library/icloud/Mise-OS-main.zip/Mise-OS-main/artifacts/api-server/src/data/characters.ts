export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'genesis';

export interface Character {
  id: number;
  name: string;
  title: string;
  role: string;
  department: Department;
  rarity: Rarity;
  tags: string[];
}

export type Department =
  | 'pipeline'
  | 'platform'
  | 'reliability'
  | 'security'
  | 'data';

export interface DepartmentInfo {
  id: Department;
  name: string;
  tagline: string;
  color: string;
  characters: Character[];
}

export const CHARACTERS: Character[] = [
  // ── Department 1: Pipeline ──────────────────────────────────────────
  { id:  1, name: 'Alko Commit Chef',   title: 'Commit Chef',       role: 'Commit Intake',               department: 'pipeline',    rarity: 'genesis', tags: ['commit', 'intake'] },
  { id:  2, name: 'Bruno Blast-Radius', title: 'Change Scanner',    role: 'Change Impact Scanner',       department: 'pipeline',    rarity: 'rare',    tags: ['change', 'impact'] },
  { id:  3, name: 'Lila Branchkeeper',  title: 'Branchkeeper',      role: 'Branch Policy Gate',          department: 'pipeline',    rarity: 'rare',    tags: ['branch', 'policy'] },
  { id:  4, name: 'Omar Reviewer',      title: 'PR Reviewer',       role: 'PR Hygiene Check',            department: 'pipeline',    rarity: 'common',  tags: ['pr', 'review'] },
  { id:  5, name: 'Hugo Matrix',        title: 'Matrix Runner',     role: 'Test Matrix Runner',          department: 'pipeline',    rarity: 'common',  tags: ['test', 'matrix'] },
  { id:  6, name: 'Seira Scan',         title: 'Security Scanner',  role: 'Security Scan Stage',         department: 'pipeline',    rarity: 'rare',    tags: ['security', 'scan'] },
  { id:  7, name: 'Yume Builder',       title: 'Artifact Builder',  role: 'Artifact Builder',            department: 'pipeline',    rarity: 'genesis', tags: ['build', 'artifact'] },
  { id:  8, name: 'Iron Hashi',         title: 'Validator',         role: 'Artifact Validator',          department: 'pipeline',    rarity: 'common',  tags: ['validate', 'artifact'] },
  { id:  9, name: 'Nina Promoter',      title: 'Promoter',          role: 'Environment Promotion Gate',  department: 'pipeline',    rarity: 'common',  tags: ['promote', 'environment'] },
  { id: 10, name: 'Release Conductor',  title: 'Conductor',         role: 'Deployment Orchestrator',     department: 'pipeline',    rarity: 'epic',    tags: ['deploy', 'orchestrate'] },
  { id: 11, name: 'Felix Rollback',     title: 'Rollback Chef',     role: 'Rollback & Fix-Forward',      department: 'pipeline',    rarity: 'genesis', tags: ['rollback', 'fix'] },
  { id: 12, name: 'Tariq Notesmith',    title: 'Release Scribe',    role: 'Release Notes Generator',     department: 'pipeline',    rarity: 'common',  tags: ['notes', 'release'] },
  { id: 13, name: 'Ivun Cache',         title: 'Cost Monitor',      role: 'Pipeline Cost Monitor',       department: 'pipeline',    rarity: 'rare',    tags: ['cost', 'cache'] },
  { id: 14, name: 'Canary Taster',      title: 'Observability',     role: 'Pipeline Observability',      department: 'pipeline',    rarity: 'genesis', tags: ['canary', 'observe'] },
  { id: 15, name: 'Pipeline Sensei',    title: 'Pipeline Tuner',    role: 'Pipeline Tuner Agent',        department: 'pipeline',    rarity: 'genesis', tags: ['tune', 'advisor'] },

  // ── Department 2: Platform ──────────────────────────────────────────
  { id: 16, name: 'Template Tanaka',    title: 'Template Curator',  role: 'Service Template Catalog',    department: 'platform',    rarity: 'genesis', tags: ['template', 'catalog'] },
  { id: 17, name: 'Bootstrap Aiko',     title: 'Service Wizard',    role: 'New Service Wizard',          department: 'platform',    rarity: 'genesis', tags: ['bootstrap', 'scaffold'] },
  { id: 18, name: 'Terra Forge',        title: 'Provisioner',       role: 'Environment Provisioner',     department: 'platform',    rarity: 'epic',    tags: ['terraform', 'infra'] },
  { id: 19, name: 'Schema Sora',        title: 'DB Blueprint',      role: 'Database Blueprint Manager',  department: 'platform',    rarity: 'rare',    tags: ['schema', 'database'] },
  { id: 20, name: 'Runtime Riku',       title: 'Runtime Manager',   role: 'Runtime Profile Manager',     department: 'platform',    rarity: 'genesis', tags: ['runtime', 'profile'] },
  { id: 21, name: 'Vault Hana',         title: 'Secrets Broker',    role: 'Secrets & Config Broker',     department: 'platform',    rarity: 'epic',    tags: ['secrets', 'config'] },
  { id: 22, name: 'Policy Kenji',       title: 'Policy Guard',      role: 'Policy Packs',                department: 'platform',    rarity: 'rare',    tags: ['policy', 'governance'] },
  { id: 23, name: 'Grafana Mei',        title: 'Observability Packer', role: 'Shared Observability Pack', department: 'platform',   rarity: 'common',  tags: ['grafana', 'observe'] },
  { id: 24, name: 'Umami Code',         title: 'Traffic Manager',   role: 'Traffic & Ingress Manager',   department: 'platform',    rarity: 'genesis', tags: ['traffic', 'ingress'] },
  { id: 25, name: 'Queue Mizu',         title: 'Queue Curator',     role: 'Job & Queue Templates',       department: 'platform',    rarity: 'common',  tags: ['queue', 'jobs'] },
  { id: 26, name: 'Streama',            title: 'Stream Chef',       role: 'Data Streaming Profiles',     department: 'platform',    rarity: 'genesis', tags: ['stream', 'data'] },
  { id: 27, name: 'Preview Yuki',       title: 'Preview Spawner',   role: 'Preview Environment Spawner', department: 'platform',    rarity: 'rare',    tags: ['preview', 'env'] },
  { id: 28, name: 'Portal Rei',         title: 'Portal UI',         role: 'Self-Service Portal UI',      department: 'platform',    rarity: 'rare',    tags: ['portal', 'self-service'] },
  { id: 29, name: 'Guardrail Goro',     title: 'Golden Path Guard', role: 'Golden Path Guardrails',      department: 'platform',    rarity: 'epic',    tags: ['guardrail', 'golden-path'] },
  { id: 30, name: 'Platform Sensei',    title: 'Health Advisor',    role: 'Platform Health Board',       department: 'platform',    rarity: 'genesis', tags: ['advisor', 'health'] },

  // ── Department 3: Reliability ───────────────────────────────────────
  { id: 31, name: 'SLO Sage',           title: 'SLO Architect',     role: 'SLO Definition Workflow',     department: 'reliability', rarity: 'genesis', tags: ['slo', 'define'] },
  { id: 32, name: 'Trace Sensei',       title: 'Instrumentation',   role: 'Instrumentation Booster',     department: 'reliability', rarity: 'rare',    tags: ['trace', 'instrument'] },
  { id: 33, name: 'Chaos Kaito',        title: 'Chaos Chef',        role: 'Load & Chaos Profiles',       department: 'reliability', rarity: 'epic',    tags: ['chaos', 'load'] },
  { id: 34, name: 'Capacity Kanna',     title: 'Capacity Planner',  role: 'Pre-Deployment Reliability Check', department: 'reliability', rarity: 'rare', tags: ['capacity', 'plan'] },
  { id: 35, name: 'Canary Judge',       title: 'Canary Arbiter',    role: 'Canary Judge',                department: 'reliability', rarity: 'common',  tags: ['canary', 'judge'] },
  { id: 36, name: 'Alert Akira',        title: 'Alert Architect',   role: 'Incident Detection Rules',    department: 'reliability', rarity: 'genesis', tags: ['alert', 'detect'] },
  { id: 37, name: 'Pager Hiro',         title: 'Triage Master',     role: 'Incident Triage Runbook',     department: 'reliability', rarity: 'common',  tags: ['incident', 'triage'] },
  { id: 38, name: 'OnCall Naomi',       title: 'Rotation Manager',  role: 'On-Call Rotation Manager',    department: 'reliability', rarity: 'common',  tags: ['oncall', 'rotation'] },
  { id: 39, name: 'Review Ren',         title: 'Postmortem Lead',   role: 'Post-Incident Review',        department: 'reliability', rarity: 'rare',    tags: ['postmortem', 'review'] },
  { id: 40, name: 'Backlog Benji',      title: 'Backlog Builder',   role: 'Reliability Backlog Builder',  department: 'reliability', rarity: 'common', tags: ['backlog', 'track'] },
  { id: 41, name: 'Metrics Miko',       title: 'Dashboard Weaver',  role: 'SLO Dashboards',              department: 'reliability', rarity: 'genesis', tags: ['metrics', 'dashboard'] },
  { id: 42, name: 'Forecast Fuji',      title: 'Capacity Planner',  role: 'Capacity Planner',            department: 'reliability', rarity: 'rare',    tags: ['forecast', 'capacity'] },
  { id: 43, name: 'Resilience Ryu',     title: 'Resilience Tester', role: 'Resilience Testing Loop',     department: 'reliability', rarity: 'epic',    tags: ['resilience', 'test'] },
  { id: 44, name: 'Impact Ichi',        title: 'Impact Simulator',  role: 'Customer Impact Simulator',   department: 'reliability', rarity: 'rare',    tags: ['impact', 'simulate'] },
  { id: 45, name: 'Reliability Sensei', title: 'Reliability Advisor', role: 'Reliability Advisor Agent', department: 'reliability', rarity: 'genesis', tags: ['advisor', 'reliability'] },

  // ── Department 4: Security ──────────────────────────────────────────
  { id: 46, name: 'Threat Taro',        title: 'Threat Modeler',    role: 'Threat Modeling Starter',     department: 'security',    rarity: 'genesis', tags: ['threat', 'model'] },
  { id: 47, name: 'Secure Sakura',      title: 'Template Keeper',   role: 'Secure Template Library',     department: 'security',    rarity: 'rare',    tags: ['secure', 'template'] },
  { id: 48, name: 'Token Toshi',        title: 'Credential Guard',  role: 'Credential Hygiene Scanner',  department: 'security',    rarity: 'common',  tags: ['token', 'credential'] },
  { id: 49, name: 'CVE Kumo',           title: 'Dependency Guard',  role: 'Dependency Risk Monitor',     department: 'security',    rarity: 'common',  tags: ['cve', 'dependency'] },
  { id: 50, name: 'Container Kage',     title: 'Hardening Specialist', role: 'Container Hardening Workflow', department: 'security', rarity: 'rare',   tags: ['container', 'harden'] },
  { id: 51, name: 'Seira Vaultkeeper',  title: 'Secrets Lifecycle', role: 'Secrets Lifecycle Manager',   department: 'security',    rarity: 'epic',    tags: ['secrets', 'vault'] },
  { id: 52, name: 'Policy Ronin',       title: 'Policy-as-Code',    role: 'Policy-as-Code Engine',       department: 'security',    rarity: 'epic',    tags: ['policy', 'code'] },
  { id: 53, name: 'Merge Sentinel',     title: 'Security Gate',     role: 'Pre-Merge Security Gate',     department: 'security',    rarity: 'genesis', tags: ['merge', 'gate'] },
  { id: 54, name: 'Watchtower Yoru',    title: 'Runtime Detector',  role: 'Runtime Threat Detector',     department: 'security',    rarity: 'epic',    tags: ['runtime', 'detect'] },
  { id: 55, name: 'Auditor Emi',        title: 'Access Reviewer',   role: 'Access Review Workflow',      department: 'security',    rarity: 'rare',    tags: ['audit', 'access'] },
  { id: 56, name: 'Incident Kitsune',   title: 'Incident Playbook', role: 'Security Incident Playbooks', department: 'security',    rarity: 'epic',    tags: ['incident', 'playbook'] },
  { id: 57, name: 'Evidence Scribe',    title: 'Compliance Keeper', role: 'Compliance Evidence Collector', department: 'security',  rarity: 'rare',    tags: ['compliance', 'evidence'] },
  { id: 58, name: 'Nudge Neko',         title: 'Training Nudger',   role: 'Security Training Nudges',    department: 'security',    rarity: 'common',  tags: ['training', 'nudge'] },
  { id: 59, name: 'Scorecard Shin',     title: 'Scorecard Builder', role: 'Security Scorecard',          department: 'security',    rarity: 'common',  tags: ['scorecard', 'score'] },
  { id: 60, name: 'Red Oni',            title: 'Red Team Chaos',    role: 'Red Team / Chaos Security Mode', department: 'security', rarity: 'legendary', tags: ['red-team', 'chaos'] },

  // ── Department 5: Data & Insight ────────────────────────────────────
  { id: 61, name: 'Taxonomy Taka',      title: 'Event Taxonomist',  role: 'Event Taxonomy Manager',      department: 'data',        rarity: 'genesis', tags: ['taxonomy', 'event'] },
  { id: 62, name: 'Lake Haru',          title: 'Ingestion Pipeline', role: 'Telemetry Ingestion Pipeline', department: 'data',      rarity: 'rare',    tags: ['lake', 'telemetry'] },
  { id: 63, name: 'Lattice',            title: 'Trace Correlator',  role: 'Trace Correlator',            department: 'data',        rarity: 'epic',    tags: ['trace', 'correlate'] },
  { id: 64, name: 'Repo Ranger',        title: 'Repo Health',       role: 'Repo Health Analyzer',        department: 'data',        rarity: 'common',  tags: ['repo', 'health'] },
  { id: 65, name: 'DORA Daichi',        title: 'Analytics Engine',  role: 'Pipeline Analytics Engine',   department: 'data',        rarity: 'genesis', tags: ['dora', 'analytics'] },
  { id: 66, name: 'Flag Fox',           title: 'Flag Analyst',      role: 'Feature Flag Analytics',      department: 'data',        rarity: 'rare',    tags: ['feature-flag', 'analytics'] },
  { id: 67, name: 'Cost Kaito',         title: 'Cost Monitor',      role: 'Cost & Efficiency Monitor',   department: 'data',        rarity: 'rare',    tags: ['cost', 'efficiency'] },
  { id: 68, name: 'DX Mei',             title: 'DX Surveyor',       role: 'Developer Experience Survey Loop', department: 'data',   rarity: 'common',  tags: ['dx', 'survey'] },
  { id: 69, name: 'Revenue Rina',       title: 'Customer Linker',   role: 'Customer Behavior → Incident Linker', department: 'data', rarity: 'epic',   tags: ['revenue', 'customer'] },
  { id: 70, name: 'Risk Ryota',         title: 'Risk Scorer',       role: 'Risk Scoring Model',          department: 'data',        rarity: 'rare',    tags: ['risk', 'score'] },
  { id: 71, name: 'Apprentice Kai',     title: 'Self-Improve Agent', role: 'Self-Improvement Agent',     department: 'data',        rarity: 'rare',    tags: ['ai', 'improve'] },
  { id: 72, name: 'Anomaly Aki',        title: 'Anomaly Detector',  role: 'Anomaly Detection Studio',    department: 'data',        rarity: 'epic',    tags: ['anomaly', 'detect'] },
  { id: 73, name: 'Leaderboard Leo',    title: 'Scorecard Builder', role: 'Scorecards & Leaderboards',   department: 'data',        rarity: 'common',  tags: ['leaderboard', 'scorecard'] },
  { id: 74, name: 'Storyteller Sumi',   title: 'Narrative Writer',  role: 'Narrative Report Generator',  department: 'data',        rarity: 'genesis', tags: ['story', 'report'] },
  { id: 75, name: 'Roadmap Sensei',     title: 'Strategy Advisor',  role: 'Strategic Roadmap Recommender', department: 'data',      rarity: 'genesis', tags: ['roadmap', 'strategy'] },
];

export const DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'pipeline',
    name: 'Pipeline Kitchen',
    tagline: 'Build. Test. Deploy. Repeat.',
    color: '#3B82F6',
    characters: CHARACTERS.filter(c => c.department === 'pipeline'),
  },
  {
    id: 'platform',
    name: 'Platform Kitchen',
    tagline: 'The stage where services live.',
    color: '#14B8A6',
    characters: CHARACTERS.filter(c => c.department === 'platform'),
  },
  {
    id: 'reliability',
    name: 'Reliability Kitchen',
    tagline: 'Observe. Measure. Improve.',
    color: '#F59E0B',
    characters: CHARACTERS.filter(c => c.department === 'reliability'),
  },
  {
    id: 'security',
    name: 'Security Kitchen',
    tagline: 'Protect the kitchen.',
    color: '#EF4444',
    characters: CHARACTERS.filter(c => c.department === 'security'),
  },
  {
    id: 'data',
    name: 'Data & Insight Kitchen',
    tagline: 'Learn. Optimize. Evolve.',
    color: '#8B5CF6',
    characters: CHARACTERS.filter(c => c.department === 'data'),
  },
];
