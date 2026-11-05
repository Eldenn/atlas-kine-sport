// The end of a page: a bone band with one line and each practitioner's Doctolib agenda, side by
// side. Takes the place of Coreloom's centred CTA card, which reads as a template.
import { ArrowUpRightIcon } from 'lucide-react'

import { practitioners } from '@/content/cabinet'

export function BookingBand({
  title = 'Prendre rendez-vous',
  children,
}: {
  title?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <section
      data-theme="light"
      data-surface="bone"
      data-accent="atlas"
      aria-labelledby="rendez-vous"
      className="bg-background py-16 text-foreground md:py-24"
    >
      <div className="mx-auto box-content grid max-w-[1120px] gap-10 px-5 md:px-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <h2
            id="rendez-vous"
            className="m-0 max-w-[18ch] font-display text-[clamp(30px,4vw,44px)] leading-[1.1]"
          >
            {title}
          </h2>
          {!!children && (
            <div className="mt-5 max-w-[52ch] text-[17px] leading-[1.7] text-fg-secondary">
              {children}
            </div>
          )}
        </div>
        <ul className="m-0 grid list-none content-start gap-0 p-0 lg:pt-2">
          {practitioners.map((p) => (
            <li key={p.slug} className="border-b border-border pb-5 not-first:pt-5">
              <a
                href={p.doctolib}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between gap-6"
              >
                <span>
                  <span className="block font-display text-[24px] leading-tight transition-colors group-hover:text-primary-text">
                    {p.name}
                  </span>
                  <span className="text-fg-muted mt-1 block text-[14px]">
                    Agenda Doctolib
                    <span className="sr-only"> (nouvel onglet)</span>
                  </span>
                </span>
                <ArrowUpRightIcon
                  aria-hidden
                  className="size-5 shrink-0 text-primary-text transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
