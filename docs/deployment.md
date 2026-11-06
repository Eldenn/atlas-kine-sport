# Deployment

The site runs as two Node.js apps on the Hostinger "Unlimited Web Hosting" plan (5 Node.js websites included), both built from this repository:

| App        | Domain                          | Deploys from             | `VITE_SITE_ENV` | Indexed |
| ---------- | ------------------------------- | ------------------------ | --------------- | ------- |
| Staging    | `staging.atlas-kine-sport.fr`   | `main`, on every merge   | `staging`       | No      |
| Production | `atlas-kine-sport.fr` (+ `www`) | `production`, on release | _(unset)_       | Yes     |

## Flow

Releases are managed with [Changesets](https://github.com/changesets/changesets).

> **Production deployment is switched off for now.** Releases are still prepared and tagged, but `production` does not move until the repository variable `PRODUCTION_DEPLOY_ENABLED` is set to `true` (Settings → Secrets and variables → Actions → Variables). Until then only staging deploys.

```
feat/… + changeset ──PR, squash──▶ main ──Hostinger──▶ staging
                                     │
                                     └─ Release workflow ──▶ PR "chore(release): vX.Y.Z" (chore/release)
                                                                  │ squash-merge
                                                                  ▼
                                         tag vX.Y.Z + GitHub release ──▶ production ──Hostinger──▶ live site
```

1. On a `type/topic` branch, describe the change for the changelog: `mise run changeset` (or `pnpm changeset`), pick `patch` (fix, text), `minor` (new page or section) or `major` (redesign), write one line in English. Commit the generated `.changeset/*.md` with the rest. A change with nothing to release (docs, CI) needs no changeset.
2. Open the PR, run `mise run check`, squash-merge into `main` (see `AGENTS.md`). Hostinger rebuilds staging.
3. The **Release** workflow opens or updates the release PR `chore(release): vX.Y.Z` on `chore/release`: it bumps `package.json` and writes `CHANGELOG.md` from every changeset merged since the last release. Several feature PRs pile up in the same release PR.
4. Check staging. When it is right, squash-merge the release PR. The workflow then tags `vX.Y.Z`, publishes a GitHub release and moves `production` to that commit; Hostinger rebuilds the production app.
5. Check the live site.

Nothing is ever committed to `production` by hand: it only moves through the workflows, and only to commits that are on `main`.

Repository setting needed once: Settings → Actions → General → Workflow permissions → tick **Allow GitHub Actions to create and approve pull requests** (the workflow opens the release PR).

## Rollback

Hostinger keeps only the live build, so a rollback is a new deployment of an older release:

1. Pick the last good release under GitHub → Releases (or a commit hash from the production app's **Deployments** page in hPanel).
2. Actions → **Roll back production** → `ref` = that tag (`v0.2.0`) or SHA → _Run workflow_.
3. Fix the problem on `main` with a changeset as usual; the next release moves `production` forward again.

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
