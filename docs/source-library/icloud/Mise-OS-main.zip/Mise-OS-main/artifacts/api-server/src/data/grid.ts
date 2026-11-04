// ── MiseOS Kitchen — Knowledge Grid (Mise Grid OS SheetGrid) ──────────────
// A structured "everything in its place" workspace shared by the agent brigade:
// Projects, Tasks, Sources, Claims, Tools. Every claim is tied to evidence,
// every record carries status + confidence so the grid stays trustworthy.

export type GridProjectStatus =
  | 'active'
  | 'planning'
  | 'blocked'
  | 'shipped'
  | 'archived';
export type GridTaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
export type GridPriority = 'critical' | 'high' | 'medium' | 'low';
export type GridSourceType =
  | 'doc'
  | 'incident'
  | 'metric'
  | 'repo'
  | 'runbook'
  | 'dataset'
  | 'external';
export type GridReliability = 'high' | 'medium' | 'low' | 'unknown';
export type GridConfidence = 'high' | 'medium' | 'low' | 'unknown';
export type GridVerification = 'verified' | 'pending' | 'unsupported' | 'deprecated';
export type GridToolCategory =
  | 'ci'
  | 'security'
  | 'observability'
  | 'infra'
  | 'data'
  | 'ai';
export type GridPrivacy = 'local' | 'cloud' | 'hybrid';
export type GridIntegration = 'api' | 'cli' | 'webhook' | 'mcp';
export type GridStation = 'pipeline' | 'platform' | 'reliability' | 'security' | 'data';

export interface GridProject {
  id: string;
  name: string;
  goal: string;
  status: GridProjectStatus;
  priority: GridPriority;
  owner: string;
  station: GridStation;
  deadline: string;
  canonicalSummary: string;
  tags: string[];
}

export interface GridTask {
  id: string;
  title: string;
  projectId: string;
  status: GridTaskStatus;
  priority: GridPriority;
  owner: string;
  nextAction: string;
  dueDate: string;
  toolId: string | null;
}

export interface GridSource {
  id: string;
  title: string;
  url: string;
  type: GridSourceType;
  author: string;
  datePublished: string;
  reliability: GridReliability;
  summary: string;
  tags: string[];
}

export interface GridClaim {
  id: string;
  statement: string;
  sourceId: string | null;
  projectId: string | null;
  confidence: GridConfidence;
  verification: GridVerification;
  lastVerified: string | null;
  verifiedBy: string | null;
  notes: string;
}

export interface GridTool {
  id: string;
  name: string;
  category: GridToolCategory;
  useCase: string;
  privacy: GridPrivacy;
  integrationType: GridIntegration;
  cost: string;
  relatedStation: GridStation;
  tags: string[];
}

// ── Projects ──────────────────────────────────────────────────────────────
export const GRID_PROJECTS: GridProject[] = [
  {
    id: 'PRJ-001',
    name: 'Golden Path Onboarding',
    goal: 'Ship a self-service portal so any team can stand up a production-ready service in under 30 minutes.',
    status: 'active',
    priority: 'high',
    owner: 'Bootstrap Aiko',
    station: 'platform',
    deadline: '2026-08-14',
    canonicalSummary:
      'Self-service service creation with golden-path templates, guardrails, and preview environments.',
    tags: ['platform', 'developer-experience', 'golden-path'],
  },
  {
    id: 'PRJ-002',
    name: 'Zero-Downtime Release Train',
    goal: 'Move every Tier-1 service onto canary + automatic rollback with no manual deploy windows.',
    status: 'active',
    priority: 'critical',
    owner: 'Release Conductor',
    station: 'pipeline',
    deadline: '2026-07-03',
    canonicalSummary:
      'Progressive delivery: canary analysis, automated rollback, and release-notes generation for all Tier-1 services.',
    tags: ['pipeline', 'deploy', 'canary'],
  },
  {
    id: 'PRJ-003',
    name: 'SLO Coverage Expansion',
    goal: 'Define and instrument SLOs for the 40 services currently flying blind.',
    status: 'active',
    priority: 'high',
    owner: 'SLO Sage',
    station: 'reliability',
    deadline: '2026-09-01',
    canonicalSummary:
      'Author SLOs, wire dashboards, and connect alerting for services without reliability targets.',
    tags: ['reliability', 'slo', 'observability'],
  },
  {
    id: 'PRJ-004',
    name: 'Supply-Chain Hardening',
    goal: 'Enforce signed artifacts and a pre-merge security gate across the monorepo.',
    status: 'blocked',
    priority: 'critical',
    owner: 'Merge Sentinel',
    station: 'security',
    deadline: '2026-07-22',
    canonicalSummary:
      'Artifact signing, dependency risk gating, and a mandatory pre-merge security review for every PR.',
    tags: ['security', 'supply-chain', 'gate'],
  },
  {
    id: 'PRJ-005',
    name: 'DORA Insight Lake',
    goal: 'Centralize delivery telemetry and publish weekly DORA scorecards per team.',
    status: 'planning',
    priority: 'medium',
    owner: 'DORA Daichi',
    station: 'data',
    deadline: '2026-10-10',
    canonicalSummary:
      'Telemetry ingestion + analytics engine producing DORA metrics, leaderboards, and narrative reports.',
    tags: ['data', 'dora', 'analytics'],
  },
  {
    id: 'PRJ-006',
    name: 'Secrets Rotation Overhaul',
    goal: 'Replace all long-lived credentials with short-TTL Vault-issued tokens.',
    status: 'active',
    priority: 'high',
    owner: 'Vault Hana',
    station: 'security',
    deadline: '2026-08-30',
    canonicalSummary:
      'Ephemeral credential issuance via Vault with RBAC, automatic rotation, and zero static keys in agents.',
    tags: ['security', 'secrets', 'vault'],
  },
];

// ── Sources ───────────────────────────────────────────────────────────────
export const GRID_SOURCES: GridSource[] = [
  {
    id: 'SRC-001',
    title: 'Platform Golden Path RFC',
    url: 'https://grid.miseos.dev/rfc/golden-path',
    type: 'doc',
    author: 'Template Tanaka',
    datePublished: '2026-05-12',
    reliability: 'high',
    summary:
      'Accepted RFC defining the golden-path template catalog and self-service portal contract.',
    tags: ['rfc', 'platform'],
  },
  {
    id: 'SRC-002',
    title: 'Incident #4412 — Checkout deploy stall',
    url: 'https://grid.miseos.dev/incidents/4412',
    type: 'incident',
    author: 'Pager Hiro',
    datePublished: '2026-06-09',
    reliability: 'high',
    summary:
      'Post-incident review of a 41-minute checkout outage caused by a missing rollback trigger.',
    tags: ['incident', 'pipeline', 'rollback'],
  },
  {
    id: 'SRC-003',
    title: 'Deploy frequency dashboard (Q2)',
    url: 'https://grid.miseos.dev/metrics/deploy-frequency',
    type: 'metric',
    author: 'DORA Daichi',
    datePublished: '2026-06-18',
    reliability: 'high',
    summary:
      'Live Grafana board: deploy frequency, lead time, change-failure rate, and MTTR per service.',
    tags: ['metric', 'dora'],
  },
  {
    id: 'SRC-004',
    title: 'Canary analysis runbook',
    url: 'https://grid.miseos.dev/runbooks/canary-analysis',
    type: 'runbook',
    author: 'Canary Judge',
    datePublished: '2026-04-28',
    reliability: 'medium',
    summary:
      'Step-by-step runbook for evaluating canary health signals and aborting bad rollouts.',
    tags: ['runbook', 'canary'],
  },
  {
    id: 'SRC-005',
    title: 'mise-grid-os repository',
    url: 'https://github.com/brigade-systems/mise-grid-os',
    type: 'repo',
    author: 'Repo Ranger',
    datePublished: '2026-03-02',
    reliability: 'high',
    summary:
      'Source-of-truth monorepo for the knowledge grid schemas, validation scripts, and agent boundaries.',
    tags: ['repo', 'schema'],
  },
  {
    id: 'SRC-006',
    title: 'Dependency risk scan — weekly digest',
    url: 'https://grid.miseos.dev/security/dep-risk',
    type: 'dataset',
    author: 'CVE Kumo',
    datePublished: '2026-06-20',
    reliability: 'medium',
    summary:
      'Aggregated CVE exposure across all services with severity and exploit-maturity scoring.',
    tags: ['security', 'cve', 'dataset'],
  },
  {
    id: 'SRC-007',
    title: 'Vault dynamic secrets guide',
    url: 'https://grid.miseos.dev/docs/vault-dynamic-secrets',
    type: 'doc',
    author: 'Seira Vaultkeeper',
    datePublished: '2026-05-30',
    reliability: 'high',
    summary:
      'Reference for issuing short-TTL credentials per agent role with automatic revocation.',
    tags: ['vault', 'secrets'],
  },
  {
    id: 'SRC-008',
    title: 'DevEx survey — Q2 results',
    url: 'https://grid.miseos.dev/data/devex-q2',
    type: 'dataset',
    author: 'DX Mei',
    datePublished: '2026-06-15',
    reliability: 'medium',
    summary:
      'Quarterly developer-experience survey: onboarding time, deploy confidence, and toil hotspots.',
    tags: ['devex', 'survey'],
  },
  {
    id: 'SRC-009',
    title: 'SLO definition workshop notes',
    url: 'https://grid.miseos.dev/docs/slo-workshop',
    type: 'doc',
    author: 'SLO Sage',
    datePublished: '2026-05-08',
    reliability: 'low',
    summary:
      'Raw notes from the SLO definition workshop; targets not yet ratified by service owners.',
    tags: ['slo', 'draft'],
  },
  {
    id: 'SRC-010',
    title: 'Blog: "Why we killed deploy windows"',
    url: 'https://external.example.com/killed-deploy-windows',
    type: 'external',
    author: 'External — DevOps Weekly',
    datePublished: '2026-02-19',
    reliability: 'low',
    summary:
      'Third-party opinion piece arguing for continuous deployment; anecdotal, not validated internally.',
    tags: ['external', 'opinion'],
  },
];

// ── Claims ────────────────────────────────────────────────────────────────
// A claim is only "verified" when it is backed by a source. Claims with no
// source are flagged "unsupported" — the grid never treats them as fact.
export const GRID_CLAIMS: GridClaim[] = [
  {
    id: 'CLM-001',
    statement:
      'The checkout outage on 2026-06-09 was caused by a missing automatic rollback trigger.',
    sourceId: 'SRC-002',
    projectId: 'PRJ-002',
    confidence: 'high',
    verification: 'verified',
    lastVerified: '2026-06-11',
    verifiedBy: 'Review Ren',
    notes: 'Root cause confirmed in the post-incident review and reproduced in staging.',
  },
  {
    id: 'CLM-002',
    statement:
      'Teams using golden-path templates onboard a new service 4x faster than hand-rolled setups.',
    sourceId: 'SRC-008',
    projectId: 'PRJ-001',
    confidence: 'medium',
    verification: 'pending',
    lastVerified: null,
    verifiedBy: null,
    notes: 'Survey signal is positive but sample size is small; needs a controlled comparison.',
  },
  {
    id: 'CLM-003',
    statement: 'Change-failure rate dropped below 8% across all Tier-1 services in Q2.',
    sourceId: 'SRC-003',
    projectId: 'PRJ-005',
    confidence: 'high',
    verification: 'verified',
    lastVerified: '2026-06-19',
    verifiedBy: 'DORA Daichi',
    notes: 'Confirmed against the live deploy-frequency dashboard.',
  },
  {
    id: 'CLM-004',
    statement: 'Deploy windows can be removed entirely without increasing incident volume.',
    sourceId: 'SRC-010',
    projectId: 'PRJ-002',
    confidence: 'low',
    verification: 'pending',
    lastVerified: null,
    verifiedBy: null,
    notes: 'Only backed by an external opinion piece; needs internal evidence before acting.',
  },
  {
    id: 'CLM-005',
    statement: '40 production services currently have no defined SLOs.',
    sourceId: 'SRC-009',
    projectId: 'PRJ-003',
    confidence: 'medium',
    verification: 'pending',
    lastVerified: null,
    verifiedBy: null,
    notes: 'Number comes from unratified workshop notes; reconcile with the service catalog.',
  },
  {
    id: 'CLM-006',
    statement: 'Every agent role can be issued a short-TTL Vault token scoped to its permissions.',
    sourceId: 'SRC-007',
    projectId: 'PRJ-006',
    confidence: 'high',
    verification: 'verified',
    lastVerified: '2026-06-02',
    verifiedBy: 'Seira Vaultkeeper',
    notes: 'Validated end-to-end in the secrets pilot for the pipeline brigade.',
  },
  {
    id: 'CLM-007',
    statement: 'Three Tier-1 services still ship with unsigned build artifacts.',
    sourceId: 'SRC-006',
    projectId: 'PRJ-004',
    confidence: 'high',
    verification: 'verified',
    lastVerified: '2026-06-21',
    verifiedBy: 'Merge Sentinel',
    notes: 'Confirmed in the weekly dependency + artifact scan.',
  },
  {
    id: 'CLM-008',
    statement: 'Migrating to MCP-based tool access will cut credential sprawl by half.',
    sourceId: null,
    projectId: 'PRJ-006',
    confidence: 'unknown',
    verification: 'unsupported',
    lastVerified: null,
    verifiedBy: null,
    notes: 'No source attached. Treat as a hypothesis until evidence is gathered.',
  },
  {
    id: 'CLM-009',
    statement: 'Canary analysis catches ~90% of bad rollouts before full traffic shift.',
    sourceId: 'SRC-004',
    projectId: 'PRJ-002',
    confidence: 'medium',
    verification: 'pending',
    lastVerified: null,
    verifiedBy: null,
    notes: 'Runbook cites the figure but it predates the current canary judge model.',
  },
  {
    id: 'CLM-010',
    statement: 'Onboarding time will drop under 30 minutes once the portal ships.',
    sourceId: null,
    projectId: 'PRJ-001',
    confidence: 'unknown',
    verification: 'unsupported',
    lastVerified: null,
    verifiedBy: null,
    notes: 'Target, not a measured result. No source yet.',
  },
  {
    id: 'CLM-011',
    statement: 'The legacy "deploy freeze" policy is no longer referenced by any active runbook.',
    sourceId: 'SRC-005',
    projectId: 'PRJ-002',
    confidence: 'medium',
    verification: 'deprecated',
    lastVerified: '2026-03-15',
    verifiedBy: 'Repo Ranger',
    notes: 'Superseded by the progressive-delivery policy; retained for history.',
  },
  {
    id: 'CLM-012',
    statement: 'Developer deploy confidence rose 22 points after canary rollout in the pipeline brigade.',
    sourceId: 'SRC-008',
    projectId: 'PRJ-002',
    confidence: 'medium',
    verification: 'pending',
    lastVerified: null,
    verifiedBy: null,
    notes: 'Survey delta looks strong; cross-check against incident data before publishing.',
  },
];

// ── Tools ─────────────────────────────────────────────────────────────────
export const GRID_TOOLS: GridTool[] = [
  {
    id: 'TOOL-001',
    name: 'GitHub Actions',
    category: 'ci',
    useCase: 'CI/CD workflows, integrity audits, and release automation.',
    privacy: 'cloud',
    integrationType: 'api',
    cost: 'Included',
    relatedStation: 'pipeline',
    tags: ['ci', 'workflows'],
  },
  {
    id: 'TOOL-002',
    name: 'HashiCorp Vault',
    category: 'security',
    useCase: 'Short-TTL credential issuance and secrets lifecycle management.',
    privacy: 'hybrid',
    integrationType: 'api',
    cost: 'Enterprise',
    relatedStation: 'security',
    tags: ['secrets', 'vault'],
  },
  {
    id: 'TOOL-003',
    name: 'Grafana',
    category: 'observability',
    useCase: 'SLO dashboards, deploy metrics, and alerting visualizations.',
    privacy: 'cloud',
    integrationType: 'api',
    cost: 'Free tier',
    relatedStation: 'reliability',
    tags: ['dashboards', 'observability'],
  },
  {
    id: 'TOOL-004',
    name: 'Terraform',
    category: 'infra',
    useCase: 'Environment provisioning and golden-path infrastructure modules.',
    privacy: 'hybrid',
    integrationType: 'cli',
    cost: 'OSS',
    relatedStation: 'platform',
    tags: ['iac', 'provisioning'],
  },
  {
    id: 'TOOL-005',
    name: 'OpenTelemetry',
    category: 'observability',
    useCase: 'Distributed tracing and instrumentation across services.',
    privacy: 'local',
    integrationType: 'api',
    cost: 'OSS',
    relatedStation: 'reliability',
    tags: ['tracing', 'instrumentation'],
  },
  {
    id: 'TOOL-006',
    name: 'pgvector',
    category: 'data',
    useCase: 'Vector search over the grid retrieval index for approved records.',
    privacy: 'local',
    integrationType: 'api',
    cost: 'OSS',
    relatedStation: 'data',
    tags: ['rag', 'vector'],
  },
  {
    id: 'TOOL-007',
    name: 'Trivy',
    category: 'security',
    useCase: 'Container and dependency vulnerability scanning in the pre-merge gate.',
    privacy: 'local',
    integrationType: 'cli',
    cost: 'OSS',
    relatedStation: 'security',
    tags: ['scan', 'containers'],
  },
  {
    id: 'TOOL-008',
    name: 'Argo Rollouts',
    category: 'ci',
    useCase: 'Progressive delivery — canary and blue/green deployment control.',
    privacy: 'cloud',
    integrationType: 'api',
    cost: 'OSS',
    relatedStation: 'pipeline',
    tags: ['canary', 'deploy'],
  },
  {
    id: 'TOOL-009',
    name: 'dbt',
    category: 'data',
    useCase: 'Transform delivery telemetry into DORA scorecards and leaderboards.',
    privacy: 'cloud',
    integrationType: 'cli',
    cost: 'Free tier',
    relatedStation: 'data',
    tags: ['transform', 'dora'],
  },
  {
    id: 'TOOL-010',
    name: 'MiseOS MCP Gateway',
    category: 'ai',
    useCase: 'Unified, permissioned tool access for the agent brigade via MCP.',
    privacy: 'hybrid',
    integrationType: 'mcp',
    cost: 'Included',
    relatedStation: 'platform',
    tags: ['mcp', 'agents'],
  },
];

// ── Tasks ─────────────────────────────────────────────────────────────────
export const GRID_TASKS: GridTask[] = [
  {
    id: 'TSK-001',
    title: 'Publish service template catalog v1',
    projectId: 'PRJ-001',
    status: 'in_progress',
    priority: 'high',
    owner: 'Template Tanaka',
    nextAction: 'Finalize the Node and Go service archetypes and tag them golden.',
    dueDate: '2026-07-01',
    toolId: 'TOOL-004',
  },
  {
    id: 'TSK-002',
    title: 'Wire preview environments into the portal',
    projectId: 'PRJ-001',
    status: 'todo',
    priority: 'medium',
    owner: 'Preview Yuki',
    nextAction: 'Provision ephemeral namespaces on PR open.',
    dueDate: '2026-07-18',
    toolId: 'TOOL-004',
  },
  {
    id: 'TSK-003',
    title: 'Add automatic rollback trigger to checkout',
    projectId: 'PRJ-002',
    status: 'review',
    priority: 'critical',
    owner: 'Felix Rollback',
    nextAction: 'Ship the rollback hook behind a flag and shadow-test.',
    dueDate: '2026-06-30',
    toolId: 'TOOL-008',
  },
  {
    id: 'TSK-004',
    title: 'Roll canary analysis out to all Tier-1 services',
    projectId: 'PRJ-002',
    status: 'in_progress',
    priority: 'high',
    owner: 'Canary Judge',
    nextAction: 'Migrate the payments service onto Argo Rollouts.',
    dueDate: '2026-07-03',
    toolId: 'TOOL-008',
  },
  {
    id: 'TSK-005',
    title: 'Author SLOs for the top 10 blind services',
    projectId: 'PRJ-003',
    status: 'in_progress',
    priority: 'high',
    owner: 'SLO Sage',
    nextAction: 'Ratify latency + availability targets with service owners.',
    dueDate: '2026-07-25',
    toolId: 'TOOL-003',
  },
  {
    id: 'TSK-006',
    title: 'Stand up SLO dashboards',
    projectId: 'PRJ-003',
    status: 'todo',
    priority: 'medium',
    owner: 'Metrics Miko',
    nextAction: 'Template the Grafana board per service.',
    dueDate: '2026-08-08',
    toolId: 'TOOL-003',
  },
  {
    id: 'TSK-007',
    title: 'Unblock artifact signing rollout',
    projectId: 'PRJ-004',
    status: 'blocked',
    priority: 'critical',
    owner: 'Merge Sentinel',
    nextAction: 'Resolve key-management ownership with the security station.',
    dueDate: '2026-07-10',
    toolId: 'TOOL-007',
  },
  {
    id: 'TSK-008',
    title: 'Enable pre-merge security gate repo-wide',
    projectId: 'PRJ-004',
    status: 'todo',
    priority: 'high',
    owner: 'Policy Ronin',
    nextAction: 'Turn the gate from advisory to required on main.',
    dueDate: '2026-07-22',
    toolId: 'TOOL-007',
  },
  {
    id: 'TSK-009',
    title: 'Design the telemetry ingestion pipeline',
    projectId: 'PRJ-005',
    status: 'todo',
    priority: 'medium',
    owner: 'Lake Haru',
    nextAction: 'Pick the event schema and landing format.',
    dueDate: '2026-08-20',
    toolId: 'TOOL-009',
  },
  {
    id: 'TSK-010',
    title: 'Build the first DORA scorecard',
    projectId: 'PRJ-005',
    status: 'todo',
    priority: 'low',
    owner: 'DORA Daichi',
    nextAction: 'Model the four key metrics in dbt.',
    dueDate: '2026-09-05',
    toolId: 'TOOL-009',
  },
  {
    id: 'TSK-011',
    title: 'Pilot ephemeral tokens for the pipeline brigade',
    projectId: 'PRJ-006',
    status: 'done',
    priority: 'high',
    owner: 'Vault Hana',
    nextAction: 'Completed — pilot validated, expand to platform next.',
    dueDate: '2026-06-02',
    toolId: 'TOOL-002',
  },
  {
    id: 'TSK-012',
    title: 'Revoke all static API keys from agents',
    projectId: 'PRJ-006',
    status: 'in_progress',
    priority: 'high',
    owner: 'Seira Vaultkeeper',
    nextAction: 'Sweep the secret store and rotate remaining long-lived keys.',
    dueDate: '2026-08-15',
    toolId: 'TOOL-002',
  },
  {
    id: 'TSK-013',
    title: 'Stand up the grid retrieval index',
    projectId: 'PRJ-005',
    status: 'todo',
    priority: 'low',
    owner: 'Corpus Indexer',
    nextAction: 'Embed canonical summaries for verified records only.',
    dueDate: '2026-09-20',
    toolId: 'TOOL-006',
  },
  {
    id: 'TSK-014',
    title: 'Reduce onboarding toil hotspots from survey',
    projectId: 'PRJ-001',
    status: 'todo',
    priority: 'medium',
    owner: 'DX Mei',
    nextAction: 'Triage the top 3 toil themes from the Q2 DevEx survey.',
    dueDate: '2026-08-01',
    toolId: null,
  },
];

// ── Derived helpers ─────────────────────────────────────────────────────────
export interface GridSummary {
  counts: {
    projects: number;
    tasks: number;
    sources: number;
    claims: number;
    tools: number;
  };
  projectsByStatus: Record<GridProjectStatus, number>;
  tasksByStatus: Record<GridTaskStatus, number>;
  claimsByVerification: Record<GridVerification, number>;
  claimsByConfidence: Record<GridConfidence, number>;
  sourcesByReliability: Record<GridReliability, number>;
  verificationHealth: {
    total: number;
    verified: number;
    supported: number;
    unsupported: number;
    verifiedPct: number;
  };
}

const PROJECT_STATUSES: GridProjectStatus[] = [
  'active',
  'planning',
  'blocked',
  'shipped',
  'archived',
];
const TASK_STATUSES: GridTaskStatus[] = [
  'todo',
  'in_progress',
  'review',
  'done',
  'blocked',
];
const VERIFICATIONS: GridVerification[] = [
  'verified',
  'pending',
  'unsupported',
  'deprecated',
];
const CONFIDENCES: GridConfidence[] = ['high', 'medium', 'low', 'unknown'];
const RELIABILITIES: GridReliability[] = ['high', 'medium', 'low', 'unknown'];

export function computeGridSummary(): GridSummary {
  const projectsByStatus = Object.fromEntries(
    PROJECT_STATUSES.map(s => [s, 0]),
  ) as Record<GridProjectStatus, number>;
  for (const p of GRID_PROJECTS) projectsByStatus[p.status]++;

  const tasksByStatus = Object.fromEntries(
    TASK_STATUSES.map(s => [s, 0]),
  ) as Record<GridTaskStatus, number>;
  for (const t of GRID_TASKS) tasksByStatus[t.status]++;

  const claimsByVerification = Object.fromEntries(
    VERIFICATIONS.map(s => [s, 0]),
  ) as Record<GridVerification, number>;
  const claimsByConfidence = Object.fromEntries(
    CONFIDENCES.map(s => [s, 0]),
  ) as Record<GridConfidence, number>;
  for (const c of GRID_CLAIMS) {
    claimsByVerification[c.verification]++;
    claimsByConfidence[c.confidence]++;
  }

  const sourcesByReliability = Object.fromEntries(
    RELIABILITIES.map(s => [s, 0]),
  ) as Record<GridReliability, number>;
  for (const s of GRID_SOURCES) sourcesByReliability[s.reliability]++;

  const total = GRID_CLAIMS.length;
  const verified = claimsByVerification.verified;
  const supported = GRID_CLAIMS.filter(c => c.sourceId !== null).length;
  const unsupported = total - supported;

  return {
    counts: {
      projects: GRID_PROJECTS.length,
      tasks: GRID_TASKS.length,
      sources: GRID_SOURCES.length,
      claims: GRID_CLAIMS.length,
      tools: GRID_TOOLS.length,
    },
    projectsByStatus,
    tasksByStatus,
    claimsByVerification,
    claimsByConfidence,
    sourcesByReliability,
    verificationHealth: {
      total,
      verified,
      supported,
      unsupported,
      verifiedPct: total === 0 ? 0 : Math.round((verified / total) * 100),
    },
  };
}
