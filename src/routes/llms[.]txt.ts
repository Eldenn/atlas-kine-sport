import { createFileRoute } from '@tanstack/react-router'

import { practice, practitioners, SITE_URL } from '@/content/practice'

// A plain-text summary of the site for AI assistants (the llms.txt convention, https://llmstxt.org):
// who the practice is, where, when, with whom, and which page answers what. Built from src/content,
// so it never drifts from the pages. The text is French, like the site.

const { address } = practice

const page = (path: string, label: string, about: string) =>
  `- [${label}](${SITE_URL}${path}): ${about}`

const body = `# ${practice.name}

> ${practice.description}

${practice.name} est un cabinet de masseurs-kinésithérapeutes situé ${address.street}, ${address.postalCode} ${address.city} (Vienne, à côté de Poitiers et du Futuroscope). Téléphone : ${practice.phone}. ${practice.hoursText}

Les deux praticiens sont conventionnés et pratiquent le tiers payant : sur prescription médicale, les séances sont remboursées par l'Assurance maladie. Les rendez-vous se prennent sur Doctolib, sur l'agenda de chaque praticien.

## Praticiens

${practitioners
  .map(
    (p) =>
      `- [${p.name}](${SITE_URL}/equipe/${p.slug}), ${p.profession.toLowerCase()} (RPPS ${p.rpps}). ${p.convention}. Domaines d'intervention : ${p.areas.join(', ').toLowerCase()}. Paiement : ${p.payment.toLowerCase()}. Rendez-vous : ${p.doctolib}`,
  )
  .join('\n')}

## Pages

${[
  page('/cabinet', 'Le cabinet', 'la démarche (rééducation active) et le plateau technique.'),
  page('/soins', 'Soins', 'du bilan au retour au sport, et questions fréquentes.'),
  page('/equipe', 'L’équipe', 'les praticiens, leurs domaines d’intervention et formations.'),
  page(
    '/infos-pratiques',
    'Infos pratiques',
    'horaires, accès, remboursement, première séance et tarifs des prestations non remboursées.',
  ),
  page('/contact', 'Contact', 'prendre rendez-vous sur Doctolib ou écrire au cabinet.'),
].join('\n')}

## Optional

${[
  page('/mentions-legales', 'Mentions légales', 'éditeur, praticiens et hébergeur.'),
  page('/confidentialite', 'Confidentialité', 'données traitées par le site.'),
].join('\n')}
`

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } }),
    },
  },
})
