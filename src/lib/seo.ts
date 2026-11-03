import { SITE_URL } from '@/content/cabinet'

/** Title, description, canonical URL and Open Graph tags for a page's `head`. */
export function seo({
  path,
  title,
  description,
}: {
  path: string
  title: string
  description: string
}) {
  const fullTitle = path === '/' ? title : `${title} · Atlas Kiné Sport`
  const url = SITE_URL + path
  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'fr_FR' },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
