// The top of an inner page: eyebrow, Marcellus title and a lead paragraph.
import type * as React from 'react'

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <header className="mx-auto max-w-[1120px] px-5 pt-20 pb-12 md:px-7 md:pt-28">
      <p className="atlas-eyebrow m-0 text-primary-text">{eyebrow}</p>
      <h1 className="mt-4 mb-0 max-w-[20ch] font-display text-[clamp(36px,5vw,60px)] leading-[1.05]">
        {title}
      </h1>
      {!!children && (
        <div className="mt-6 max-w-[62ch] text-[18px] leading-[1.7] text-fg-secondary">
          {children}
        </div>
      )}
    </header>
  )
}
