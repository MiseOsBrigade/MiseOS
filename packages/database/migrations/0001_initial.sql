CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE registry_kind AS ENUM (
    'agent','action','workflow','tool','policy','proof_gate','package','schema','template','container'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'github',
  provider_repository_id TEXT NOT NULL,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  default_branch TEXT NOT NULL DEFAULT 'main',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_repository_id)
);

CREATE TABLE IF NOT EXISTS registry_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_id TEXT NOT NULL UNIQUE,
  kind registry_kind NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  visibility TEXT NOT NULL DEFAULT 'private',
  owner_organization_id UUID REFERENCES organizations(id),
  brand JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS registry_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_record_id UUID NOT NULL REFERENCES registry_records(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  specification JSONB NOT NULL,
  schema_version TEXT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  deprecated_at TIMESTAMPTZ,
  UNIQUE(registry_record_id, version)
);

CREATE TABLE IF NOT EXISTS workflow_installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  workflow_version_id UUID NOT NULL REFERENCES registry_versions(id),
  enabled BOOLEAN NOT NULL DEFAULT true,
  configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_installation_id UUID REFERENCES workflow_installations(id),
  workflow_version_id UUID NOT NULL REFERENCES registry_versions(id),
  trigger_type TEXT NOT NULL,
  trigger_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('queued','running','waiting_for_approval','succeeded','failed','blocked','cancelled')),
  idempotency_key TEXT NOT NULL UNIQUE,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS step_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_run_id UUID NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
  step_id TEXT NOT NULL,
  action_version_id UUID NOT NULL REFERENCES registry_versions(id),
  status TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  UNIQUE(workflow_run_id, step_id)
);

CREATE TABLE IF NOT EXISTS evidence_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_run_id UUID NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
  step_run_id UUID REFERENCES step_runs(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL,
  uri TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  checksum_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS policy_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_run_id UUID NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
  policy_version_id UUID NOT NULL REFERENCES registry_versions(id),
  decision TEXT NOT NULL CHECK (decision IN ('allow','deny','approval_required')),
  violations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_run_id UUID NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending','approved','rejected','expired')),
  requested_by TEXT NOT NULL,
  decided_by TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS import_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
  source_index INTEGER NOT NULL,
  raw_record JSONB NOT NULL,
  normalized_registry_id TEXT,
  status TEXT NOT NULL DEFAULT 'raw'
);

CREATE TABLE IF NOT EXISTS import_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_record_id UUID NOT NULL REFERENCES import_records(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  message TEXT NOT NULL,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS workflow_runs_status_idx ON workflow_runs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS evidence_records_run_idx ON evidence_records(workflow_run_id, created_at);
CREATE INDEX IF NOT EXISTS audit_events_resource_idx ON audit_events(resource_type, resource_id, created_at DESC);
