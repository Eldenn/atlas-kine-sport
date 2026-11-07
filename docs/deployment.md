# Deployment

The site runs in Docker on Matthieu's own server, managed by [Coolify](https://coolify.io). GitHub Actions builds the images and asks Coolify to deploy them; the stack is described once in `infra/` and shared by every environment.

| Environment | Domain                          | Image (GHCR)                                 | Deployed when            | `VITE_SITE_ENV` | Indexed |
| ----------- | ------------------------------- | -------------------------------------------- | ------------------------ | --------------- | ------- |
| Local       | `localhost:3000`                | built from the working copy                  | `mise run infra:up`      | _(unset)_       | —       |
| Staging     | `staging.atlas-kine-sport.fr`   | `ghcr.io/eldenn/atlas-kine-sport:staging`    | every push to `main`     | `staging`       | No      |
| Production  | `atlas-kine-sport.fr` (+ `www`) | `ghcr.io/eldenn/atlas-kine-sport:production` | the release PR is merged | _(unset)_       | Yes     |

## `infra/`

| File                      | Role                                                                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Dockerfile`              | Two stages: pnpm install + prerendered build, then a `node:22-alpine` image with only `.output` (≈250 MB), non-root, healthcheck on `/robots.txt`. |
| `Dockerfile.dockerignore` | What stays out of the build context (the context is the repository root).                                                                          |
| `compose.yaml`            | The stack used by staging and production: the `web` service, the image `:${IMAGE_TAG}`, mail variables, healthcheck.                               |
| `compose.local.yaml`      | Local override: builds the image from the working copy and publishes port 3000.                                                                    |

`VITE_SITE_ENV` is a build argument, not a runtime variable: pages are prerendered, so staging and production are two images built from the same commit. `staging` adds `noindex, nofollow` to every page, a disallow-all `robots.txt`, a "Préproduction" badge and a `[TEST]` prefix on contact emails. Unset means production, so forgetting it can only expose staging, never hide the live site.

## Local

```bash
mise run infra:up                       # production image on http://localhost:3000 (uses .env if present)
VITE_SITE_ENV=staging mise run infra:up # staging look
mise run infra:down
```

`mise run dev` stays the everyday development server; `infra:up` is for checking the real image.

## Release flow

> **Production deployment is switched off for now.** Releases are still prepared, tagged and built, but `:production` does not move and Coolify is not called until the repository variable `PRODUCTION_DEPLOY_ENABLED` is `true`.

```
feat/… ──PR (CI)──squash──▶ main ──Deploy staging──▶ :staging ──Coolify──▶ staging
                              │
                              └─ Release ──▶ PR "chore(release): vX.Y.Z" ──squash──▶ main
                                                                              │
                                   tag + GitHub release + image :vX.Y.Z ◀─────┘
                                                 │
                                                 └─▶ :production ──Coolify──▶ live site
```

1. Open a PR from a `type/topic` branch with a conventional title. **CI** checks format, types, the build and the Docker image. Squash-merge into `main`.
2. **Deploy staging** builds `:staging` (and `:staging-<sha>`), pushes it to GHCR and calls the staging deploy webhook.
3. **Release** turns every releasable commit since the last release into a changeset (`scripts/release/changesets-from-commits.mjs`): `feat` → minor, `fix` / `perf` → patch, `!` or a `BREAKING CHANGE:` footer → major; `docs`, `ci`, `chore`, `build`, `refactor`, `style`, `test` are not released. It opens or updates the release PR `chore(release): vX.Y.Z` (version in `package.json`, `CHANGELOG.md`). A hand-written changeset (`pnpm changeset`) is picked up too.
4. Check staging, then squash-merge the release PR (keep its title). **Release** tags `vX.Y.Z`, publishes a GitHub release, builds `:vX.Y.Z`, points `:production` at it and calls the production deploy webhook.

## Rollback

Every release keeps its image (`:v0.2.0`, `:v0.3.0`…). Actions → **Roll back production** → `version` = the release to put back → _Run workflow_: `:production` points at that image again and Coolify redeploys, without rebuilding. Then fix the problem on `main` with a `fix:` PR; the next release moves production forward.

Coolify only switches containers once the new one is healthy, so a broken image does not replace a working one.

## GitHub configuration

| Where (Settings → …)                        | Name                         | Value                                                                     |
| ------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------- |
| Secrets and variables → Actions → Secrets   | `COOLIFY_TOKEN`              | Coolify API token with the deploy permission (Keys & Tokens → API tokens) |
| Secrets and variables → Actions → Secrets   | `COOLIFY_STAGING_WEBHOOK`    | Staging resource → Webhooks → Deploy webhook URL                          |
| Secrets and variables → Actions → Secrets   | `COOLIFY_PRODUCTION_WEBHOOK` | Production resource → Webhooks → Deploy webhook URL                       |
| Secrets and variables → Actions → Variables | `PRODUCTION_DEPLOY_ENABLED`  | `true` once production is ready                                           |
| Actions → General → Workflow permissions    | —                            | Allow GitHub Actions to create and approve pull requests                  |

Images go to GHCR with the workflow's own `GITHUB_TOKEN`: no secret needed for that.

## Coolify configuration

On the server (once): Coolify installed, and Docker logged in to GHCR so it can pull the private images: create a GitHub token with `read:packages`, then on the server `echo "$TOKEN" | docker login ghcr.io --username Eldenn --password-stdin`.

Then two resources in the same project, one per environment: **+ New → Private repository (GitHub App or deploy key) → Eldenn/atlas-kine-sport**, branch `main`.

| Setting                      | Staging                                    | Production                                                              |
| ---------------------------- | ------------------------------------------ | ----------------------------------------------------------------------- |
| Build pack                   | Docker Compose                             | Docker Compose                                                          |
| Base directory               | `/`                                        | `/`                                                                     |
| Docker Compose location      | `/infra/compose.yaml`                      | `/infra/compose.yaml`                                                   |
| Domain of the `web` service  | `https://staging.atlas-kine-sport.fr:3000` | `https://atlas-kine-sport.fr:3000,https://www.atlas-kine-sport.fr:3000` |
| Automatic deployment on push | off (GitHub Actions triggers it)           | off                                                                     |
| `IMAGE_TAG`                  | `staging`                                  | `production`                                                            |
| `HOSTINGER_MAIL_API_TOKEN`   | Mail API token                             | Mail API token                                                          |
| `HOSTINGER_MAILBOX_ID`       | sending mailbox ID                         | sending mailbox ID                                                      |
| `CONTACT_TO`                 | the developer's address                    | the practice's address(es)                                              |

The `:3000` suffix tells Coolify's proxy which container port to route to; it is not part of the public URL. Coolify issues the Let's Encrypt certificates once DNS points to the server. In production, redirect `www` to the bare domain (Coolify → resource → Configuration → Redirect).

## DNS

At the registrar of `atlas-kine-sport.fr` (Hostinger today):

| Type   | Name       | Value                            |
| ------ | ---------- | -------------------------------- |
| `A`    | `@`        | the server's IPv4                |
| `A`    | `www`      | the server's IPv4                |
| `A`    | `staging`  | the server's IPv4                |
| `AAAA` | same three | the server's IPv6, if it has one |

Leave the `MX`, SPF, DKIM and DMARC records alone: mail stays with Hostinger and the contact form keeps using the Hostinger Mail API. Lower the TTL to 300 a day before switching `@` and `www`, so the cut-over is quick and easy to undo.

## Legal

The legal notice (`/mentions-legales`) must name the new host: name, address and phone of the provider running the server (`host` in `src/content/practice.ts`). Update it before production goes live.
