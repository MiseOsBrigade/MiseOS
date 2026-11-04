CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS repos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  primary_language TEXT,
  framework TEXT,
  package_manager TEXT,
  ci_provider TEXT,
  health_score INTEGER DEFAULT 0,
  risk_level TEXT DEFAULT 'unknown',
  status TEXT DEFAULT 'active',
  last_scan_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  model_type TEXT NOT NULL,
  permission_tier TEXT NOT NULL,
  memory_scope TEXT DEFAULT 'repo',
  cost_class TEXT DEFAULT 'standard',
  status TEXT DEFAULT 'idle',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  read_allowed BOOLEAN DEFAULT true,
  write_allowed BOOLEAN DEFAULT false,
  risk_level TEXT DEFAULT 'medium',
  auth_type TEXT,
  secret_env_var TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_id UUID REFERENCES repos(id),
  assigned_agent_id UUID REFERENCES agents(id),
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL,
  priority TEXT DEFAULT 'P2',
  status TEXT DEFAULT 'backlog',
  approval_required BOOLEAN DEFAULT true,
  validation_required TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  input_source TEXT,
  steps JSONB NOT NULL,
  approval_required BOOLEAN DEFAULT true,
  output_type TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id),
  repo_id UUID REFERENCES repos(id),
  source_type TEXT NOT NULL,
  source_path TEXT,
  claim TEXT NOT NULL,
  certainty TEXT CHECK (certainty IN ('CONFIRMED', 'INFERRED', 'UNKNOWN')),
  observed_output TEXT,
  validator TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_id UUID REFERENCES repos(id),
  ecosystem TEXT NOT NULL,
  package_name TEXT NOT NULL,
  current_version TEXT,
  latest_registry_version TEXT,
  publish_status TEXT DEFAULT 'unknown',
  last_published_at TIMESTAMPTZ,
  release_required BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS secret_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_id UUID REFERENCES repos(id),
  file_path TEXT,
  secret_type TEXT,
  value_redacted TEXT DEFAULT '[REDACTED]',
  in_git_history BOOLEAN DEFAULT false,
  rotation_required BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'open',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rag_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  chunk_level TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding_model TEXT,
  vector_id TEXT,
  metadata JSONB DEFAULT '{}',
  staleness_score NUMERIC DEFAULT 0,
  last_indexed_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS model_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_type TEXT NOT NULL,
  preferred_model_type TEXT NOT NULL,
  fallback_model_type TEXT,
  max_cost NUMERIC,
  max_latency_ms INTEGER,
  requires_citation BOOLEAN DEFAULT true,
  requires_human_approval BOOLEAN DEFAULT false
);
