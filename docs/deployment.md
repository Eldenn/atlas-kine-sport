# Deployment

The site runs as two Node.js apps on the Hostinger "Unlimited Web Hosting" plan (5 Node.js websites included), both built from this repository:

| App        | Domain                          | Deploys from               | `VITE_SITE_ENV` | Indexed |
| ---------- | ------------------------------- | -------------------------- | --------------- | ------- |
| Staging    | `staging.atlas-kine-sport.fr`   | `main`, on every merge     | `staging`       | No      |
| Production | `atlas-kine-sport.fr` (+ `www`) | `production`, on promotion | _(unset)_       | Yes     |

## Flow

```
feat/… ──PR, squash──▶ main ──auto-deploy──▶ staging
                         │
                         └── "Promote to production" (Actions) ──▶ production ──auto-deploy──▶ live site
```

1. Work on a `type/topic` branch, open a PR, run `mise run check`, squash-merge into `main` (see `AGENTS.md`).
2. Hostinger rebuilds the staging app. Check the change there (every page, the contact form, mobile).
3. GitHub → Actions → **Promote to production** → _Run workflow_ with the defaults. The workflow fast-forwards `production` to `main`; Hostinger rebuilds the production app.
4. Check the live site.

Nothing is ever committed to `production` by hand: it only moves through the workflow, and only to commits that are on `main`.

## Rollback

Hostinger keeps only the live build, so a rollback is a new deployment of an older commit:

1. Find the last good commit on `main` (GitHub commits list, or the production app's **Deployments** page in hPanel, which shows the commit hash of each build).
2. Actions → **Promote to production** → `ref` = that SHA, tick **rollback**.
3. Fix the problem on `main` as usual; the next promotion moves `production` forward again.

A failed build never replaces the live version: Hostinger only switches to a build that succeeded.

## Hostinger settings (both apps)

| hPanel setting   | Value                                        |
| ---------------- | -------------------------------------------- |
| Application type | Nitro                                        |
| Node version     | 22 (keep in sync with `mise.toml`)           |
| Root directory   | `/`                                          |
| Package manager  | pnpm                                         |
| Build script     | `build`                                      |
| Output directory | `.output`                                    |
| Entry file       | `server/index.mjs`                           |
| Branch           | `main` (staging) / `production` (production) |

## Environment variables

Set per app in hPanel → the website → **Environment variables**. They are available to both the build and the running server; saving them redeploys the app.

| Variable                   | Staging                       | Production                 |
| -------------------------- | ----------------------------- | -------------------------- |
| `VITE_SITE_ENV`            | `staging`                     | leave unset                |
| `HOSTINGER_MAIL_API_TOKEN` | Mail API token (same as prod) | Mail API token             |
| `HOSTINGER_MAILBOX_ID`     | sending mailbox ID (same)     | sending mailbox ID         |
| `CONTACT_TO`               | the developer's address only  | the practice's address(es) |

`VITE_SITE_ENV=staging` is read at build time (pages are prerendered) and does three things: a `noindex, nofollow` meta on every page, a `robots.txt` that disallows everything, and a `[TEST]` prefix on contact emails. It also shows a small "Préproduction" badge. Unset means production, so forgetting it can only expose staging, never hide the live site.

`VITE_SITE_ENV` is the only variable allowed a `VITE_` prefix, because it is not a secret: anything prefixed `VITE_` can end up in the browser bundle.

## Staging protection

- **Always on**: `noindex` and `robots.txt` (above). Canonical URLs point to `https://atlas-kine-sport.fr`, so even a leaked staging link credits the live site.
- **Password (optional)**: hPanel → staging website → Advanced → **Password Protect Directories** on `public_html`. Hostinger rewrites `public_html/.htaccess` on each deployment, so check after a deploy that the password prompt still appears (private window). If it does not, rely on `noindex` and keep the staging URL private.

## Domains and SSL

- Production: the `atlas-kine-sport.fr` website in hPanel, with `www` redirecting to the bare domain. `domain.tld` and `www.domain.tld` each run a Node process, which counts toward the plan's process limit.
- Staging: a subdomain website (`staging`), created as its own website, not a subfolder.
- SSL: hPanel → Security → SSL, free certificate on each website (production, `www`, staging). Force HTTPS on all of them.
- DNS: if the domain's nameservers are Hostinger's, records are created automatically. Otherwise add an `A` record for `staging` (and `@`/`www`) pointing to the IP shown in hPanel.

## Limits to keep in mind

- Apps stop after a period without traffic and restart on the next request. Pages are prerendered, so a cold start costs only the server start, not any rendering.
- One deployment at a time per app; install and build are each limited to 15 minutes.
- No inbound WebSockets, no background workers, 120-second request timeout.
- Build logs (last 10) under the website's **Deployments**; server output under **Runtime logs**.
