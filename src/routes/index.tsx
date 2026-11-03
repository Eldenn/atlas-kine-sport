import { createFileRoute } from '@tanstack/react-router'

import { DoctolibButtons } from '@/components/atlas/doctolib-buttons'
import { PhotoPlaceholder } from '@/components/atlas/photo-placeholder'
import { ContactDetails, ContactSection, OpeningHours } from '@/components/contact-section'
import { Hero } from '@/components/hero'
import { MediaSection } from '@/components/media-section'
import { PractitionerCard, PractitionerGrid } from '@/components/practitioner-card'
import { Quote } from '@/components/quote'
import { Button } from '@/components/ui/button'
import { cabinet, practitioners } from '@/content/cabinet'
import { AppLink } from '@/lib/link'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      path: '/',
      title: 'Atlas Kiné Sport · Kinésithérapie du sport à Chasseneuil-du-Poitou',
      description: cabinet.description,
    }),
  component: Home,
})

const axes = [
  {
    step: '01',
    title: 'Évaluer',
    text: 'Un bilan complet à la première séance : douleur, mobilité, force, et ce que votre sport exige de vous.',
  },
  {
    step: '02',
    title: 'Soigner',
    text: 'Thérapie manuelle et rééducation des blessures musculaires, tendineuses et articulaires.',
  },
  {
    step: '03',
    title: 'Progresser',
    text: 'Un reconditionnement dont la charge augmente quand vos mesures le permettent, pas avant.',
  },
]

function Home() {
  return (
    <>
      <Hero
        layout="split"
        eyebrow={<span className="atlas-eyebrow">Kiné sport · Chasseneuil-du-Poitou</span>}
        title={<span className="block tracking-[0.06em]">ATLAS</span>}
        highlight="Bouger. Récupérer. Performer."
        highlightStyle="solid"
        description="Un cabinet de kinésithérapie du sport pour les athlètes de tous niveaux, et pour toute personne qui veut retrouver un corps fiable. On évalue, on soigne, puis on recharge progressivement, avec des mesures à chaque étape."
        actions={
          <>
            <Button asChild size="lg">
              <AppLink href="/contact">Prendre rendez-vous</AppLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <AppLink href="/cabinet">Découvrir le cabinet</AppLink>
            </Button>
          </>
        }
        media={<PhotoPlaceholder label="le plateau technique" />}
      />

      {/* The three axes as a numbered sequence, not a grid of icon cards. */}
      <section aria-labelledby="axes" className="border-t border-border-subtle px-5 py-20 md:px-7">
        <div className="mx-auto max-w-[1120px]">
          <p className="atlas-eyebrow m-0 text-primary-text">La méthode</p>
          <h2
            id="axes"
            className="mt-4 mb-12 max-w-[22ch] font-display text-[clamp(30px,4vw,44px)] leading-[1.1]"
          >
            Trois temps, dans cet ordre
          </h2>
          <ol className="m-0 grid list-none gap-10 p-0 md:grid-cols-3">
            {axes.map((axe) => (
              <li key={axe.step} className="border-border-accent border-t pt-6">
                <span className="font-display text-[40px] leading-none text-primary-text">
                  {axe.step}
                </span>
                <h3 className="mt-4 mb-2 font-display text-[26px]">{axe.title}</h3>
                <p className="m-0 leading-relaxed text-fg-secondary">{axe.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div
        data-theme="light"
        data-surface="bone"
        data-accent="atlas"
        className="bg-background text-foreground"
      >
        <MediaSection
          eyebrow={<span className="atlas-eyebrow">Plateau technique</span>}
          title="Une salle pensée pour la rééducation"
          media={<PhotoPlaceholder label="piste de sprint et zone de charges" />}
          actions={
            <Button asChild variant="outline">
              <AppLink href="/cabinet">Voir le cabinet</AppLink>
            </Button>
          }
        >
          <p>
            Piste de sprint, charges libres, capteurs de force et analyse vidéo du geste. Vous voyez
            vos progrès en chiffres, séance après séance.
          </p>
        </MediaSection>
      </div>

      <section className="px-5 py-20 md:px-7">
        <div className="mx-auto max-w-[860px]">
          <Quote variant="large" align="center">
            <span className="font-quote">
              Dans la mythologie, Atlas porte le monde. En anatomie, l’atlas est la première
              vertèbre, celle qui soutient la tête. Notre rôle est le même : vous soutenir le temps
              de retrouver force et mouvement, puis vous laisser aller plus loin.
            </span>
          </Quote>
        </div>
      </section>

      <PractitionerGrid
        eyebrow="L’équipe"
        title={<span className="font-display">Vos kinésithérapeutes</span>}
        columns={2}
        className="border-t border-border-subtle"
      >
        {practitioners.map((p) => (
          <PractitionerCard
            key={p.slug}
            name={p.name}
            profession={p.profession}
            photo={<img src={p.photo} alt="" width={480} height={600} loading="lazy" />}
            specialties={p.areas.slice(0, 4)}
            facts={[{ label: 'RPPS', value: p.rpps }]}
            headingLevel={3}
            orientation="horizontal"
            actions={
              <>
                <Button asChild>
                  <a href={p.doctolib} target="_blank" rel="noopener noreferrer">
                    Prendre rendez-vous
                    <span className="sr-only"> avec {p.name} sur Doctolib (nouvel onglet)</span>
                  </a>
                </Button>
                <Button asChild variant="ghost">
                  <AppLink href={`/equipe/${p.slug}`}>Son parcours</AppLink>
                </Button>
              </>
            }
          />
        ))}
      </PractitionerGrid>

      <ContactSection
        eyebrow="Nous trouver"
        title={<span className="font-display">Votre prochaine séance commence par un bilan</span>}
        description="Choisissez votre praticien sur Doctolib, ou appelez le cabinet."
        className="border-t border-border-subtle"
      >
        <ContactDetails
          address={
            <>
              {cabinet.address.street}
              <br />
              {cabinet.address.postalCode} {cabinet.address.city}
            </>
          }
          directionsHref={cabinet.directionsHref}
          phone={cabinet.phone}
        />
        <OpeningHours hours={cabinet.hours} />
        <DoctolibButtons />
      </ContactSection>
    </>
  )
}
