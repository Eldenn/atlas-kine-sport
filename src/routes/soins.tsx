import { createFileRoute } from '@tanstack/react-router'

import { BookingBand } from '@/components/atlas/booking-band'
import { GoldFigure } from '@/components/atlas/gold-figure'
import { PageIntro } from '@/components/atlas/page-intro'
import { anchorOffset, PageNav } from '@/components/atlas/page-nav'
import { Faq } from '@/components/faq'
import {
  activeTreatments,
  passiveTreatments,
  recoveryServices,
  type Treatment,
} from '@/content/care'
import { AppLink } from '@/lib/link'
import { seo } from '@/lib/seo'
import { faqNode } from '@/lib/structured-data'

export const Route = createFileRoute('/soins')({
  head: () =>
    seo({
      path: '/soins',
      title: 'Kinésithérapie du sport, préparation physique et récupération',
      name: 'Soins',
      description:
        'Kinésithérapie du sport à Chasseneuil-du-Poitou : bilan, rééducation active de l’épaule, du genou, de la cheville et du rachis, préparation physique et récupération.',
      schema: [faqNode(questions)],
    }),
  component: CarePage,
})

// TODO(Matthieu): questions to confirm with the practitioners. Also read by search engines (FAQPage).
const questions = [
  {
    question: 'Faut-il une ordonnance ?',
    answer:
      'Pour être remboursé, oui : apportez la prescription de votre médecin à la première séance, avec votre carte Vitale et votre carte de mutuelle.',
  },
  {
    question: 'Que prévoir pour la première séance ?',
    answer:
      'Une tenue de sport, vos examens d’imagerie s’il y en a, et vos questions. Le bilan dure le temps nécessaire pour comprendre votre situation.',
  },
  {
    question: 'Faut-il être sportif ?',
    answer:
      'Non. Les méthodes du sport servent aussi à retrouver un quotidien sans douleur, quel que soit votre niveau.',
  },
  {
    question: 'La préparation physique est-elle remboursée ?',
    answer:
      'Non. Elle ne soigne pas une pathologie : elle n’est pas prise en charge par l’Assurance maladie, même quand un kinésithérapeute l’encadre.',
  },
]

const sections = [
  { id: 'kinesitherapie', label: 'Kinésithérapie' },
  { id: 'preparation-physique', label: 'Préparation physique' },
  { id: 'recuperation', label: 'Récupération' },
] as const

const steps = [
  {
    title: 'Évaluer',
    text: 'Le bilan initial mesure la douleur, la mobilité et la force, et part de ce que votre sport ou votre quotidien vous demande. Il fixe les objectifs et les tests qui diront quand passer à l’étape suivante.',
  },
  {
    title: 'Soigner',
    text: 'Blessures musculaires, tendineuses et articulaires : épaule, genou, cheville, rachis lombaire et cervical, troubles musculo-squelettiques, douleurs persistantes. Le traitement est surtout actif ; les techniques passives servent d’abord en phase aiguë.',
  },
  {
    title: 'Progresser',
    text: 'Reconditionnement et retour au sport : la charge augmente par paliers, guidée par les capteurs de force et l’analyse vidéo du geste.',
  },
]

const container = 'mx-auto box-content max-w-[1120px] px-5 md:px-7'

/** A rubric's heading: its number, then the title. */
function RubricHeading({
  id,
  index,
  title,
  children,
}: {
  id: string
  index: number
  title: string
  children?: React.ReactNode
}) {
  return (
    <div>
      <p className="atlas-eyebrow m-0 text-primary-text">0{index}</p>
      <h2 id={id} className="mt-3 mb-0 font-display text-[clamp(32px,4.4vw,48px)] leading-[1.08]">
        {title}
      </h2>
      {!!children && (
        <div className="mt-5 max-w-[60ch] text-[17px] leading-[1.7] text-fg-secondary">
          {children}
        </div>
      )}
    </div>
  )
}

function TreatmentList({
  title,
  lead,
  items,
}: {
  title: string
  lead: string
  items: Treatment[]
}) {
  return (
    <div>
      <h3 className="m-0 font-display text-[26px]">{title}</h3>
      <p className="mt-2 mb-0 text-[15px] leading-relaxed text-fg-secondary">{lead}</p>
      <ul className="m-0 mt-6 grid list-none gap-0 p-0">
        {items.map((t) => (
          <li key={t.title} className="border-t border-border-subtle py-5">
            <p className="m-0 text-[17px] text-foreground">
              {t.title}
              {t.tool && <span className="text-fg-secondary"> ({t.tool})</span>}
            </p>
            <p className="mt-1.5 mb-0 max-w-[56ch] leading-relaxed text-fg-secondary">{t.text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Physiotherapy() {
  return (
    <section
      id="kinesitherapie"
      aria-labelledby="kinesitherapie-title"
      className={`${anchorOffset} py-16 md:py-24`}
    >
      <div className={`${container} grid gap-14`}>
        <RubricHeading id="kinesitherapie-title" index={1} title="Kinésithérapie">
          <p className="m-0">
            Sur prescription médicale, remboursée par l’Assurance maladie. Du bilan au retour au
            sport.
          </p>
        </RubricHeading>
        <ol className="m-0 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t border-border-subtle pt-5">
              <p className="atlas-eyebrow m-0 text-fg-secondary tabular-nums">Étape {i + 1}</p>
              <h3 className="mt-2 mb-0 font-display text-[26px]">{step.title}</h3>
              <p className="mt-3 mb-0 leading-relaxed text-fg-secondary">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
          <TreatmentList
            title="Traitement actif"
            lead="Vous faites l’exercice, le kiné le dose et le corrige. C’est le cœur de la rééducation."
            items={activeTreatments}
          />
          <TreatmentList
            title="Traitement passif"
            lead="Fait par le kiné, surtout en phase aiguë, pour soulager et préparer le travail actif."
            items={passiveTreatments}
          />
        </div>
      </div>
    </section>
  )
}

function Training() {
  return (
    <section
      id="preparation-physique"
      aria-labelledby="preparation-physique-title"
      data-theme="light"
      data-surface="bone"
      data-accent="atlas"
      className={`${anchorOffset} bg-background py-16 text-foreground md:py-24`}
    >
      <div
        className={`${container} grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20`}
      >
        <RubricHeading id="preparation-physique-title" index={2} title="Préparation physique">
          <p className="m-0">
            Une saison, une compétition, une reprise : un programme encadré par un kinésithérapeute,
            sur le même plateau technique que la rééducation. Hors prescription, elle n’est pas
            remboursée.
          </p>
        </RubricHeading>
        <div className="grid content-start gap-6 lg:pt-10">
          <ul className="m-0 grid list-none gap-0 p-0 text-[16px] leading-relaxed text-fg-secondary">
            <li className="border-t border-border py-4">
              Un bilan physique de départ, recommandé pour mesurer la progression.
            </li>
            <li className="border-t border-border py-4">
              Au cabinet, à distance ou en hybride, seul, en groupe ou avec un club.
            </li>
            <li className="border-y border-border py-4">
              Une demande en ligne, par un formulaire.
            </li>
          </ul>
          <p className="m-0">
            <AppLink href="/preparation-physique" className="atlas-link">
              La préparation physique en détail
            </AppLink>
          </p>
        </div>
      </div>
    </section>
  )
}

function Recovery() {
  return (
    <section
      id="recuperation"
      aria-labelledby="recuperation-title"
      className={`${anchorOffset} py-16 md:py-24`}
    >
      <div
        className={`${container} grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20`}
      >
        <RubricHeading id="recuperation-title" index={3} title="Récupération">
          <p className="m-0">
            Des séances courtes pour récupérer après l’effort. En dehors d’une prescription, elles
            ne sont pas remboursées.
          </p>
        </RubricHeading>
        <div className="grid content-start gap-6 lg:pt-10">
          <ul className="m-0 grid list-none gap-0 p-0">
            {recoveryServices.map((s) => (
              <li key={s.title} className="border-t border-border-subtle py-5 last:border-b">
                <h3 className="m-0 font-display text-[22px]">{s.title}</h3>
                <p className="mt-1.5 mb-0 leading-relaxed text-fg-secondary">{s.text}</p>
              </li>
            ))}
          </ul>
          <p className="m-0">
            <AppLink href="/infos-pratiques#tarifs" className="atlas-link">
              Les tarifs hors remboursement
            </AppLink>
          </p>
        </div>
      </div>
    </section>
  )
}

function CarePage() {
  return (
    <>
      <PageIntro
        eyebrow="Soins"
        title="Du soin à la performance"
        media={
          <GoldFigure
            className="mx-auto w-full max-w-[420px] md:max-w-none"
            avif="/images/care/care-420.avif 420w, /images/care/care-783.avif 783w"
            webp="/images/care/care-420.webp 420w, /images/care/care-783.webp 783w"
            src="/images/care/care-783.webp"
            lines="/images/care/care-lines.webp"
            width={783}
            height={652}
            sizes="(min-width: 768px) 46vw, 90vw"
            alt="Un kinésithérapeute, un genou au sol, palpe le genou d’un sportif en fente avant."
            rest={{ x: 47, y: 58 }}
          />
        }
      >
        <p>
          La kinésithérapie, sur prescription, est remboursée : les deux praticiens sont
          conventionnés et pratiquent le tiers payant. La préparation physique et la récupération
          sont proposées en dehors du remboursement.
        </p>
      </PageIntro>
      <PageNav sections={sections} />
      <Physiotherapy />
      <Training />
      <Recovery />
      <Faq
        title={<span className="font-display">Questions fréquentes</span>}
        items={questions}
        className="atlas-divide"
      />
      <BookingBand>
        <p className="m-0">
          Chaque kiné a son agenda Doctolib. Apportez l’ordonnance, la carte Vitale et la carte de
          mutuelle.
        </p>
      </BookingBand>
    </>
  )
}
