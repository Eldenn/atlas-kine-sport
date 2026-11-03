// The logo: the Atlas emblem (bone, from the current site) beside "ATLAS" in Marcellus over
// "KINÉ SPORT" in spaced Montserrat, as on the moodboard.
import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Atlas Kiné Sport, accueil"
      className={cn(
        'flex shrink-0 items-center gap-2.5 leading-none whitespace-nowrap text-foreground',
        className,
      )}
    >
      {/* The PNG has a wide transparent margin: the visible emblem is about 62% of it. */}
      <img src="/images/emblem-bone.png" alt="" width={56} height={56} className="-m-2 size-14" />
      <span className="flex flex-col items-center">
        <span className="font-display text-[24px] tracking-[0.08em]">ATLAS</span>
        <span className="atlas-eyebrow mt-1 text-[8.5px] tracking-[0.42em] text-primary-text">
          Kiné sport
        </span>
      </span>
    </Link>
  )
}
