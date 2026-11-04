// A gold-line illustration animated like the home page's Atlas: its gold lines trace themselves in
// from the ground up, the figure comes up out of the dark under them, then a light climbs the lines
// and settles where the picture's eye should go (`rest`), breathing slowly.
//
// The picture is a plain <picture> (in the pre-rendered HTML, first paint, no JavaScript). The
// animation is CSS only (gold-figure.css): a gold layer cut out by the mask of the lines (`lines`,
// white where the gold is), drawn over it. Still for anyone who asks for reduced motion.
import type * as React from 'react'

import { cn } from '@/lib/utils'

export function GoldFigure({
  avif,
  webp,
  src,
  lines,
  width,
  height,
  sizes,
  alt,
  rest,
  className,
}: {
  /** `srcSet` strings for each format. */
  avif: string
  webp: string
  /** The fallback image. */
  src: string
  /** The mask of the gold lines: an image whose alpha is the lines. */
  lines: string
  width: number
  height: number
  sizes: string
  alt: string
  /** Where the light settles, in % of the box. */
  rest: { x: number; y: number }
  className?: string
}) {
  return (
    <div
      className={cn('gold-figure', className)}
      style={
        {
          '--gold-figure-lines': `url('${lines}')`,
          '--gold-figure-rest-x': rest.x,
          '--gold-figure-rest-y': rest.y,
        } as React.CSSProperties
      }
    >
      <picture>
        <source type="image/avif" srcSet={avif} sizes={sizes} />
        <source type="image/webp" srcSet={webp} sizes={sizes} />
        <img
          src={src}
          width={width}
          height={height}
          alt={alt}
          decoding="async"
          className="gold-figure__art"
        />
      </picture>
      <span aria-hidden className="gold-figure__lines" />
    </div>
  )
}
