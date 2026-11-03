import { createFileRoute } from '@tanstack/react-router'

import { practitioners, SITE_URL } from '@/content/cabinet'

// The sitemap search engines read (announced in public/robots.txt). Served by the Node server:
// Nitro only serves the public files it knew about when it built, and TanStack's own sitemap is
// written after that.
const paths = [
  '/',
  '/cabinet',
  '/soins',
  '/equipe',
  ...practitioners.map((p) => `/equipe/${p.slug}`),
  '/infos-pratiques',
  '/contact',
  '/mentions-legales',
  '/confidentialite',
]

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const urls = paths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
        return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
      },
    },
  },
})
