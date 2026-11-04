// The home page's opening: the Atlas illustration on a held stage, in three beats.
//
// Finished composition (what reduced motion, a failed script and the pre-rendered page show): the
// figure beside "Bouger. Récupérer. Performer.", the lead and the two actions, on one screen.
//
// Live (data-live, set once the script runs and motion is allowed): the section is held under the
// header for under a screen of scroll. The figure stays whole and still; everything else moves with
// the finger. A light climbs its gold lines from the ground to the globe (LIGHT), the way force
// travels up the body: the legs for Bouger, the back and shoulders for Récupérer, the globe held
// up for Performer, and the lines it has passed stay lit. The words change halfway between two
// beats and drift with the scroll; the name behind the figure stays still, centred on it. A mouse moves the figure and the light
// a little. The motto is set from the start, its words in gold outline like the figure's lines
// before it fills; each word fills with gold from the bottom up as the light reaches its beat
// (FILL), until the whole motto reads. The lead below changes at each beat. Native scroll only.
//
// After the intro screen (intro.tsx) fades out, the gold lines trace themselves in, the figure
// comes up out of the dark and the words rise: CSS only (atlas.css, .atlas-stage), timed after the
// intro on the first page of a visit.
import * as React from 'react'

import { AtlasFigure } from '@/components/atlas/atlas-figure'
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

/**
 * The light on the figure's lines, one key per beat (scroll progress 0, 0.5, 1), in % of the
 * figure's box: x, y its centre, r its radius (% of the width).
 */
const LIGHT = [
  // Bouger: the legs and the footing.
  { at: 0, x: 50, y: 84, r: 40 },
  // Récupérer: the back and shoulders taking the load.
  { at: 0.5, x: 52, y: 44, r: 34 },
  // Performer: the globe, held up.
  { at: 1, x: 52, y: 22, r: 46 },
] as const

/** When each word of the motto fills with gold, in scroll progress (start, end). */
const FILL = [
  [-1, 0], // Bouger: already full on arrival
  [0.18, 0.5],
  [0.68, 1],
] as const

/** The light at progress p: part linear, part smoothstep, so it settles at each beat but never stops. */
function lightAt(p: number) {
  let i = 0
  while (i < LIGHT.length - 2 && p > LIGHT[i + 1]!.at) i++
  const a = LIGHT[i]!
  const b = LIGHT[i + 1]!
  let t = Math.min(1, Math.max(0, (p - a.at) / (b.at - a.at)))
  t = 0.45 * t + 0.55 * t * t * (3 - 2 * t)
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    r: a.r + (b.r - a.r) * t,
  }
}

/** 0 when the pin first sticks under the header, 1 when it lets go. */
function stageProgress(el: HTMLElement) {
  const pin = el.firstElementChild as HTMLElement | null
  if (!pin) return 0
  const rect = el.getBoundingClientRect()
  const stuckAt = parseFloat(getComputedStyle(pin).top) || 0
  const run = rect.height - pin.offsetHeight
  return run > 0 ? Math.min(1, Math.max(0, (stuckAt - rect.top) / run)) : 0
}

export function HomeStage() {
  const ref = React.useRef<HTMLElement>(null)
  const [live, setLive] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let raf = 0
    /** The mouse, -1 to 1 across the window (t: where it is, x and y: eased towards it). */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

    const beatEls = el.querySelectorAll<HTMLElement>('.atlas-stage__beat')
    const update = () => {
      raf = 0
      pointer.x += (pointer.tx - pointer.x) * 0.12
      pointer.y += (pointer.ty - pointer.y) * 0.12
      const settling = Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.002
      const p = stageProgress(el)
      const light = lightAt(p)
      const set = (name: string, value: number, digits = 2) =>
        el.style.setProperty(name, value.toFixed(digits))
      set('--p', p, 4)
      set('--glow-x', light.x + pointer.x * 6)
      set('--glow-y', light.y + pointer.y * 4)
      set('--glow-r', light.r)
      set('--glow-a', 1)
      set('--px', pointer.x, 3)
      set('--py', pointer.y, 3)
      // Each beat rests at 0, 0.5 or 1 (the light's keys): its word fills on the way there, and
      // its lead shows from halfway between two beats (a quick fade).
      const active = p < 0.25 ? 0 : p < 0.75 ? 1 : 2
      beatEls.forEach((beat, i) => {
        const [start, end] = FILL[i] ?? [0, 0]
        const fill = Math.min(1, Math.max(0, (p - start) / (end - start)))
        beat.toggleAttribute('data-active', i === active)
        beat.style.setProperty('--fill', fill.toFixed(3))
      })
      if (settling) schedule()
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    // A mouse moves the figure and the light a little (not touch: a finger scrolls the page).
    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (event.clientY / window.innerHeight) * 2 - 1
      schedule()
    }
    const apply = () => {
      const isLive = !reduce.matches
      setLive(isLive)
      window.removeEventListener('pointermove', onPointerMove)
      if (isLive && finePointer.matches) window.addEventListener('pointermove', onPointerMove)
      schedule()
    }
    apply()
    reduce.addEventListener('change', apply)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      reduce.removeEventListener('change', apply)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <section
      ref={ref}
      aria-labelledby="accueil-titre"
      data-live={live || undefined}
      className="atlas-stage"
    >
      <div className="atlas-stage__pin">
        <div className="atlas-stage__figure">
          <p aria-hidden className="atlas-stage__word">
            ATLAS
          </p>
          <div className="atlas-stage__parallax">
            <AtlasFigure className="atlas-stage__atlas" />
          </div>
        </div>

        <div className="atlas-stage__text">
          <h1 id="accueil-titre" className="sr-only">
            Atlas Kiné Sport, kinésithérapie du sport à Chasseneuil-du-Poitou
          </h1>
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
