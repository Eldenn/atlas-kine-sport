// The top of an inner page: eyebrow, Marcellus title and a lead paragraph, with an optional
// illustration beside the text from md up (below it on a phone).
import type * as React from 'react'

import { cn } from '@/lib/utils'

export function PageIntro({
  eyebrow,
  title,
  children,
  media,
}: {
  eyebrow: string
  title: React.ReactNode
  children?: React.ReactNode
  /** An illustration (`<picture>`/`<img>` with its `alt`) set beside the text. */
  media?: React.ReactNode
}) {
  return (
    <header
      className={cn(
        'mx-auto box-content max-w-[1120px] px-5 pt-20 pb-12 md:px-7 md:pt-28',
        !!media &&
          'grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:gap-12',
      )}
    >
      <div>
        <p className="atlas-eyebrow m-0 text-primary-text">{eyebrow}</p>
        <h1 className="mt-4 mb-0 max-w-[20ch] font-display text-[clamp(36px,5vw,60px)] leading-[1.05]">
          {title}
        </h1>
        {!!children && (
          <div className="mt-6 max-w-[62ch] text-[18px] leading-[1.7] text-fg-secondary">
            {children}
          </div>
        )}
      </div>
      {media}
    </header>
  )
}
