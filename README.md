# Atlas Kiné Sport

Website of Atlas, a sports physiotherapy practice in Chasseneuil-du-Poitou, France: [atlas-kine-sport.fr](https://atlas-kine-sport.fr).

- **Stack**: [TanStack Start](https://tanstack.com/start) (React 19, TanStack Router and Form), Tailwind CSS v4, [Coreloom UI](https://github.com/Eldenn/coreloom-ui) components, Nitro for the Node server.
- **Rendering**: every page is prerendered at build time (`prerender.crawlLinks`); the Node server handles redirects from the old site's URLs, the sitemap and the contact form.
- **Art direction**: the practice's moodboard (mineral blue `#121A26`, bone `#EBE7E3`, antique gold `#B0903D`, Marcellus / Montserrat / Cormorant Garamond). See `src/styles/atlas.css`.
- **Language**: the code, comments, docs and Git history are in English; the site's content is in French. See `AGENTS.md`.

## Development

Tools are pinned by [mise](https://mise.jdx.dev) in `mise.toml`: Node 22 (the version in the Docker image, `infra/Dockerfile`) and pnpm 12.13.

```bash
mise install             # Node and pnpm at the right versions
mise run dev             # http://localhost:3000 (installs dependencies first)
mise run check           # before pushing: format, types, build
mise run start           # production build, served as in production
mise run infra:up        # the real Docker image, as deployed
mise tasks               # every task
```

`pnpm install` only installs versions published at least 14 days ago (`pnpm-workspace.yaml`). The Docker image does not use mise: it reads `package.json` and `pnpm-lock.yaml`.

## Where things are

| Path                                    | Contents                                                                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `src/content/practice.ts`               | Everything about the practice: address, hours, practitioners (RPPS, Doctolib), company, host                            |
| `src/content/fees.ts`                   | Services outside reimbursed care (information only, never promoted: code of ethics)                                     |
| `src/content/photos.ts`                 | Photo slots; the shot list is in `docs/photo-shoot.md`                                                                  |
| `src/routes/`                           | One page per file; `a-propos`, `services`, `delman-ahmed-mustafa`, `moeine-khalifeh` redirect (301) the old site's URLs |
| `src/components/atlas/`                 | Site-specific components (logo, page intro, Doctolib buttons, photo slot)                                               |
| `src/components/`, `src/components/ui/` | Installed Coreloom components (shadcn registry), listed in `coreloom.json`                                              |
| `src/styles/coreloom/`                  | Coreloom styles, not to be edited: the Atlas look is set in `atlas.css` and `atlas-accent.css`                          |
| `scripts/`                              | Asset generators (Atlas illustration, background texture) and the Coreloom sync script                                  |

Route file names are the site's French URLs (`/soins`, `/infos-pratiques`); the components inside them have English names.

## Updating Coreloom UI

```bash
pnpm dlx shadcn@latest add @coreloom/showcase --overwrite   # from the registry
mise run coreloom:sync ../coreloom-ui                      # or from a local clone, for every item in coreloom.json
```

Installed files are ours: review the diff before committing.

## Deploying

Docker images built by GitHub Actions, deployed by [Coolify](https://coolify.io) on our own server; the stack lives in `infra/`. **Staging** (`staging.atlas-kine-sport.fr`, never indexed) follows every merge into `main`; **production** (`atlas-kine-sport.fr`) is released by merging the `chore(release): vX.Y.Z` PR that the Release workflow keeps up to date from the PR titles. Infra, secrets, Coolify and DNS settings, rollback: [`docs/deployment.md`](docs/deployment.md).

Without the mail variables, `pnpm dev` prints the contact message in the terminal instead of sending it; in production, the form says sending is unavailable and points to the phone number.

## Content rules

The French code of ethics for physiotherapists (R.4321-67 and following) applies to the site: no patient testimonials, no comparison with other practices, no unproven claims, no equipment brands, and fees presented as information. RPPS numbers (and Ordre numbers, to be added) appear on the practitioner pages and in the legal notice.
