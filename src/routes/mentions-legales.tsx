import { createFileRoute } from '@tanstack/react-router'

import { LegalLayout } from '@/components/legal-layout'
import { practice, host, practitioners, SITE_URL, company } from '@/content/practice'
import { AppLink } from '@/lib/link'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/mentions-legales')({
  head: () =>
    seo({
      path: '/mentions-legales',
      title: 'Mentions légales',
      description:
        'Éditeur, praticiens, hébergeur et propriété intellectuelle du site atlas-kine-sport.fr.',
    }),
  component: LegalNoticePage,
})

function LegalNoticePage() {
  const { address } = practice
  return (
    <LegalLayout
      title="Mentions légales"
      updated="2026-11-03"
      intro={
        <p>
          Informations prévues par l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la
          confiance dans l’économie numérique, et par le code de déontologie des
          masseurs-kinésithérapeutes.
        </p>
      }
      sections={[
        {
          id: 'editeur',
          title: 'Éditeur du site',
          content: (
            <>
              <p>
                <strong>{company.name}</strong>, société civile de moyens (SCM) au capital de{' '}
                {company.capital}.
                <br />
                Siège : {address.street}, {address.postalCode} {address.city}.
                <br />
                SIREN {company.siren} · SIRET {company.siret} · TVA intracommunautaire {company.vat}
                .
                <br />
                Téléphone : {practice.phone}.
              </p>
              <p>
                Directeurs de la publication : {company.managers.join(' et ')}, associés-gérants.
              </p>
              <p>
                La société civile de moyens met en commun les locaux et le matériel. Elle n’exerce
                pas la kinésithérapie : chaque praticien exerce à titre libéral et facture ses
                propres honoraires.
              </p>
            </>
          ),
        },
        {
          id: 'praticiens',
          title: 'Praticiens',
          content: (
            <ul>
              {practitioners.map((p) => (
                <li key={p.slug}>
                  <strong>{p.name}</strong>, {p.profession.toLowerCase()} diplômé d’État. N° RPPS{' '}
                  {p.rpps}
                  {p.ordre ? ` · N° d’inscription à l’Ordre ${p.ordre}` : ''}. {p.convention}.
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: 'ordre',
          title: 'Profession réglementée',
          content: (
            <p>
              Masseur-kinésithérapeute, titre délivré en France. Inscription au tableau du conseil
              départemental de l’Ordre des masseurs-kinésithérapeutes de la Vienne. Règles
              professionnelles : code de la santé publique, articles R.4321-51 et suivants,
              consultables sur <a href="https://www.legifrance.gouv.fr">legifrance.gouv.fr</a>.
            </p>
          ),
        },
        {
          id: 'hebergeur',
          title: 'Hébergeur',
          content: (
            <p>
              {host.name}, {host.address}. Site : <a href={host.website}>hostinger.fr</a>.
            </p>
          ),
        },
        {
          id: 'propriete',
          title: 'Propriété intellectuelle',
          content: (
            <p>
              Les textes, photographies, le nom et l’emblème Atlas sont la propriété de{' '}
              {company.name} ou de leurs auteurs. Toute reproduction sans autorisation est
              interdite.
            </p>
          ),
        },
        {
          id: 'donnees',
          title: 'Données personnelles',
          content: (
            <p>
              Le traitement de vos données est décrit dans la{' '}
              <AppLink href="/confidentialite">politique de confidentialité</AppLink>. Ce site ne
              dépose aucun cookie publicitaire ni de mesure d’audience. Adresse du site : {SITE_URL}
              .
            </p>
          ),
        },
      ]}
    />
  )
}
