import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Every page is rendered to HTML at build time, starting from "/" and following its links:
      // search engines get full pages and the server has almost nothing to render.
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
    }),
    // Builds .output/server/index.mjs, the Node server the Docker image runs (infra/Dockerfile).
    // Pages, scripts and styles are also written gzip- and brotli-compressed, and the server sends the
    // smallest one the browser accepts: about a third of the bytes, with no work per request.
    nitro({ compressPublicAssets: { gzip: true, brotli: true } }),
    react(),
  ],
})
