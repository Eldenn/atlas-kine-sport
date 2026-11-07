// schema.org descriptions of the practice and its practitioners, read by search engines (local
// results, knowledge panel) and by AI assistants that answer questions about the practice.
// Every entity has a stable `@id`, so pages can point to the same practice and the same person
// instead of describing them again. Facts come from src/content only.

import { practice, practitioners, SITE_URL, type Practitioner } from '@/content/practice'

type Node = Record<string, unknown>

export const PRACTICE_ID = `${SITE_URL}/#cabinet`
export const WEBSITE_ID = `${SITE_URL}/#site`

export const personId = (p: Practitioner) => `${SITE_URL}/equipe/${p.slug}#praticien`

const dayNames: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

/** One specification per day and time slot, from `practice.hours`. */
const openingHours = Object.entries(practice.hours).flatMap(([day, slots]) =>
  slots.map((slot) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: dayNames[day],
    opens: slot.open,
    closes: slot.close,
  })),
)

const address = {
  '@type': 'PostalAddress',
  streetAddress: practice.address.street,
  postalCode: practice.address.postalCode,
  addressLocality: practice.address.city,
  addressRegion: 'Nouvelle-Aquitaine',
  addressCountry: 'FR',
}

/** Every area of practice once, in the order the practitioners list them. */
const allAreas = [...new Set(practitioners.flatMap((p) => p.areas))]

/** The practice: a physiotherapy business with its address, hours and team. */
export const practiceNode: Node = {
  '@type': 'Physiotherapy',
  '@id': PRACTICE_ID,
  name: practice.name,
  description: practice.description,
  slogan: practice.tagline,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og-image.jpg`,
  logo: `${SITE_URL}/images/emblem-bone.png`,
  telephone: practice.phoneE164,
  address,
  ...(practice.geo
    ? {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: practice.geo.latitude,
          longitude: practice.geo.longitude,
        },
      }
    : {}),
  hasMap: practice.directionsHref,
  areaServed: practice.areaServed.map((name) => ({ '@type': 'City', name })),
  openingHoursSpecification: openingHours,
  medicalSpecialty: 'https://schema.org/PhysicalTherapy',
  knowsAbout: allAreas,
  currenciesAccepted: 'EUR',
  isAcceptingNewPatients: true,
  employee: practitioners.map((p) => ({ '@id': personId(p) })),
  ...(practice.profiles.length > 0 ? { sameAs: practice.profiles } : {}),
}

/** The website itself, published by the practice. */
export const websiteNode: Node = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: practice.name,
  inLanguage: 'fr-FR',
  publisher: { '@id': PRACTICE_ID },
}

/** A practitioner, identified by their RPPS number and linked to their Doctolib page. */
export function personNode(p: Practitioner): Node {
  return {
    '@type': 'Person',
    '@id': personId(p),
    name: p.name,
    jobTitle: p.profession,
    description: p.bio,
    url: `${SITE_URL}/equipe/${p.slug}`,
    image: SITE_URL + p.photo,
    identifier: [
      { '@type': 'PropertyValue', propertyID: 'RPPS', value: p.rpps },
      ...(p.ordre
        ? [
            {
              '@type': 'PropertyValue',
              propertyID: 'Ordre des masseurs-kinésithérapeutes',
              value: p.ordre,
            },
          ]
        : []),
    ],
    knowsAbout: p.areas,
    worksFor: { '@id': PRACTICE_ID },
    workLocation: { '@id': PRACTICE_ID },
    sameAs: [p.doctolib.replace(/\/booking\/new-patient$/, '')],
  }
}

/** The trail from the home page to the current one. */
export function breadcrumbNode(trail: { name: string; path: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Accueil', path: '/' }, ...trail].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: SITE_URL + item.path,
    })),
  }
}

/** Questions and answers shown on a page, in plain text. */
export function faqNode(items: { question: string; answer: string }[]): Node {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/** A `<script type="application/ld+json">` for a route's `head`, `<` escaped so it can't close the tag. */
export function jsonLdScript(nodes: Node[]) {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })
  return { type: 'application/ld+json', children: json.replace(/</g, '\\u003c') }
}
