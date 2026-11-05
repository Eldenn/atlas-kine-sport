// A practitioner without a card around them: the portrait large, the name in Marcellus, the areas
// of practice as one line of text, the RPPS number small, and one action (their Doctolib agenda).
// The portrait and the name lead to the full profile. Used on the home page and on L'équipe.
import { ArrowUpRightIcon } from 'lucide-react'

import type { Practitioner } from '@/content/cabinet'
import { AppLink } from '@/lib/link'
import { cn } from '@/lib/utils'

export function PractitionerFeature({
  practitioner: p,
  headingLevel = 3,
  areas = p.areas,
  bio,
  className,
}: {
  practitioner: Practitioner
  headingLevel?: 2 | 3
  /** The areas shown; all of them by default. */
  areas?: string[]
  /** A short text under the areas (L'équipe shows the bio). */
  bio?: React.ReactNode
  className?: string
}) {
  const Name = `h${headingLevel}` as const
  const firstName = p.name.split(' ')[0]
  return (
    <article className={cn('flex flex-col', className)}>
      <AppLink
        href={`/equipe/${p.slug}`}
        tabIndex={-1}
        aria-hidden
        className="atlas-portrait block aspect-[4/5] w-full max-w-[400px] overflow-hidden"
      >
        <img
          src={p.photo}
          alt=""
          width={480}
          height={600}
          loading="lazy"
          className="size-full object-cover"
        />
      </AppLink>
      <p className="atlas-eyebrow mt-6 mb-0 text-primary-text">{p.profession}</p>
      <Name className="mt-2 mb-0 font-display text-[clamp(28px,3vw,36px)] leading-[1.1]">
        <AppLink href={`/equipe/${p.slug}`} className="hover:text-primary-text">
          {p.name}
        </AppLink>
      </Name>
      <p className="mt-4 mb-0 leading-relaxed text-fg-secondary">{areas.join(' · ')}</p>
      {!!bio && <div className="mt-4 max-w-[60ch] leading-relaxed text-fg-secondary">{bio}</div>}
      <p className="text-fg-muted mt-3 mb-0 text-[13px]">
        RPPS <span className="tabular-nums">{p.rpps}</span> · {p.convention.toLowerCase()}
      </p>
      <p className="mt-5 mb-0">
        <a href={p.doctolib} target="_blank" rel="noopener noreferrer" className="atlas-link">
          Prendre rendez-vous avec {firstName}
          <ArrowUpRightIcon aria-hidden className="size-4" />
          <span className="sr-only"> sur Doctolib (nouvel onglet)</span>
        </a>
      </p>
    </article>
  )
}
