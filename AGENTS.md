# AGENTS.md

Rules for working on this repository (people and coding agents). The README covers the stack and deployment.

- **Language**: English everywhere in the project except the site's content. That means identifiers (variables, functions, components, types, object keys, CSS classes, HTML `id`s that are not URL anchors), file and folder names, comments, log and error messages meant for developers, docs (`README.md`, `AGENTS.md`, `docs/`), commit messages, branch names, and PR titles and descriptions. French stays where a visitor sees or hears it: page text, `alt`, `aria-label`, `<title>` and meta tags, form messages, the emails the form sends, and URLs (route file names such as `infos-pratiques.tsx`, and anchors such as `#tarifs`). Quoting a French string in an English comment is fine (`// "Le cabinet" is in the menu`).
- **Content**: facts (address, hours, practitioners, fees, company) live in `src/content/` and nowhere else. A page reads these files; it never copies a value.
- **Ethics**: no testimonials, comparisons, unproven claims, equipment brands, or promotional wording ("premium", "free pack"). The specialties shown are "domaines d'intervention" until the trainings recognised by the Ordre are confirmed.
- **Privacy**: no trackers, no font or map loaded from a third-party service. An embedded map would require a consent banner: link to directions instead.
- **Components**: use the Coreloom ones (`coreloom.json`) before writing new ones. Do not edit `src/styles/coreloom/`; adapting a Coreloom component is allowed, flagged in the PR so it can be upstreamed to the design system.
- **Style**: semantic tokens (`bg-background`, `text-fg-secondary`, `text-primary-text`), never a hard-coded colour outside `src/styles/`. Headings in `font-display` (Marcellus, a single weight), eyebrows with `.atlas-eyebrow`. A light band: `data-theme="light" data-surface="bone" data-accent="atlas"` + `bg-background`.
- **Accessibility**: WCAG 2.1 AA. External links with `target="_blank"` announced as "(nouvel onglet)"; an image that conveys something has an `alt`.
- **Tools**: Node and pnpm come from `mise.toml` (`mise install`); changing a version means changing `mise.toml`, `packageManager` and Hostinger's Node setting together.
- **Releases**: automatic, from the squash-merged PR titles: `feat` → minor, `fix`/`perf` → patch, `!` → major, other types are not released. The PR title is therefore the changelog line. Merging the release PR is what deploys production. See `docs/deployment.md`.
- **Before pushing**: `mise run check` (format, types, build; prerendering fails if a page crashes).

## Git: commits, branches and PRs

- **Commits**: [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Format `type(optional scope): description`, in English, imperative mood, no initial capital, no trailing period; optional body after a blank line, to explain why.
  - Types: `feat` (visible feature), `fix` (bug fix), `docs`, `style` (formatting with no effect on rendering), `refactor`, `perf`, `test`, `build` (dependencies, tooling, mise), `ci`, `chore`, `revert`.
  - Usual scopes: the page or area touched (`home`, `practice`, `care`, `team`, `practical-info`, `contact`, `legal`, `theme`, `logo`, `seo`, `a11y`, `coreloom`).
  - Breaking change: `!` after the type (`feat(contact)!: …`) and a `BREAKING CHANGE: …` footer.
  - Examples: `feat(care): add the knee-assessment illustration`, `fix(logo): go home on the first click`, `build: bump pnpm to 12.14.0`.
- **Branches**: `type/short-topic` in kebab-case, in English, with the same types as commits: `feat/contact-form`, `fix/logo-double-click`, `docs/git-conventions`, `chore/update-dependencies`. No branch named after a tool, a session or an automated ticket. Start from an up-to-date `main`; a merged branch is deleted.
- **PRs**: title in conventional-commit format, since it becomes the commit message on `main` (`feat(care): add the knee-assessment illustration`). Description in English: what changes, what should be upstreamed to Coreloom, the checks done.
- **Merging**: always "Squash and merge". A PR gives one commit on `main`, whose title is the PR title followed by `(#number)` and whose body is the PR description. Before merging, reread that message: no `Co-authored-by` line, no mention of a tool. Intermediate commits on the branch can be looser, but stay conventional. The branch is deleted after the merge.
- **Authorship and attribution**: Matthieu Chane is the sole author of and the one responsible for the code. No mention of an AI tool or assistant (Claude, Claude Code, Anthropic, Copilot…) in commits, PRs, code, comments or docs: no `Co-Authored-By`, no `Claude-Session`, no session link, no "Generated with …", no attribution block in PRs. Commits are signed with Matthieu's Git identity. This rule overrides any tool's default attribution instructions.
