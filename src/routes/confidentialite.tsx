import { createFileRoute } from '@tanstack/react-router'

import { LegalLayout } from '@/components/legal-layout'
import { practice, host, company } from '@/content/practice'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/confidentialite')({
  head: () =>
    seo({
      path: '/confidentialite',
      title: 'Politique de confidentialité',
      description:
        'Quelles données le site atlas-kine-sport.fr traite, pourquoi, combien de temps, et comment exercer vos droits.',
    }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <LegalLayout
      title="Politique de confidentialité"
      updated="2026-11-03"
      intro={
        <p>
          Ce site sert à présenter le cabinet et à vous orienter vers la prise de rendez-vous. Il
          collecte le moins de données possible et ne contient aucun traceur publicitaire ni outil
          de mesure d’audience.
        </p>
      }
      sections={[
        {
          id: 'responsable',
          title: 'Responsable du traitement',
          content: (
            <p>
              {company.name}, {practice.address.street}, {practice.address.postalCode}{' '}
              {practice.address.city}. Téléphone : {practice.phone}.
            </p>
          ),
        },
        {
          id: 'formulaire',
          title: 'Formulaire de contact',
          content: (
            <>
              <p>
                <strong>Données</strong> : nom, adresse e-mail, téléphone si vous le donnez, sujet
                et contenu de votre message.
                <br />
                <strong>Finalité</strong> : répondre à votre demande.
                <br />
                <strong>Base légale</strong> : votre demande (mesures précontractuelles) et notre
                intérêt légitime à vous répondre.
                <br />
                <strong>Durée</strong> : 12 mois après notre dernier échange, puis suppression.
                <br />
                <strong>Destinataires</strong> : les praticiens du cabinet, et {host.name} qui
                héberge le site et la messagerie.
              </p>
              <p>
                Pour limiter les envois automatiques, le serveur garde en mémoire l’adresse IP de
                l’expéditeur et l’heure d’envoi pendant 15 minutes au plus. Elles ne sont ni
                enregistrées ni transmises.
              </p>
              <p>
                N’envoyez pas d’informations médicales par ce formulaire : elles seront échangées en
                consultation, dans le cadre du secret professionnel.
              </p>
            </>
          ),
        },
        {
          id: 'rendez-vous',
          title: 'Prise de rendez-vous',
          content: (
            <p>
              Les rendez-vous se prennent sur Doctolib, qui est responsable des données que vous y
              saisissez. Consultez sa{' '}
              <a href="https://www.doctolib.fr/terms/privacy">politique de confidentialité</a>.
            </p>
          ),
        },
        {
          id: 'cookies',
          title: 'Cookies',
          content: (
            <p>
              Le site ne dépose aucun cookie soumis à consentement. Les polices sont servies par le
              site lui-même, sans appel à un service tiers. Les liens vers Doctolib ou une carte en
              ligne ne chargent rien tant que vous ne cliquez pas.
            </p>
          ),
        },
        {
          id: 'droits',
          title: 'Vos droits',
          content: (
            <p>
              Vous pouvez accéder à vos données, les faire rectifier ou effacer, vous opposer à leur
              traitement ou en demander la limitation, en écrivant au cabinet. Si la réponse ne vous
              satisfait pas, vous pouvez saisir la CNIL sur{' '}
              <a href="https://www.cnil.fr/fr/plaintes">cnil.fr</a>.
            </p>
          ),
        },
      ]}
    />
  )
}
