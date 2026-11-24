---
name: deployment
description: Deploy, operate, seed, or troubleshoot the Germany Assist staging server. Use for anything involving the Hetzner box, the Docker Compose stack, GitHub Actions, nginx routing, the staging database, or the test accounts.
---

# Staging deployment and operations

## Branch policy

- `main` is the deploy branch. It intentionally contains **`f650557` application
  logic plus two runtime guards**:
  - no `testdouble` import in `server/src/sockets/services/notificationService.js`
    (dev-only dependency, absent from the production image);
  - lazy `Resend` initialisation in `server/src/services/email/email.service.js`
    (a missing `RESEND_API_KEY` must not crash the process on import).
- The previous upstream line (new home page, dashboard rewrite, Vitest suite) is
  preserved at `archive/main-27c6fa1`. Do not merge it into `main` unless that is
  an explicit product decision: merging brings that feature logic back.
- Deploy by pushing to `main`. `.github/workflows/deploy.yml` runs:
  1. `staging` — builds the compose stack and curls `/health` (blocking gate);
  2. `deploy-droplet` — SSH to the server, `git reset --hard origin/main`,
     rebuilds and restarts the compose stack.

## Server

- Host: **`167.233.108.26`** (Hetzner). App dir: `/var/www/germany-assist`.
- SSH: user `deploy`, key `~/.ssh/germany-assist-deploy` (this is the key in the
  `DEPLOY_KEY` secret of the `production` environment). Root is only needed for
  nginx and is a local-only key.
- GitHub environment `production` holds:
  - variable `SERVER_DOMAIN=167.233.108.26`
  - secret `DEPLOY_KEY` (the private deploy key above)
- **Never** point `SERVER_DOMAIN` at `www.germany-assist.com`: that name has no
  DNS record. The apex `germany-assist.com` points at a stale Azure IP, not this
  server. TLS/domain wiring is still pending.

## Runtime layout

- Compose file: `docker-compose.staging.yml` (app, postgres, redis, localstack,
  s3-init, mailhog). Containers are named `germany-assist-staging-*`.
- The app publishes **`127.0.0.1:3002`**, not 3000. Port 3000 belongs to the
  unrelated `abcgerman-app` on the same host. Do not stop or rebind it.
- nginx: `/etc/nginx/sites-available/germany-assist-staging` is the port-80
  `default_server` and proxies to `127.0.0.1:3002`; `abcgerman.de` keeps its own
  server block. Backups live at `/root/germany-assist-staging.bak.*`.
- Useful commands (on the server, as `deploy`):

```bash
cd /var/www/germany-assist
docker compose -f docker-compose.staging.yml ps
docker compose -f docker-compose.staging.yml logs -f app
docker compose -f docker-compose.staging.yml up --build -d --wait app
docker compose -f docker-compose.staging.yml exec -T app node src/database/seeds/runTestDataSeed.js
```

- `npm run dbInit` / the compose `db-init` profile is **destructive** (force
  sync + reseed). Never run it on staging unless wiping data is intended.

## Test data

- `server/src/database/seeds/runTestDataSeed.js` seeds realistic data across
  users, providers, employers, services, timelines, variants, orders, reviews,
  favorites, disputes, payouts, verification requests, chats, subscribers,
  notifications, posts, comments, events, coupons, assets, tokens and Stripe
  events.
- It then runs `devAccounts.seed.js`, which creates one verified account per
  role. The credentials live in that file (client, provider root/rep, employer
  root/rep, admin, super_admin) — read them there rather than duplicating them
  here.
- App URL on the server: <http://167.233.108.26/> (nginx catch-all → port 3002).
- Login endpoint: `POST /api/auth/login` with `{ "email", "password" }`.

## Known issues

- `f650557` has a one-line auth bug: `auth.controller.js` declares `results` but
  destructures `result`, so login returns 500. `main` keeps that snapshot; add
  the one-line fix only if login must work.
- `/health` is registered after the SPA catch-all in this snapshot. It still
  returns 200 (the SPA fallback), so the healthcheck and CI gate pass.
- Client and server lockfiles were refreshed for cross-platform optional deps so
  `npm ci` works in the image. Do not regenerate them with an old npm.
