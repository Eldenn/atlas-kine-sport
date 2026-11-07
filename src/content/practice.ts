// Every fact about the practice in one place: pages, footer, legal notice and structured data read
// from here. Sources: company.com (company), the practitioners' Doctolib pages (RPPS, fees,
// payment, areas of practice), the current site (address, phone, hours).

export const SITE_URL = 'https://atlas-kine-sport.fr'

// Monday to Friday, 8:30-13:00 and 14:00-19:00.
const weekday = [
  { open: '08:30', close: '13:00' },
  { open: '14:00', close: '19:00' },
]

export const practice = {
  name: 'Atlas Kiné Sport',
  tagline: 'Bouger. Récupérer. Performer.',
  description:
    'Cabinet de kinésithérapie du sport à Chasseneuil-du-Poitou : bilan, rééducation et reconditionnement progressif, pour les sportifs de tous niveaux.',
  address: {
    street: '2 avenue de l’Europe',
    postalCode: '86360',
    city: 'Chasseneuil-du-Poitou',
  },
  phone: '07 72 50 80 17',
  /** The week in one line, where a day-by-day table would repeat itself. */
  hoursText: 'Du lundi au vendredi, 8 h 30 – 13 h et 14 h – 19 h. Fermé le week-end.',
  /** Facts that reassure, under the home page's actions. */
  facts: ['Chasseneuil-du-Poitou', 'Conventionnés', 'Tiers payant'],
  // TODO(Matthieu): the address the contact form sends to (masked on the current site).
  email: null as string | null,
  // TODO(Matthieu): step-free access, parking, bus line. Until then the page asks visitors to call.
  access: null as string | null,
  directionsHref:
    'https://www.openstreetmap.org/search?query=2%20avenue%20de%20l%27Europe%2C%2086360%20Chasseneuil-du-Poitou',
  hours: {
    monday: weekday,
    tuesday: weekday,
    wednesday: weekday,
    thursday: weekday,
    friday: weekday,
  } as Record<string, { open: string; close: string }[]>,
} as const

/** The company that publishes the site: a SCM pools the means, each physio practises on their own. */
export const company = {
  name: 'ATLAS KINE SPORT',
  form: 'Société civile de moyens (SCM)',
  capital: '1 000 €',
  siren: '108 024 670',
  siret: '108 024 670 00011',
  vat: 'FR29108024670',
  managers: ['Delman Ahmed Mustafa', 'Moeine Khalifeh'],
} as const

export const host = {
  // TODO(Matthieu): the site moves to our own server (Coolify): replace with that server's provider
  // (name, address, phone, as the LCEN requires) before production goes live. Hostinger keeps the mail.
  name: 'Hostinger International Ltd',
  address: '61 Lordou Vironos str., 6023 Larnaca, Chypre',
  website: 'https://www.hostinger.fr',
} as const

/** A continuing-education course, as the practitioner reported it. */
export interface Training {
  year: number
  title: string
  /** Trainers or organisation. */
  by: string
}

export interface Practitioner {
  slug: string
  name: string
  profession: string
  rpps: string
  /** TODO(Matthieu): Ordre registration numbers, to add when received. */
  ordre: string | null
  convention: string
  /** As shown in the tags of the practical info page. */
  paymentMethods: string[]
  /** Said out loud when false: people expect to pay by card. */
  acceptsCard: boolean
  /** The same, as a sentence. */
  payment: string
  areas: string[]
  bio: string
  doctolib: string
  /** Portrait in public/images, 4:5. */
  photo: string
  /** Most recent first; the page groups them by year. */
  trainings: Training[]
}

export const practitioners: Practitioner[] = [
  {
    slug: 'delman-ahmed-mustafa',
    photo: '/images/delman-ahmed-mustafa.webp',
    name: 'Delman Ahmed Mustafa',
    profession: 'Masseur-kinésithérapeute',
    rpps: '10111339171',
    ordre: null,
    convention: 'Conventionné, tiers payant',
    paymentMethods: ['Espèces', 'Carte bancaire', 'Virement'],
    acceptsCard: true,
    payment: 'Espèces, carte bancaire, virement',
    areas: [
      'Kinésithérapie du sport',
      'Suivi du sportif',
      'Épaule',
      'Genou',
      'Cheville',
      'Rééducation fonctionnelle',
    ],
    bio: 'Une kinésithérapie active, fondée sur l’exercice thérapeutique. Ensemble, on fixe vos objectifs : prévenir les blessures, renforcer votre condition physique, récupérer plus vite. Sportif confirmé, amateur ou non pratiquant, le suivi s’adapte à vous et à votre discipline.',
    trainings: [
      { year: 2026, title: 'Lésion du mollet', by: 'Physiolearning' },
      { year: 2026, title: 'Formation épaule', by: 'Training Thérapie Rennes' },
    ],
    doctolib:
      'https://www.doctolib.fr/masseur-kinesitherapeute/chasseneuil-du-poitou/delman-ahmed-mustafa/booking/new-patient',
  },
  {
    slug: 'moeine-khalifeh',
    photo: '/images/moeine-khalifeh.webp',
    name: 'Moeine Khalifeh',
    profession: 'Masseur-kinésithérapeute',
    rpps: '10108844001',
    ordre: null,
    convention: 'Conventionné, tiers payant',
    paymentMethods: ['Chèque', 'Espèces', 'Virement'],
    acceptsCard: false,
    payment: 'Chèque, espèces, virement (carte bancaire non acceptée)',
    areas: [
      'Kinésithérapie du sport',
      'Suivi du sportif',
      'Rachis lombaire et cervical',
      'Épaule',
      'Genou',
      'Cheville',
      'Troubles musculo-squelettiques',
    ],
    bio: 'Kinésithérapeute du sport, il accompagne les sportifs ainsi que les personnes qui vivent avec des douleurs persistantes ou chroniques. Il se forme en continu pour appuyer sa pratique sur les connaissances les plus récentes.',
    trainings: [
      { year: 2026, title: 'Lésion des ischio-jambiers', by: 'Bryan Littré' },
      {
        year: 2025,
        title: 'Masterclass neurologique',
        by: 'Bryan Littré, Laurent Fabre, Anais Rot',
      },
      { year: 2025, title: 'L’épaule du sportif', by: 'Clémence Bienaimé, Nicolas Foucher' },
      { year: 2025, title: 'Gérer la douleur', by: 'Anthony Halimi' },
      {
        year: 2024,
        title: 'Évaluation, diagnostic et rééducation de la hanche',
        by: 'Michael Reiman',
      },
      {
        year: 2024,
        title: 'Troubles vasculaires en musculo-squelettique : trier pour savoir quand traiter',
        by: 'Bryan Littré, Olivia Ferrand',
      },
      {
        year: 2024,
        title: 'Troubles neurologiques en musculo-squelettique : trier, évaluer et traiter',
        by: 'Bryan Littré',
      },
      {
        year: 2024,
        title: 'Lésions myo-collagéniques du mollet et rupture du tendon d’Achille',
        by: 'Damien Rech',
      },
      { year: 2024, title: 'Kinésithérapeute du sport', by: 'SFMKS' },
      {
        year: 2023,
        title: 'Lombalgie chronique : remettre de l’ordre dans la complexité',
        by: 'Joshua Lavalee',
      },
      { year: 2023, title: 'L’épaule EBPratique', by: 'Germain Delos, Azziz Youssef' },
      {
        year: 2021,
        title: 'Épaule : utiliser les données de la science pour optimiser nos résultats',
        by: 'Jo Gibson, Agence EBP',
      },
    ],
    doctolib:
      'https://www.doctolib.fr/masseur-kinesitherapeute/chasseneuil-du-poitou/moeine-khalifeh/booking/new-patient',
  },
]

export const nav = [
  { label: 'Le cabinet', href: '/cabinet' },
  { label: 'Soins', href: '/soins' },
  { label: 'L’équipe', href: '/equipe' },
  { label: 'Infos pratiques', href: '/infos-pratiques' },
  { label: 'Contact', href: '/contact' },
] as const

export const legalLinks = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Confidentialité', href: '/confidentialite' },
] as const
