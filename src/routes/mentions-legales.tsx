import { createFileRoute } from '@tanstack/react-router'

import { LegalLayout } from '@/components/legal-layout'
import { cabinet, hebergeur, practitioners, SITE_URL, societe } from '@/content/cabinet'
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
  component: MentionsLegales,
})

function MentionsLegales() {
  const { address } = cabinet
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
                <strong>{societe.name}</strong>, société civile de moyens (SCM) au capital de{' '}
                {societe.capital}.
                <br />
                Siège : {address.street}, {address.postalCode} {address.city}.
                <br />
                SIREN {societe.siren} · SIRET {societe.siret} · TVA intracommunautaire {societe.vat}
                .
                <br />
                Téléphone : {cabinet.phone}.
              </p>
              <p>
                Directeurs de la publication : {societe.managers.join(' et ')}, associés-gérants.
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
              {hebergeur.name}, {hebergeur.address}. Site :{' '}
              <a href={hebergeur.website}>hostinger.fr</a>.
            </p>
          ),
        },
        {
          id: 'propriete',
          title: 'Propriété intellectuelle',
          content: (
            <p>
              Les textes, photographies, le nom et l’emblème Atlas sont la propriété de{' '}
              {societe.name} ou de leurs auteurs. Toute reproduction sans autorisation est
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
