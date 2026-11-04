import type * as React from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { GoldFigure } from '@/components/atlas/gold-figure'
import { CtaSection } from '@/components/cta-section'
import { Button } from '@/components/ui/button'
import { AppLink } from '@/lib/link'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/cabinet')({
  head: () =>
    seo({
      path: '/cabinet',
      title: 'Le cabinet',
      description:
        'Une rééducation active : vous travaillez avec le kiné, sur un plateau technique conçu comme une salle d’entraînement.',
    }),
  component: Cabinet,
})

// The scene's markers (% of the picture) and the legend they key to, left to right.
const plateau = [
  {
    x: 14,
    y: 30,
    title: 'Zone de charges',
    text: 'Disques, haltères et kettlebells : la charge se dose, puis augmente par paliers.',
  },
  {
    x: 13,
    y: 85,
    title: 'Sol de travail',
    text: 'Parquet et piste de sprint pour courir, sauter et changer de direction avant la reprise.',
  },
  {
    x: 51,
    y: 40,
    title: 'Travail actif',
    text: 'Vous faites l’exercice, le kiné observe, corrige et ajuste la consigne.',
  },
  {
    x: 95,
    y: 51,
    title: 'Espace de soins',
    text: 'Une table au calme pour le bilan et la thérapie manuelle.',
  },
]

const container = 'mx-auto box-content max-w-[1120px] px-5 md:px-7'

function Cabinet() {
  return (
    <>
      {/* Unlike the other pages: the title and the lead side by side, then the whole plateau as one
          wide scene with its legend, instead of an intro and media sections. */}
      <header className={`${container} pt-20 pb-10 md:pt-28 md:pb-14`}>
        <p className="atlas-eyebrow m-0 text-primary-text">Le cabinet</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
          <h1 className="m-0 max-w-[16ch] font-display text-[clamp(36px,5vw,60px)] leading-[1.05]">
            Transformer l’obstacle en progression
          </h1>
          <p className="m-0 max-w-[52ch] text-[18px] leading-[1.7] text-fg-secondary">
            Une blessure interrompt une saison, un projet, parfois un quotidien. Ici, la rééducation
            est active : vous travaillez avec le kiné, pas seulement sous ses mains.
          </p>
        </div>
      </header>

      <section aria-labelledby="plateau-titre" className="gold-scene pb-16 md:pb-24">
        <div className={container}>
          <GoldFigure
            avif="/images/cabinet/cabinet-640.avif 640w, /images/cabinet/cabinet-1168.avif 1168w"
            webp="/images/cabinet/cabinet-640.webp 640w, /images/cabinet/cabinet-1168.webp 1168w"
            src="/images/cabinet/cabinet-1168.webp"
            lines="/images/cabinet/cabinet-lines.webp"
            width={1168}
            height={722}
            sizes="(min-width: 1176px) 1120px, calc(100vw - 40px)"
            alt="Le plateau technique : une patiente en fente avant, guidée par le kinésithérapeute, entre la zone de charges et la table de soins. Au mur, le médaillon d’Atlas portant le monde."
            rest={{ x: 89, y: 23 }}
          >
            {plateau.map((zone, i) => (
              <span
                key={zone.title}
                aria-hidden
                data-marker={i + 1}
                className="gold-marker"
                style={{ '--x': zone.x, '--y': zone.y, '--i': i } as React.CSSProperties}
              >
                {i + 1}
              </span>
            ))}
          </GoldFigure>

          <div className="mt-12 grid gap-10 border-t border-border-subtle pt-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-16">
            <div>
              <p className="atlas-eyebrow m-0 text-primary-text">Plateau technique</p>
              <h2 id="plateau-titre" className="mt-3 mb-0 font-display text-[32px] leading-tight">
                Conçu comme une salle d’entraînement
              </h2>
              <p className="mt-4 mb-0 leading-relaxed text-fg-secondary">
                Les capteurs de force et l’analyse vidéo servent à une chose : décider sur des
                mesures, pas sur des impressions.
              </p>
            </div>
            <ol className="m-0 grid list-none gap-x-10 gap-y-8 p-0 sm:grid-cols-2">
              {plateau.map((zone, i) => (
                <li
                  key={zone.title}
                  data-marker={i + 1}
                  className="grid grid-cols-[auto_1fr] gap-4"
                >
                  <span aria-hidden className="atlas-eyebrow pt-1 text-primary-text tabular-nums">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="m-0 font-display text-[22px]">{zone.title}</h3>
                    <p className="mt-2 mb-0 leading-relaxed text-fg-secondary">{zone.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div
        data-theme="light"
        data-surface="bone"
        data-accent="atlas"
        className="bg-background text-foreground"
      >
        <section aria-labelledby="nom-titre" className={`${container} py-16 md:py-24`}>
          <p className="atlas-eyebrow m-0 text-primary-text">Pourquoi Atlas</p>
          <h2
            id="nom-titre"
            className="mt-3 mb-0 max-w-[20ch] font-display text-[clamp(30px,4vw,44px)] leading-tight"
          >
            Le titan et la première vertèbre
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
            <div className="border-t border-border-subtle pt-6">
              <h3 className="m-0 font-display text-[22px]">En mythologie</h3>
              <p className="mt-3 mb-0 leading-relaxed text-fg-secondary">
                Atlas porte le monde sur ses épaules : la force, l’endurance, la stabilité.
              </p>
            </div>
            <div className="border-t border-border-subtle pt-6">
              <h3 className="m-0 font-display text-[22px]">En anatomie</h3>
              <p className="mt-3 mb-0 leading-relaxed text-fg-secondary">
                L’atlas, la première vertèbre cervicale (C1), soutient la tête et lui donne sa
                mobilité.
              </p>
            </div>
          </div>
          <p className="mt-10 mb-0 max-w-[62ch] text-[18px] leading-[1.7]">
            Le nom dit ce que nous faisons : soutenir la reconstruction du corps, jusqu’à ce qu’il
            retrouve force et mouvement.
          </p>
        </section>
      </div>

      <CtaSection
        title={<span className="font-display">Commencer par un bilan</span>}
        description="Le premier rendez-vous fait le point sur votre blessure, vos objectifs et votre sport."
        actions={
          <Button asChild size="lg">
            <AppLink href="/contact">Prendre rendez-vous</AppLink>
          </Button>
        }
      />
    </>
  )
}
