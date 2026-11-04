// Atlas on one knee with the Earth on his shoulders: the home page's figure, a 2D illustration.
//
// The picture is public/images/atlas/atlas.svg (scripts/atlas-2d/build.sh), in an <img>: it is in
// the pre-rendered HTML and shows on the first paint, without JavaScript. When motion is allowed,
// its gold lines are drawn again over it (atlas.css, .atlas-figure__lines): a gold layer cut out by
// the mask of the lines (atlas-lines.svg), which traces them in on arrival and lights them up
// where the home stage points it (--glow-*).
import { cn } from '@/lib/utils'

const LABEL = 'Atlas, un genou à terre, porte la Terre sur ses épaules.'

export function AtlasFigure({ className }: { className?: string }) {
  return (
    <div role="img" aria-label={LABEL} className={cn('atlas-figure', className)}>
      <img
        src="/images/atlas/atlas.svg"
        alt=""
        width={1536}
        height={2304}
        fetchPriority="high"
        className="atlas-figure__art"
      />
      <span aria-hidden className="atlas-figure__lines" />
    </div>
  )
}
