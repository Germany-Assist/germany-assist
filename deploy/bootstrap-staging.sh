#!/usr/bin/env bash
# One-time bootstrap for a fresh Ubuntu 22.04/24.04 server (target shape: Hetzner CX23).
# Turns a bare VPS into a running Germany Assist staging server.
#
# Run as root:
#   bash deploy/bootstrap-staging.sh
#
# Optional environment overrides:
#   REPO_URL        git remote to clone (default: GitHub SSH remote of this repo)
#   APP_DIR         install location (default: /var/www/germany-assist)
#   DEPLOY_USER     user that owns the deployment (default: deploy)
#   SERVER_NAME     domain for nginx (default: _ , i.e. any host)
#   SEED_DB         "true" to force-seed the staging DB (default: true, destructive)

set -euo pipefail

REPO_URL="${REPO_URL:-git@github.com:Germany-Assist/germany-assist.git}"
APP_DIR="${APP_DIR:-/var/www/germany-assist}"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
SERVER_NAME="${SERVER_NAME:-_}"
SEED_DB="${SEED_DB:-true}"

log() { echo "[bootstrap] $*"; }

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run this script as root (sudo)." >&2
  exit 1
fi

log "Installing Docker, git, nginx, ufw..."
apt-get update -qq
apt-get install -y -qq git nginx curl ufw >/dev/null
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sh
fi

log "Creating deploy user '${DEPLOY_USER}'..."
if ! id -u "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
fi
usermod -aG docker "$DEPLOY_USER"

log "Fetching the repository..."
if [[ ! -d "$APP_DIR/.git" ]]; then
  mkdir -p "$APP_DIR"
  if sudo -u "$DEPLOY_USER" git clone "$REPO_URL" "$APP_DIR" 2>/dev/null; then
    log "Cloned ${REPO_URL}"
  else
    SSH_DIR="/home/$DEPLOY_USER/.ssh"
    sudo -u "$DEPLOY_USER" mkdir -p "$SSH_DIR"
    if [[ ! -f "$SSH_DIR/id_ed25519" ]]; then
      sudo -u "$DEPLOY_USER" ssh-keygen -t ed25519 -N "" -f "$SSH_DIR/id_ed25519" >/dev/null
      chmod 700 "$SSH_DIR"
      chown -R "$DEPLOY_USER:$DEPLOY_USER" "$SSH_DIR"
    fi
    echo ""
    log "Could not clone the repo (private or missing deploy key)."
    log "Add this read-only deploy key to the GitHub repo (Settings > Deploy keys), then re-run this script:"
    echo ""
    cat "$SSH_DIR/id_ed25519.pub"
    echo ""
    exit 3
  fi
fi
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR"

log "Starting the staging stack (builds the image, may take a few minutes)..."
cd "$APP_DIR"
sudo -u "$DEPLOY_USER" docker compose -f docker-compose.staging.yml up --build -d --wait app
sudo -u "$DEPLOY_USER" docker compose -f docker-compose.staging.yml up -d mailhog s3-init

if [[ "$SEED_DB" == "true" ]]; then
  log "Seeding the staging database (destructive on each run)..."
  sudo -u "$DEPLOY_USER" docker compose -f docker-compose.staging.yml --profile tools run --rm db-init
fi

log "Configuring nginx..."
cat > /etc/nginx/sites-available/germany-assist-staging <<NGINX
server {
  listen 80;
  server_name ${SERVER_NAME};

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
NGINX
ln -sf /etc/nginx/sites-available/germany-assist-staging /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

log "Enabling firewall (SSH, HTTP, HTTPS only)..."
ufw allow 22/tcp >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
ufw --force enable

echo ""
log "Staging is up: http://$(curl -fsS -m 3 ifconfig.me 2>/dev/null || echo '<server-ip>')"
log "Health check:  curl http://127.0.0.1:3000/health"
log "App files:     ${APP_DIR} (owned by ${DEPLOY_USER})"
echo ""
log "Next steps:"
log " 1. DNS: point your staging domain at this server's IP."
log " 2. TLS:  apt install certbot python3-certbot-nginx && certbot --nginx -d <your-domain>"
log " 3. Set STAGING_ORIGIN=https://<your-domain> in ${APP_DIR}/.env and redeploy."
log " 4. CI:   add GitHub variable SERVER_DOMAIN (this IP/domain) and secret DEPLOY_KEY"
log "          (private key authorized for ${DEPLOY_USER}@this-server) to enable auto-deploy on push."
