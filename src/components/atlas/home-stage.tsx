// The home page's opening: the bronze Atlas on a held stage, in three beats.
//
// Finished composition (what reduced motion, a failed script and the pre-rendered page show): the
// statue beside "Bouger. Récupérer. Performer.", the lead and the two actions, on one screen.
//
// Live (data-live, set once the script runs and motion is allowed): the section is held under the
// header for a little over a screen of scroll. Everything moves with the finger: the camera goes
// round the statue (atlas-scene.ts, KEYS), the words run through like a reel (Bouger, Récupérer,
// Performer, each readable at its rest point), the name behind drifts. Native scroll only.
//
// After the intro screen (intro.tsx) fades out, the statue comes up out of the dark and the words
// rise: CSS only (atlas.css, .atlas-stage), timed after the intro on the first page of a visit.
import * as React from 'react'

import { Atlas3D } from '@/components/atlas/atlas-3d'
import { Button } from '@/components/ui/button'
import { AppLink } from '@/lib/link'

const beats = [
  {
    word: 'Bouger.',
    lead: 'Un cabinet de kinésithérapie du sport pour les athlètes de tous niveaux, et pour toute personne qui veut retrouver un corps fiable.',
  },
  {
    word: 'Récupérer.',
    lead: 'Un bilan qui mesure douleur, mobilité et force, puis la thérapie manuelle et la rééducation de la blessure.',
  },
  {
    word: 'Performer.',
    lead: 'Une charge qui augmente quand vos mesures le permettent, jusqu’au retour à votre sport.',
  },
] as const

function stageProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const run = rect.height - window.innerHeight
  return run > 0 ? Math.min(1, Math.max(0, -rect.top / run)) : 0
}

export function HomeStage() {
  const ref = React.useRef<HTMLElement>(null)
  const [live, setLive] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0

    const beatEls = el.querySelectorAll<HTMLElement>('.atlas-stage__beat')
    const update = () => {
      raf = 0
      const p = stageProgress(el)
      el.style.setProperty('--p', p.toFixed(4))
      // Each beat rests at 0, 0.5 or 1 (the camera's framings) and runs past it with the scroll:
      // d is its distance from rest, in half-stages; it rises in from below and leaves upwards.
      beatEls.forEach((beat, i) => {
        const d = (p - i * 0.5) / 0.5
        const a = Math.min(1, Math.max(0, (Math.abs(d) - 0.12) / 0.38))
        beat.style.setProperty('--beat-o', (1 - a * a * (3 - 2 * a)).toFixed(3))
        beat.style.setProperty('--beat-y', `${(-d * 72).toFixed(1)}px`)
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const apply = () => {
      setLive(!reduce.matches)
      onScroll()
    }
    apply()
    reduce.addEventListener('change', apply)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      reduce.removeEventListener('change', apply)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const progress = React.useCallback(() => (ref.current ? stageProgress(ref.current) : 0), [])

  return (
    <section
      ref={ref}
      aria-labelledby="accueil-titre"
      data-live={live || undefined}
      className="atlas-stage"
    >
      <div className="atlas-stage__pin">
        <p aria-hidden className="atlas-stage__word">
          ATLAS
        </p>

        <div className="atlas-stage__figure">
          <Atlas3D
            progress={live ? progress : undefined}
            sizes="(min-width: 1024px) 640px, 100vw"
            className="flex h-full w-full justify-center"
            frameClassName="atlas-stage__frame h-full w-auto max-w-full"
            canvasClassName="atlas-stage__canvas"
          />
        </div>

        <div className="atlas-stage__text">
          <h1 id="accueil-titre" className="sr-only">
            Atlas Kiné Sport, kinésithérapie du sport à Chasseneuil-du-Poitou
          </h1>
          <p className="atlas-eyebrow atlas-stage__rise m-0 text-primary-text">
            Kiné sport · Chasseneuil-du-Poitou
          </p>
          <div className="atlas-stage__beats">
            {beats.map((b, i) => (
              <div key={b.word} className="atlas-stage__beat" data-index={i}>
                <p className="atlas-stage__beat-word atlas-stage__rise">{b.word}</p>
                <p className="atlas-stage__beat-lead atlas-stage__rise">{b.lead}</p>
              </div>
            ))}
          </div>
          <div className="atlas-stage__rise mt-6 flex flex-wrap gap-3 lg:mt-8 [&>*]:max-lg:h-10 [&>*]:max-lg:px-4">
            <Button asChild size="lg">
              <AppLink href="/contact">Prendre rendez-vous</AppLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="atlas-stage__secondary">
              <AppLink href="/cabinet">Découvrir le cabinet</AppLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
