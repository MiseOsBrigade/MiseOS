# MiseOS DigitalOcean Droplet Kit

First-boot automation for a production-oriented MiseOS Character Intelligence Core.

## Stack

- Caddy public gateway
- MISE-CORE FastAPI catalog service
- PostgreSQL
- Redis
- Qdrant
- MinIO
- Node Exporter

Internal data services bind to loopback or an internal Docker network. UFW exposes only SSH, HTTP, and HTTPS. Secrets are generated during first boot and never embedded in user data.

## Deploy

```bash
./scripts/create-droplet.sh --ssh-key YOUR_DIGITALOCEAN_KEY_FINGERPRINT
```

Defaults: `sfo3`, `s-4vcpu-8gb`, `ubuntu-24-04-x64`.

## Verify

```bash
./scripts/post-create-checks.sh DROPLET_IP
```

Or on the server:

```bash
cloud-init status --wait
/opt/miseos/bin/healthcheck.sh
tail -n 200 /var/log/cloud-init-output.log
```

## Public endpoints

- `/api/health`
- `/api/docs`
- `/api/v1/catalog/summary`
- `/api/v1/catalog/characters`

## Important boundary

The API reports source records as found. It does not silently count registry manifests as characters. A change from the established 112-character/23-registry source model to 155 characters should be handled as a versioned canon migration.

## DigitalOcean connector limitation

The DigitalOcean connector available in this chat can create Droplets, but its create action does not accept a `user_data` field. The kit therefore uses the supported `doctl --user-data-file` path rather than launching an incompletely configured server.

## Self-contained startup payload

`create-droplet.sh` calls `render-user-data.sh`, which embeds the complete `infra/` directory into a first-boot Bash payload. The Droplet therefore does not depend on deployment files already existing in the GitHub repository.
