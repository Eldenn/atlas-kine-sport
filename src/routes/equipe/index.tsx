import { createFileRoute } from '@tanstack/react-router'

import { PageIntro } from '@/components/atlas/page-intro'
import { PractitionerCard, PractitionerGrid } from '@/components/practitioner-card'
import { Button } from '@/components/ui/button'
import { practitioners } from '@/content/cabinet'
import { AppLink } from '@/lib/link'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/equipe/')({
  head: () =>
    seo({
      path: '/equipe',
      title: 'L’équipe',
      description: 'Delman Ahmed Mustafa et Moeine Khalifeh, masseurs-kinésithérapeutes du sport.',
    }),
  component: Equipe,
})

function Equipe() {
  return (
    <>
      <PageIntro eyebrow="L’équipe" title="Deux kinésithérapeutes du sport">
        <p>Chacun a son agenda Doctolib : choisissez selon vos besoins ou vos disponibilités.</p>
      </PageIntro>
      <PractitionerGrid columns={2} className="pt-0">
        {practitioners.map((p) => (
          <PractitionerCard
            key={p.slug}
            name={p.name}
            profession={p.profession}
            photo={<img src={p.photo} alt="" width={460} height={575} loading="lazy" />}
            specialties={p.areas}
            bio={p.bio}
            facts={[
              { label: 'RPPS', value: p.rpps },
              { label: 'Conventionnement', value: p.convention },
            ]}
            headingLevel={2}
            actions={
              <>
                <Button asChild>
                  <a href={p.doctolib} target="_blank" rel="noopener noreferrer">
                    Prendre rendez-vous
                    <span className="sr-only"> avec {p.name} sur Doctolib (nouvel onglet)</span>
                  </a>
                </Button>
                <Button asChild variant="ghost">
                  <AppLink href={`/equipe/${p.slug}`}>Fiche complète</AppLink>
                </Button>
              </>
            }
          />
        ))}
      </PractitionerGrid>
    </>
  )
}
