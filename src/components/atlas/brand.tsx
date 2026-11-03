// The wordmark: "ATLAS" in Marcellus over "KINÉ SPORT" in spaced Montserrat, as on the moodboard.
// TODO: swap for the emblem (direction 1) once the SVG files are delivered.
import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Atlas Kiné Sport, accueil"
      className={cn('flex flex-col items-center leading-none text-foreground', className)}
    >
      <span className="font-display text-[26px] tracking-[0.08em]">ATLAS</span>
      <span className="atlas-eyebrow mt-1 text-[9px] tracking-[0.42em] text-primary-text">
        Kiné sport
      </span>
    </Link>
  )
}
