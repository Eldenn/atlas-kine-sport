import { createFileRoute } from '@tanstack/react-router'
import { MapPinIcon, PhoneIcon } from 'lucide-react'

import { DoctolibButtons } from '@/components/atlas/doctolib-buttons'
import { HomeStage } from '@/components/atlas/home-stage'
import { PhotoSlot } from '@/components/atlas/photo-slot'
import { PractitionerFeature } from '@/components/atlas/practitioner-feature'
import { practice, practitioners } from '@/content/practice'
import { photos } from '@/content/photos'
import { AppLink } from '@/lib/link'
import { seo } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      path: '/',
      title: 'Atlas Kiné Sport · Kinésithérapie du sport à Chasseneuil-du-Poitou',
      description: practice.description,
    }),
  component: Home,
})

const container = 'mx-auto box-content max-w-[1120px] px-5 md:px-7'
const bone = { 'data-theme': 'light', 'data-surface': 'bone', 'data-accent': 'atlas' } as const

function Home() {
  const floorPhoto = photos.trainingFloor
  return (
    <>
      <HomeStage />

      {/* The name, as the moodboard sets it (p. 4): the place where the site says who it is. */}
      <section
        {...bone}
        aria-labelledby="name-title"
        className="bg-background py-20 text-foreground md:py-28"
      >
        <div className={container}>
          <h2 id="name-title" className="atlas-name__word">
            ATLAS
          </h2>
          <dl className="atlas-name__pair">
            <div className="atlas-name__meaning">
              <dt>En anatomie</dt>
              <dd>
                La première vertèbre cervicale (C1), qui soutient la tête et lui donne sa mobilité.
              </dd>
            </div>
            <div className="atlas-name__meaning">
              <dt>En mythologie</dt>
              <dd>Le titan qui porte le monde : la force, l’endurance, la stabilité.</dd>
            </div>
          </dl>
          <p className="atlas-name__line">
            Notre métier : la <strong>reconstruction du corps</strong>, jusqu’à ce qu’il retrouve
            force et mouvement.
          </p>
        </div>
      </section>

      {/* How the work is done and where, in one section. The training-floor photo joins it when it exists. */}
      <section aria-labelledby="approach-title" className="py-20 md:py-28">
        <div
          className={cn(
            container,
            'grid gap-10',
            floorPhoto
              ? 'md:grid-cols-2 md:items-center md:gap-16'
              : 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20',
          )}
        >
          {floorPhoto && (
            <div className="aspect-[4/3] overflow-hidden md:order-2">
              <PhotoSlot photo={floorPhoto} sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          )}
          <h2
            id="approach-title"
            className="m-0 max-w-[18ch] font-display text-[clamp(32px,4.4vw,52px)] leading-[1.08] text-balance"
          >
            Une rééducation active, sur un plateau conçu comme une salle d’entraînement
          </h2>
          <div className="text-[17px] leading-[1.7] text-fg-secondary lg:pt-3">
            <p className="m-0">
              Le premier rendez-vous est un bilan : douleur, mobilité, force, et ce que votre sport
              exige de vous. Ensuite vous travaillez avec le kiné, pas seulement sous ses mains.
            </p>
            <p className="mt-4 mb-0">
              Piste de sprint, charges libres, capteurs de force et analyse vidéo du geste : la
              charge augmente quand vos mesures le permettent, pas avant.
            </p>
            <p className="mt-8 mb-0 flex flex-wrap gap-x-8 gap-y-3">
              <AppLink href="/soins" className="atlas-link">
                Les soins, du bilan au retour au sport
              </AppLink>
              <AppLink href="/cabinet" className="atlas-link">
                Le plateau technique
              </AppLink>
            </p>
          </div>
        </div>
      </section>

      {/* The team on bone: the studio portraits sit on a light ground, not in dark cards. */}
      <section
        {...bone}
        aria-labelledby="team-title"
        className="bg-background py-20 text-foreground md:py-28"
      >
        <div className={container}>
          <h2
            id="team-title"
            className="m-0 font-display text-[clamp(32px,4.4vw,52px)] leading-[1.08]"
          >
            Vos kinésithérapeutes
          </h2>
          <div className="mt-12 grid gap-14 sm:grid-cols-2 sm:gap-10 lg:gap-16">
            {practitioners.map((p) => (
              <PractitionerFeature key={p.slug} practitioner={p} areas={p.areas.slice(0, 4)} />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="visit-title" className="py-20 md:py-28">
        <div
          className={cn(
            container,
            'grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20',
          )}
        >
          <div>
            <h2
              id="visit-title"
              className="m-0 max-w-[16ch] font-display text-[clamp(32px,4.4vw,52px)] leading-[1.08]"
            >
              Votre première séance commence par un bilan
            </h2>
            <p className="mt-6 mb-0 max-w-[48ch] text-[17px] leading-[1.7] text-fg-secondary">
              Chaque kiné a son agenda Doctolib. Pour une question, appelez le cabinet.
            </p>
            <div className="mt-8">
              <DoctolibButtons />
            </div>
          </div>
          <dl className="m-0 grid content-start gap-7 text-[16px] leading-relaxed lg:pt-3">
            <div>
              <dt className="sr-only">Adresse</dt>
              <dd className="m-0 grid grid-cols-[20px_1fr] gap-x-4">
                <MapPinIcon aria-hidden className="mt-1 size-5 text-primary-text" />
                <span>
                  {practice.address.street}
                  <br />
                  {practice.address.postalCode} {practice.address.city}
                  <br />
                  <a
                    href={practice.directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="atlas-link mt-2 text-[15px]"
                  >
                    Itinéraire<span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </span>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Téléphone</dt>
              <dd className="m-0 grid grid-cols-[20px_1fr] gap-x-4">
                <PhoneIcon aria-hidden className="mt-1 size-5 text-primary-text" />
                <a
                  href={`tel:+33${practice.phone.replace(/\s/g, '').slice(1)}`}
                  className="atlas-link py-0"
                >
                  {practice.phone}
                </a>
              </dd>
            </div>
            <div className="border-t border-border-subtle pt-6">
              <dt className="atlas-eyebrow text-primary-text">Horaires</dt>
              <dd className="mt-3 mb-0 text-fg-secondary">
                {practice.hoursText}{' '}
                <AppLink href="/infos-pratiques" className="atlas-link py-0 text-[15px]">
                  Infos pratiques
                </AppLink>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  )
}
