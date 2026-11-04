// The home page's opening: the Atlas illustration on a held stage, in three beats.
//
// Finished composition (what reduced motion, a failed script and the pre-rendered page show): the
// figure beside "Bouger. Récupérer. Performer.", the lead and the two actions, on one screen.
//
// Live (data-live, set once the script runs and motion is allowed): the section is held under the
// header for under a screen of scroll. Everything moves with the finger: a camera closes in on the
// figure and pulls back (CAMERA), a light runs along its gold lines to the part each beat is about
// (the shoulders under the load, then the legs), the words change halfway between framings and
// drift with the scroll, the name behind drifts. A mouse moves the figure and the light a little.
// Native scroll only.
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
 * The camera and the light, one key per beat (scroll progress 0, 0.5, 1). Positions are in % of
 * the figure's box. zoom: 1 is the whole figure; fx, fy: the point zoomed on; tx, ty: where that
 * point is brought; gx, gy: the light's centre on the lines, gr its radius (% of the width), ga its
 * strength (0 to 1).
 */
const CAMERA = [
  // Bouger: the whole figure, as drawn.
  { at: 0, zoom: 1, fx: 50, fy: 50, tx: 50, ty: 50, gx: 52, gy: 20, gr: 30, ga: 0 },
  // Récupérer: close on the shoulders and arms taking the load; the light on them.
  { at: 0.5, zoom: 1.5, fx: 52, fy: 38, tx: 57, ty: 50, gx: 52, gy: 41, gr: 30, ga: 1 },
  // Performer: the whole figure again, from a little lower; the light on the legs.
  { at: 1, zoom: 1.08, fx: 50, fy: 70, tx: 50, ty: 67, gx: 54, gy: 76, gr: 34, ga: 1 },
] as const

/** The camera at progress p: part linear, part smoothstep, so it settles at each beat but never stops. */
function framing(p: number) {
  let i = 0
  while (i < CAMERA.length - 2 && p > CAMERA[i + 1]!.at) i++
  const a = CAMERA[i]!
  const b = CAMERA[i + 1]!
  let t = Math.min(1, Math.max(0, (p - a.at) / (b.at - a.at)))
  t = 0.45 * t + 0.55 * t * t * (3 - 2 * t)
  const mix = (key: keyof (typeof CAMERA)[number]) => a[key] + (b[key] - a[key]) * t
  return {
    zoom: mix('zoom'),
    fx: mix('fx'),
    fy: mix('fy'),
    tx: mix('tx'),
    ty: mix('ty'),
    gx: mix('gx'),
    gy: mix('gy'),
    gr: mix('gr'),
    ga: mix('ga'),
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
      const f = framing(p)
      const set = (name: string, value: number, digits = 2) =>
        el.style.setProperty(name, value.toFixed(digits))
      set('--p', p, 4)
      set('--cam-zoom', f.zoom, 4)
      set('--cam-fx', f.fx)
      set('--cam-fy', f.fy)
      set('--cam-dx', f.tx - f.fx)
      set('--cam-dy', f.ty - f.fy)
      set('--glow-x', f.gx + pointer.x * 6)
      set('--glow-y', f.gy + pointer.y * 4)
      set('--glow-r', f.gr)
      set('--glow-a', f.ga, 3)
      set('--px', pointer.x, 3)
      set('--py', pointer.y, 3)
      // Each beat rests at 0, 0.5 or 1 (the camera's framings). The nearest one shows, so the word
      // changes halfway between two framings (a quick fade); its height follows the scroll, so it
      // keeps moving with the finger. d is the distance from rest, in half-stages.
      const active = p < 0.25 ? 0 : p < 0.75 ? 1 : 2
      beatEls.forEach((beat, i) => {
        const d = (p - i * 0.5) / 0.5
        beat.toggleAttribute('data-active', i === active)
        beat.style.setProperty('--beat-y', `${(-d * 36).toFixed(1)}px`)
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
        <p aria-hidden className="atlas-stage__word">
          ATLAS
        </p>

        <div className="atlas-stage__figure">
          <div className="atlas-stage__camera">
            <AtlasFigure className="atlas-stage__atlas" />
          </div>
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
