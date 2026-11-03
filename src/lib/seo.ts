import { SITE_URL } from '@/content/cabinet'

/** The image shown when a page is shared (messaging apps, social networks): 1200 × 630. */
const OG_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  width: '1200',
  height: '630',
  alt: 'Atlas Kiné Sport, kinésithérapie du sport à Chasseneuil-du-Poitou',
}

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
      { property: 'og:image', content: OG_IMAGE.url },
      { property: 'og:image:width', content: OG_IMAGE.width },
      { property: 'og:image:height', content: OG_IMAGE.height },
      { property: 'og:image:alt', content: OG_IMAGE.alt },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
