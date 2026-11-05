import type * as React from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { GoldFigure } from '@/components/atlas/gold-figure'
import { BookingBand } from '@/components/atlas/booking-band'
import { PhotoSlot } from '@/components/atlas/photo-slot'
import { photos } from '@/content/photos'
import { cn } from '@/lib/utils'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/cabinet')({
  head: () =>
    seo({
      path: '/cabinet',
      title: 'Le cabinet',
      description:
        'Une rééducation active : vous travaillez avec le kiné, sur un plateau technique conçu comme une salle d’entraînement.',
    }),
  component: PracticePage,
})

// The scene's markers (% of the picture) and the legend they key to, left to right.
const floorZones = [
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
/** The frame of a photo, as in Coreloom's MediaSection. */
const photoFrame = 'overflow-hidden bg-inset'

function PracticePage() {
  return (
    <>
      {/* Unlike the other pages: a centred opening over the whole training floor, drawn as one wide scene
          with its legend, instead of an intro and media sections. */}
      <header className={`${container} pt-20 pb-10 text-center md:pt-28 md:pb-14`}>
        <p className="atlas-eyebrow m-0 text-primary-text">Le cabinet</p>
        <h1 className="mx-auto mt-4 mb-0 max-w-[22ch] font-display text-[clamp(36px,5vw,60px)] leading-[1.05] text-balance">
          Transformer l’obstacle en progression
        </h1>
        <p className="mx-auto mt-6 mb-0 max-w-[56ch] text-[18px] leading-[1.7] text-pretty text-fg-secondary">
          Une blessure interrompt une saison, un projet, parfois un quotidien. Ici, la rééducation
          est active : vous travaillez avec le kiné, pas seulement sous ses mains.
        </p>
      </header>

      <section aria-labelledby="floor-title" className="gold-scene pb-16 md:pb-24">
        <div className={container}>
          <GoldFigure
            avif="/images/practice/practice-640.avif 640w, /images/practice/practice-1168.avif 1168w"
            webp="/images/practice/practice-640.webp 640w, /images/practice/practice-1168.webp 1168w"
            src="/images/practice/practice-1168.webp"
            lines="/images/practice/practice-lines.webp"
            width={1168}
            height={722}
            sizes="(min-width: 1176px) 1120px, calc(100vw - 40px)"
            alt="Le plateau technique : une patiente en fente avant, guidée par le kinésithérapeute, entre la zone de charges et la table de soins. Au mur, le médaillon d’Atlas portant le monde."
            rest={{ x: 89, y: 23 }}
          >
            {floorZones.map((zone, i) => (
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
              <h2 id="floor-title" className="m-0 font-display text-[32px] leading-tight">
                Conçu comme une salle d’entraînement
              </h2>
              <p className="mt-4 mb-0 leading-relaxed text-fg-secondary">
                Les capteurs de force et l’analyse vidéo servent à une chose : décider sur des
                mesures, pas sur des impressions.
              </p>
            </div>
            <ol className="m-0 grid list-none content-start gap-x-10 gap-y-8 p-0 sm:grid-cols-2">
              {floorZones.map((zone, i) => (
                <li
                  key={zone.title}
                  data-marker={i + 1}
                  className="grid grid-cols-[auto_1fr] gap-4"
                >
                  <span aria-hidden className="atlas-eyebrow pt-1 text-primary-text tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="m-0 font-display text-[22px]">{zone.title}</h3>
                    <p className="mt-2 mb-0 leading-relaxed text-fg-secondary">{zone.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {photos.trainingFloorWide && (
            <div className={`${photoFrame} mt-12 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]`}>
              <PhotoSlot
                photo={photos.trainingFloorWide}
                sizes="(min-width: 1176px) 1120px, 100vw"
              />
            </div>
          )}
        </div>
      </section>

      <div className="atlas-divide">
        <section
          aria-labelledby="name-title"
          className={cn(
            container,
            'grid gap-10 py-16 md:py-24',
            photos.emblem &&
              'md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center md:gap-16',
          )}
        >
          {photos.emblem && (
            <div className={`${photoFrame} mx-auto aspect-[4/5] w-full max-w-[460px]`}>
              <PhotoSlot photo={photos.emblem} sizes="(min-width: 768px) 460px, 100vw" />
            </div>
          )}
          <div>
            <p className="atlas-eyebrow m-0 text-primary-text">Pourquoi Atlas</p>
            <h2
              id="name-title"
              className="mt-3 mb-0 max-w-[20ch] font-display text-[clamp(30px,4vw,44px)] leading-tight"
            >
              Le titan et la première vertèbre
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:gap-10">
              <div className="border-t border-border-subtle pt-5">
                <h3 className="m-0 font-display text-[22px]">En mythologie</h3>
                <p className="mt-3 mb-0 leading-relaxed text-fg-secondary">
                  Atlas porte le monde sur ses épaules : la force, l’endurance, la stabilité.
                </p>
              </div>
              <div className="border-t border-border-subtle pt-5">
                <h3 className="m-0 font-display text-[22px]">En anatomie</h3>
                <p className="mt-3 mb-0 leading-relaxed text-fg-secondary">
                  L’atlas, la première vertèbre cervicale (C1), soutient la tête et lui donne sa
                  mobilité.
                </p>
              </div>
            </div>
            <p className="mt-8 mb-0 max-w-[62ch] text-[18px] leading-[1.7]">
              Le nom dit ce que nous faisons : soutenir la reconstruction du corps, jusqu’à ce qu’il
              retrouve force et mouvement.
            </p>
          </div>
        </section>
      </div>

      <BookingBand title="Commencer par un bilan">
        <p className="m-0">
          Le premier rendez-vous fait le point sur votre blessure, vos objectifs et votre sport.
        </p>
      </BookingBand>
    </>
  )
}
