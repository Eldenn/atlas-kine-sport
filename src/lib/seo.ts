import { SITE_URL } from '@/content/practice'
import { breadcrumbNode, jsonLdScript } from '@/lib/structured-data'

/** The image shown when a page is shared (messaging apps, social networks): 1200 × 630. */
const OG_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  width: '1200',
  height: '630',
  alt: 'Atlas Kiné Sport, kinésithérapie du sport à Chasseneuil-du-Poitou',
}

/**
 * Title, description, canonical URL, Open Graph tags and structured data for a page's `head`.
 * Every page but the home page gets a breadcrumb; by default it is "Accueil › <name>".
 */
export function seo({
  path,
  title,
  description,
  name,
  trail,
  schema = [],
}: {
  path: string
  /** The `<title>`, without the site name (added after it, except on the home page). */
  title: string
  description: string
  /** The page's short name in the breadcrumb, as in the menu. Defaults to `title`. */
  name?: string
  /** The breadcrumb from the home page, when the page is deeper than one level. */
  trail?: { name: string; path: string }[]
  /** More schema.org nodes about the page (FAQ, profile…). */
  schema?: Record<string, unknown>[]
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
      { property: 'og:image', content: OG_IMAGE.url },
      { property: 'og:image:width', content: OG_IMAGE.width },
      { property: 'og:image:height', content: OG_IMAGE.height },
      { property: 'og:image:alt', content: OG_IMAGE.alt },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts:
      path === '/' && schema.length === 0
        ? []
        : [
            jsonLdScript([
              ...(path === '/' ? [] : [breadcrumbNode(trail ?? [{ name: name ?? title, path }])]),
              ...schema,
            ]),
          ],
  }
}
