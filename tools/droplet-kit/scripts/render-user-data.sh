#!/usr/bin/env bash
set -Eeuo pipefail
ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
ARCHIVE=$(tar -C "$ROOT" -czf - infra | base64 -w0)
cat <<SCRIPT
#!/usr/bin/env bash
set -Eeuo pipefail
export DEBIAN_FRONTEND=noninteractive
exec > >(tee -a /var/log/miseos-bootstrap.log) 2>&1
trap 'echo "MiseOS bootstrap failed at line \$LINENO" >&2' ERR

apt-get update
apt-get upgrade -y
apt-get install -y ca-certificates curl git jq openssl ufw fail2ban unattended-upgrades gnupg python3

id miseos >/dev/null 2>&1 || useradd --create-home --shell /bin/bash --groups sudo miseos
passwd -l miseos
printf 'miseos ALL=(ALL) NOPASSWD:ALL\n' >/etc/sudoers.d/90-miseos
chmod 0440 /etc/sudoers.d/90-miseos

cat >/etc/ssh/sshd_config.d/99-miseos-hardening.conf <<'SSH'
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password
X11Forwarding no
MaxAuthTries 5
SSH
systemctl restart ssh

cat >/etc/fail2ban/jail.d/miseos.local <<'JAIL'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5
[sshd]
enabled = true
JAIL
systemctl enable --now fail2ban

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=\$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \$(. /etc/os-release && echo \${VERSION_CODENAME}) stable" >/etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
usermod -aG docker miseos
systemctl enable --now docker

ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

install -d -m 0750 -o miseos -g miseos /opt/miseos/{repo,infra,data,backups,logs,secrets,bin}
echo '$ARCHIVE' | base64 -d | tar -xzf - -C /opt/miseos --strip-components=1
chown -R miseos:miseos /opt/miseos/infra

sudo -u miseos git clone --depth=1 --branch main https://github.com/MiseOsBrigade/MiseOS.git /opt/miseos/repo

umask 077
POSTGRES_PASSWORD=\$(openssl rand -hex 32)
MINIO_ROOT_PASSWORD=\$(openssl rand -base64 36 | tr -d '\n/+' | cut -c1-40)
MISEOS_INTERNAL_TOKEN=\$(openssl rand -hex 32)
cat >/opt/miseos/infra/.env <<ENV
MISEOS_PUBLIC_HOST=:80
POSTGRES_DB=miseos
POSTGRES_USER=miseos
POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
MINIO_ROOT_USER=miseos
MINIO_ROOT_PASSWORD=\${MINIO_ROOT_PASSWORD}
MISEOS_INTERNAL_TOKEN=\${MISEOS_INTERNAL_TOKEN}
ENV
chown root:miseos /opt/miseos/infra/.env
chmod 0640 /opt/miseos/infra/.env

cat >/opt/miseos/bin/healthcheck.sh <<'HEALTH'
#!/usr/bin/env bash
set -Eeuo pipefail
cd /opt/miseos/infra
docker compose ps
curl -fsS http://127.0.0.1/api/health | jq .
curl -fsS http://127.0.0.1/api/v1/catalog/summary | jq .
test -f /opt/miseos/bootstrap-complete
HEALTH
chmod 0755 /opt/miseos/bin/healthcheck.sh

cat >/opt/miseos/bin/backup.sh <<'BACKUP'
#!/usr/bin/env bash
set -Eeuo pipefail
umask 077
stamp=\$(date -u +%Y%m%dT%H%M%SZ)
cd /opt/miseos/infra
set -a; source .env; set +a
docker compose exec -T postgres pg_dump -U "\$POSTGRES_USER" -d "\$POSTGRES_DB" -Fc > "/opt/miseos/backups/postgres-\${stamp}.dump"
find /opt/miseos/backups -type f -mtime +14 -delete
BACKUP
chmod 0750 /opt/miseos/bin/backup.sh

cat >/etc/systemd/system/miseos-backup.service <<'SERVICE'
[Unit]
Description=MiseOS backup
Requires=docker.service
After=docker.service
[Service]
Type=oneshot
ExecStart=/opt/miseos/bin/backup.sh
SERVICE
cat >/etc/systemd/system/miseos-backup.timer <<'TIMER'
[Unit]
Description=Daily MiseOS backup
[Timer]
OnCalendar=*-*-* 03:17:00
Persistent=true
RandomizedDelaySec=900
[Install]
WantedBy=timers.target
TIMER
systemctl daemon-reload
systemctl enable --now miseos-backup.timer

cd /opt/miseos/infra
docker compose --env-file .env config --quiet
docker compose --env-file .env up -d --build --remove-orphans
for i in \$(seq 1 60); do
  if curl -fsS http://127.0.0.1/api/health >/dev/null; then
    touch /opt/miseos/bootstrap-complete
    echo 'MiseOS bootstrap complete.'
    exit 0
  fi
  sleep 5
done
docker compose ps
exit 1
SCRIPT
