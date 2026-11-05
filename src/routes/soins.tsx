import { createFileRoute } from '@tanstack/react-router'

import { BookingBand } from '@/components/atlas/booking-band'
import { GoldFigure } from '@/components/atlas/gold-figure'
import { PageIntro } from '@/components/atlas/page-intro'
import { Faq } from '@/components/faq'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/soins')({
  head: () =>
    seo({
      path: '/soins',
      title: 'Soins',
      description:
        'Kinésithérapie du sport, rééducation de l’épaule, du genou, de la cheville et du rachis, reconditionnement et suivi du sportif.',
    }),
  component: Soins,
})

const soins = [
  {
    title: 'Évaluer',
    text: 'Le bilan initial mesure la douleur, la mobilité et la force, et part de ce que votre sport ou votre quotidien vous demande. Il fixe les objectifs et les tests qui diront quand passer à l’étape suivante.',
  },
  {
    title: 'Soigner',
    text: 'Thérapie manuelle et exercice thérapeutique pour les blessures musculaires, tendineuses et articulaires : épaule, genou, cheville, rachis lombaire et cervical, troubles musculo-squelettiques, douleurs persistantes.',
  },
  {
    title: 'Progresser',
    text: 'Reconditionnement et retour au sport : la charge augmente par paliers, guidée par les capteurs de force et l’analyse vidéo du geste.',
  },
]

function Soins() {
  return (
    <>
      <PageIntro
        eyebrow="Soins"
        title="Du bilan au retour au sport"
        media={
          <GoldFigure
            className="mx-auto w-full max-w-[420px] md:max-w-none"
            avif="/images/soins/soins-420.avif 420w, /images/soins/soins-783.avif 783w"
            webp="/images/soins/soins-420.webp 420w, /images/soins/soins-783.webp 783w"
            src="/images/soins/soins-783.webp"
            lines="/images/soins/soins-lines.webp"
            width={783}
            height={652}
            sizes="(min-width: 768px) 46vw, 90vw"
            alt="Un kinésithérapeute, un genou au sol, palpe le genou d’un sportif en fente avant."
            rest={{ x: 47, y: 58 }}
          />
        }
      >
        <p>
          Sur prescription médicale, les séances de kinésithérapie sont remboursées par l’Assurance
          maladie. Les deux praticiens sont conventionnés et pratiquent le tiers payant.
        </p>
      </PageIntro>
      <section className="atlas-divide px-5 py-16 md:px-7">
        <ol className="m-0 mx-auto grid max-w-[1120px] list-none gap-12 p-0">
          {soins.map((soin, i) => (
            <li key={soin.title} className="grid gap-4 md:grid-cols-[200px_1fr]">
              <p className="atlas-eyebrow m-0 text-primary-text">0{i + 1}</p>
              <div>
                <h2 className="m-0 font-display text-[32px]">{soin.title}</h2>
                <p className="mt-3 mb-0 max-w-[62ch] leading-relaxed text-fg-secondary">
                  {soin.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      {/* TODO(Matthieu): questions to confirm with the practitioners. */}
      <Faq
        title={<span className="font-display">Questions fréquentes</span>}
        items={[
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
        ]}
        className="border-t-0 pt-4"
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
