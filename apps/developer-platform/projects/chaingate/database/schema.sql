CREATE TABLE wallet_identities (
 id uuid PRIMARY KEY, user_id text NOT NULL, account_id text NOT NULL UNIQUE, verified_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE wallet_sessions (
 id uuid PRIMARY KEY, user_id text NOT NULL, approved_scopes jsonb NOT NULL, approved_accounts jsonb NOT NULL, expires_at timestamptz NOT NULL, revoked_at timestamptz
);
CREATE TABLE auth_nonces (
 nonce_hash text PRIMARY KEY, user_hint text, expires_at timestamptz NOT NULL, consumed_at timestamptz
);
CREATE TABLE transaction_intents (
 id uuid PRIMARY KEY, payload jsonb NOT NULL, policy_decision jsonb, simulation jsonb, status text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE provenance_manifests (
 id uuid PRIMARY KEY, artifact_sha256 text NOT NULL, manifest jsonb NOT NULL, signature text, transaction_hash text, created_at timestamptz NOT NULL DEFAULT now()
);
