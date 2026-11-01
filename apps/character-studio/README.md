# MiseOS Clickable Character Studio

A safe clickable-character runtime and sprite-pack studio.

## Security boundary

- PNG, JPEG, WebP, GLB, and sprite files are visual assets only.
- Character behavior comes from a detached, signed manifest.
- Every action must be present in both:
  1. the signed character manifest, and
  2. the server-owned workflow registry.
- The server reconstructs authorization context. It never trusts a client-supplied
  `authorized` flag or workflow module path.
- Workflow modules are statically imported. Registry values are IDs, not arbitrary file paths.
- Nonces are one-time and expire.
- NFT checks fail closed.
- Image processing validates decoded size and file type.
- Exported packs contain provenance and validation reports.

This follows the core rule: **visual identity above; explicit, reviewable enforcement below**.

## Start

```bash
cp .env.example .env
npm install
npm run keys:generate
npm run manifest:sign
npm start
```

Serve `frontend/` from a static server on port 8080:

```bash
python3 -m http.server 8080 --directory frontend
```

Open `http://localhost:8080`.

## Important production substitutions

The included stores are process-local reference implementations. Replace them with:

- Redis for nonces and sessions
- PostgreSQL for audit records and character metadata
- S3-compatible object storage for source images, sprite frames, manifests, and ZIP exports
- a background job queue for image processing
- a KMS/HSM-backed signing process

Do not mount the manifest private key into the runtime API.
