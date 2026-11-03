// Atlas on one knee with the Earth on his shoulders, in 3D, for the home page hero.
//
// The pre-rendered HTML holds a still image of the scene (the poster), so the figure is there on the
// first paint, without JavaScript, without WebGL and with Save-Data. Three.js (atlas-scene.ts) is
// fetched only once the page is idle and the figure near the screen; when its first frame is drawn
// the canvas takes over from the poster, which shows the same frame. Under reduced motion the canvas
// draws that one frame and the globe stays still.
import * as React from 'react'

import { cn } from '@/lib/utils'

const FIGURE_URL = '/3d/atlas-figure.bin'
const LAND_URL = '/3d/earth-land.png'
const LABEL = 'Atlas, un genou à terre, porte la Terre sur ses épaules.'

type Connection = { saveData?: boolean }

function canRun() {
  const connection = (navigator as Navigator & { connection?: Connection }).connection
  if (connection?.saveData) return false
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

export function Atlas3D({ className }: { className?: string }) {
  const frameRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const frame = frameRef.current
    const canvas = canvasRef.current
    if (!frame || !canvas || !canRun()) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let scene: { dispose: () => void } | undefined
    let idle = 0
    let cancelIdle: ((id: number) => void) | undefined

    const start = () => {
      import('./atlas-scene')
        .then(({ createAtlasScene }) =>
          createAtlasScene({
            canvas,
            figureUrl: FIGURE_URL,
            landUrl: LAND_URL,
            still: reduce.matches,
            onReady: () => {
              if (!disposed) setReady(true)
            },
          }),
        )
        .then((created) => {
          if (disposed) created.dispose()
          else scene = created
        })
        // A failed load leaves the poster in place, which is the same picture.
        .catch(() => {})
    }

    const restart = () => {
      scene?.dispose()
      scene = undefined
      start()
    }
    reduce.addEventListener('change', restart)

    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        near.disconnect()
        // Safari has no requestIdleCallback.
        const hasIdle = typeof window.requestIdleCallback === 'function'
        idle = hasIdle
          ? window.requestIdleCallback(start, { timeout: 2500 })
          : window.setTimeout(start, 600)
        cancelIdle = hasIdle ? window.cancelIdleCallback : window.clearTimeout
      },
      { rootMargin: '200px' },
    )
    near.observe(frame)

    return () => {
      disposed = true
      near.disconnect()
      reduce.removeEventListener('change', restart)
      cancelIdle?.(idle)
      scene?.dispose()
    }
  }, [])

  return (
    <div
      ref={frameRef}
      data-atlas-3d
      role="img"
      aria-label={LABEL}
      className={cn('relative mx-auto aspect-[5/6] w-full max-w-[560px]', className)}
    >
      <img
        src="/images/atlas-3d-1120.webp"
        srcSet="/images/atlas-3d-560.webp 560w, /images/atlas-3d-1120.webp 1120w"
        sizes="(min-width: 1024px) 520px, (min-width: 600px) 560px, 100vw"
        alt=""
        width={560}
        height={672}
        className={cn(
          'absolute inset-0 size-full object-contain transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
          ready && 'opacity-0',
        )}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          'absolute inset-0 size-full opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
          ready && 'opacity-100',
        )}
      />
    </div>
  )
}
