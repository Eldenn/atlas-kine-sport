import { createFileRoute } from '@tanstack/react-router'

import { SITE_URL } from '@/content/practice'
import { isStaging } from '@/lib/site-env'

// Served by the Node server rather than from public/, so the staging app can tell search engines
// to stay out while production invites them and points to the sitemap.
const body = isStaging
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }),
    },
  },
})
