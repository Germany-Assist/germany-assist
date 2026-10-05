# Staging Deployment

This document describes how the Germany Assist monorepo is deployed to staging.

## Architecture

The repo is a same-origin single-process app: the Vite client builds into
`server/public` (gitignored) and the Express server serves both the SPA and the
API on one port. The client talks to the API via the relative path `/api`, so
no cross-origin configuration is needed.

Staging is a fully containerized stack, built from the repo and run with
Docker Compose — the same stack runs on a laptop and on a staging droplet.

```
GitHub push (main)
   └─> .github/workflows/deploy.yml
        ├─ job "staging": compose up --build --wait app + curl /health (build & smoke gate)
        └─ job "deploy-droplet": only when vars.SERVER_DOMAIN is set
             └─ SSH: git pull + compose up --build --wait app

Staging stack (docker-compose.staging.yml)
 ├─ app            : Germany Assist API + SPA on port 3000 (image built from Dockerfile)
 ├─ postgres       : germany_assist_staging DB (no published ports)
 ├─ redis          : BullMQ/cache (no published ports)
 ├─ localstack     : S3-compatible storage, persisted volume (no published ports)
 ├─ s3-init        : one-shot, creates the germany-assist-staging bucket
 └─ mailhog        : SMTP sink on 1025, web UI on http://localhost:8025
```

Files involved:

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage: builds the client bundle, then the server runtime image |
| `docker-compose.staging.yml` | Full staging stack with staging-grade env baked in |
| `.dockerignore` | Keeps the build context small and secrets out of the image |
| `.github/workflows/deploy.yml` | CI smoke test + optional droplet deploy |
| `docker-compose.yml` | Dev-only infra (unchanged role), ports bound to 127.0.0.1 |

## Run staging locally

```bash
docker compose -f docker-compose.staging.yml up --build -d --wait app
docker compose -f docker-compose.staging.yml up -d mailhog s3-init
curl -fsS http://127.0.0.1:3000/health
```

(The first command waits for `app` to be healthy; the second starts the
one-shot S3 bucket creator and Mailhog, which `--wait` would otherwise treat
as a failure when they exit.)

- App + SPA: http://localhost:3000
- Mailhog UI: http://localhost:8025 (only receives mail sent over SMTP; note
  the current email service uses the Resend HTTP API, so real sends need
  `RESEND_API_KEY` + `SEND_EMAILS=true`)

Optional secrets (Stripe, Google OAuth, Resend) go in a root `.env` file
(gitignored), picked up automatically by compose:

```
STAGING_ORIGIN=http://staging.germany-assist.com
STRIPE_SK=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
RESEND_API_KEY=re_...
SEND_EMAILS=true
```

To rebuild the VITE_* values into the bundle, add build args to the `app`
service in `docker-compose.staging.yml` (see `Dockerfile` ARGs) and rebuild.

## Seed the staging database

`db-init` is a one-shot profile service that force-syncs and seeds the staging
DB (destructive — wipes existing staging data):

```bash
docker compose -f docker-compose.staging.yml --profile tools run --rm db-init
```

Daily schema changes are handled automatically: the server runs
`sequelize.sync({ alter: true })` on startup. Seeding is manual because it is
destructive.

Useful commands:

```bash
docker compose -f docker-compose.staging.yml logs -f app       # tail app logs
docker compose -f docker-compose.staging.yml exec postgres \
  psql -U postgres -d germany_assist_staging                   # inspect DB
docker compose -f docker-compose.staging.yml down              # stop (keep data)
docker compose -f docker-compose.staging.yml down -v           # stop and wipe data
```

## Hosting vendor (chosen: Hetzner Cloud)

The staging stack is self-contained (app + Postgres + Redis + LocalStack in one
compose project), so a single small VPS is the right shape. Requirements:
2 vCPU / 4 GB RAM (the Docker image build peaks around 3 GB), ~40 GB disk.

Vendor comparison for that shape (October 2026 prices):

| Vendor | Instance | Price/mo | Notes |
|---|---|---|---|
| **Hetzner (chosen)** | CX23 (2 vCPU / 4 GB / 40 GB) | **€5.49 (~$6.50)** | 20 TB traffic included; EU only at this tier; frequently sold out — watch live stock at [radar.iodev.org/cloud-status](https://radar.iodev.org/cloud-status) (per-minute tracker, free email/Discord restock alerts) and order the moment it appears |
| Contabo | Cloud VPS 4 GB class | ~$5.50-7 | Cheapest per GB but oversold CPUs; fine as a fallback |
| DigitalOcean | Basic 4 GB droplet | $24 | Best if you want US region or DO managed services |
| Vultr / Linode(Akamai) | 4 GB instances | $18-24 | More regions, higher price |
| Railway / Render / Fly.io | PaaS app + managed Postgres | $21-34 | Don't fit the multi-container compose stack; 4-5x cost |

Hetzner order: Cloud > Shared vCPU (cost-optimized) > **CX23**, image
**Ubuntu 24.04**, location Falkenstein/Nuremberg/Helsinki, add your SSH key.
If CX23 is unavailable, the CAX11 (ARM, 2 vCPU / 4 GB, €5.99) also works —
the image is multi-arch (node:22-slim, redis, postgres, localstack all
publish ARM64 builds).

## Deploy to the staging server (Hetzner CX23)

### One-time bootstrap

After the server is created, SSH in as root and run:

```bash
curl -fsSL https://raw.githubusercontent.com/Germany-Assist/germany-assist/main/deploy/bootstrap-staging.sh -o bootstrap.sh
bash bootstrap.sh
```

(If the repo is private, `scp deploy/bootstrap-staging.sh root@<server-ip>:`
from your machine instead of curling.) Or, from a checkout of this repo:
`bash deploy/bootstrap-staging.sh`.

The script installs Docker/nginx/ufw, creates the `deploy` user, clones the
repo (printing an SSH deploy key to add to GitHub if the clone fails), builds
and starts the stack, seeds the database, configures the nginx reverse proxy,
and locks down the firewall. Re-running it is safe and idempotent.

### Wire up CI auto-deploy

In GitHub repo Settings add:

- Repository variable `SERVER_DOMAIN` = server IP or hostname
- Secret `DEPLOY_KEY` = private SSH key authorized for user `deploy`
  (generate one with `ssh-keygen`, append the public key to
  `/home/deploy/.ssh/authorized_keys` on the server, keep the private key
  only in the GitHub secret)
- (optional) Environment `staging` with protection rules

From then on every push to `main` runs the CI smoke test and deploys over SSH
(`docker compose up --build --wait app`). The app listens on `127.0.0.1:3000`
behind nginx.

### DNS and TLS

1. Point your staging domain (e.g. `staging.germany-assist.com`) at the server IP.
2. TLS: `apt install certbot python3-certbot-nginx && certbot --nginx -d staging.germany-assist.com`
3. Put `STAGING_ORIGIN=https://staging.germany-assist.com` in `${APP_DIR}/.env`
   on the server so CORS and cookies use the right origin, then redeploy
   (push to `main`, or `docker compose -f docker-compose.staging.yml up -d app`).

Postgres, Redis, and LocalStack are not published to the host in the staging
compose, so they are unreachable from
outside the docker network.

## Notes and risks

- Staging credentials in `docker-compose.staging.yml` (DB password, Redis
  password, JWT secrets) are intentionally weak and committed — fine for
  staging, never for production. Production needs proper secret management and
  a separate compose.
- `client` build-time env (`VITE_*`) is baked into the bundle at image build;
  changing them requires a rebuild (`up --build`).
- Stripe webhooks need either the Stripe CLI forwarding to
  `http://127.0.0.1:3000/payments/webhook` on the server, or a public webhook
  endpoint with `STRIPE_WEBHOOK_SECRET` set.
- The app runs as a single container by design: socket.io keeps state in memory
  and BullMQ workers assume one instance. Do not scale replicas without
  changing that code.
- LocalStack S3 data persists in the `staging_localstack_data` volume; it
  survives `down` but not `down -v`.
