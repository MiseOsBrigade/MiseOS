
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- pgvector is optional in the default image. The API stores deterministic JSON vectors
-- and can be migrated to vector(1536) without changing the public retrieval contract.
CREATE INDEX IF NOT EXISTS ix_canonical_items_name_trgm ON canonical_items USING gin (name gin_trgm_ops);
