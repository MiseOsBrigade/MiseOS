CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  primary_language TEXT,
  framework TEXT,
  package_manager TEXT,
  ci_provider TEXT,
  health_score INTEGER NOT NULL DEFAULT 0 CHECK (health_score BETWEEN 0 AND 100),
  risk_level TEXT NOT NULL DEFAULT 'unknown',
  status TEXT NOT NULL DEFAULT 'active',
  last_scan_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  model_type TEXT NOT NULL,
  permission_tier TEXT NOT NULL,
  memory_scope TEXT NOT NULL DEFAULT 'repo',
  cost_class TEXT NOT NULL DEFAULT 'standard',
  status TEXT NOT NULL DEFAULT 'idle',
  allowed_tools TEXT[] NOT NULL DEFAULT '{}',
  blocked_actions TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  assigned_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'P2',
  status TEXT NOT NULL DEFAULT 'backlog',
  approval_required BOOLEAN NOT NULL DEFAULT true,
  validation_required TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  read_allowed BOOLEAN NOT NULL DEFAULT true,
  write_allowed BOOLEAN NOT NULL DEFAULT false,
  risk_level TEXT NOT NULL DEFAULT 'medium',
  auth_type TEXT,
  secret_env_var TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  input_source TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  approval_required BOOLEAN NOT NULL DEFAULT true,
  output_type TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  mode TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  repo_id UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  run_id UUID REFERENCES workflow_runs(id) ON DELETE SET NULL,
  source_type TEXT NOT NULL,
  source_path TEXT,
  claim TEXT NOT NULL,
  certainty TEXT NOT NULL CHECK (certainty IN ('CONFIRMED', 'INFERRED', 'UNKNOWN')),
  observed_output TEXT,
  validator TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  ecosystem TEXT NOT NULL,
  package_name TEXT NOT NULL,
  current_version TEXT,
  latest_registry_version TEXT,
  publish_status TEXT NOT NULL DEFAULT 'unknown',
  last_published_at TIMESTAMPTZ,
  release_required BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (ecosystem, package_name)
);

CREATE TABLE secret_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  file_path TEXT,
  secret_type TEXT,
  value_redacted TEXT NOT NULL DEFAULT '[REDACTED]',
  in_git_history BOOLEAN NOT NULL DEFAULT false,
  rotation_required BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'open',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (value_redacted = '[REDACTED]')
);

CREATE TABLE rag_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  repo_id UUID REFERENCES repos(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  chunk_level TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding_model TEXT,
  vector_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  staleness_score NUMERIC NOT NULL DEFAULT 0,
  last_indexed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE model_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type TEXT NOT NULL UNIQUE,
  preferred_model_type TEXT NOT NULL,
  fallback_model_type TEXT,
  max_cost NUMERIC,
  max_latency_ms INTEGER,
  requires_citation BOOLEAN NOT NULL DEFAULT true,
  requires_human_approval BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX repos_risk_idx ON repos(risk_level);
CREATE INDEX tasks_repo_status_idx ON tasks(repo_id, status);
CREATE INDEX evidence_repo_certainty_idx ON evidence(repo_id, certainty);
CREATE INDEX packages_repo_status_idx ON packages(repo_id, publish_status);
CREATE INDEX rag_chunks_source_idx ON rag_chunks(repo_id, source_type, source_id);
