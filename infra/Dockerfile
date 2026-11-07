# syntax=docker/dockerfile:1
# The site's image, the same for local, staging and production. Build from the repository root:
#   docker build -f infra/Dockerfile --build-arg VITE_SITE_ENV=staging .
# VITE_SITE_ENV is read at build time (every page is prerendered), so staging and production are
# two images built from the same commit. Leave it empty for production.

FROM node:22-alpine AS build
WORKDIR /app
# pnpm at the version pinned in package.json ("packageManager") and mise.toml.
RUN npm install --global --no-fund --no-audit pnpm@12.13.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_SITE_ENV=""
ENV VITE_SITE_ENV=${VITE_SITE_ENV}
RUN pnpm build

# Runtime: only the Nitro output, which bundles its own dependencies.
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
COPY --from=build --chown=node:node /app/.output ./.output
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/robots.txt').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"
CMD ["node", ".output/server/index.mjs"]
