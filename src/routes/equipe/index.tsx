import { createFileRoute } from '@tanstack/react-router'

import { PageIntro } from '@/components/atlas/page-intro'
import { PractitionerFeature } from '@/components/atlas/practitioner-feature'
import { practitioners } from '@/content/practice'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/equipe/')({
  head: () =>
    seo({
      path: '/equipe',
      title: 'Les kinésithérapeutes du sport du cabinet',
      name: 'L’équipe',
      description:
        'Delman Ahmed Mustafa et Moeine Khalifeh, masseurs-kinésithérapeutes du sport conventionnés à Chasseneuil-du-Poitou : domaines d’intervention, formations, rendez-vous.',
    }),
  component: TeamPage,
})

function TeamPage() {
  return (
    <>
      <PageIntro eyebrow="L’équipe" title="Deux kinésithérapeutes du sport">
        <p>Chacun a son agenda Doctolib : choisissez selon vos besoins ou vos disponibilités.</p>
      </PageIntro>
      {/* On bone, like the home page: the studio portraits sit on a light ground. */}
      <section
        data-theme="light"
        data-surface="bone"
        data-accent="atlas"
        aria-label="Les kinésithérapeutes"
        className="bg-background py-16 text-foreground md:py-24"
      >
        <div className="mx-auto box-content grid max-w-[1120px] gap-16 px-5 sm:grid-cols-2 sm:gap-10 md:px-7 lg:gap-16">
          {practitioners.map((p) => (
            <PractitionerFeature
              key={p.slug}
              practitioner={p}
              headingLevel={2}
              bio={<p className="m-0">{p.bio}</p>}
            />
          ))}
        </div>
      </section>
    </>
  )
}
