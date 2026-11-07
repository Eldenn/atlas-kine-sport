import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageIntro } from '@/components/atlas/page-intro'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { practitioners, type Training } from '@/content/practice'
import { AppLink } from '@/lib/link'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/equipe/$slug')({
  loader: ({ params }) => {
    const practitioner = practitioners.find((p) => p.slug === params.slug)
    if (!practitioner) throw notFound()
    return practitioner
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({
          path: `/equipe/${loaderData.slug}`,
          title: `${loaderData.name}, masseur-kinésithérapeute`,
          // Kept under ~160 characters: the first areas only, the page lists them all.
          description: `${loaderData.name}, kinésithérapeute du sport à Chasseneuil-du-Poitou : ${loaderData.areas.slice(1, 4).join(', ').toLowerCase()}. Rendez-vous sur Doctolib.`,
        })
      : {},
  component: PractitionerPage,
})

function PractitionerPage() {
  const p = Route.useLoaderData()
  return (
    <>
      <div className="mx-auto box-content max-w-[1120px] px-5 pt-8 md:px-7">
        <Breadcrumb aria-label="Fil d’Ariane">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <AppLink href="/equipe">L’équipe</AppLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{p.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <PageIntro eyebrow={p.profession} title={p.name}>
        <p>{p.bio}</p>
      </PageIntro>
      <section className="atlas-divide mx-auto box-content grid max-w-[1120px] grid-cols-[minmax(0,1fr)] gap-12 px-5 py-12 md:grid-cols-[240px_minmax(0,1fr)] md:px-7 lg:grid-cols-[280px_minmax(0,1fr)_minmax(0,1fr)]">
        <img
          src={p.photo}
          alt={`Portrait de ${p.name}`}
          width={480}
          height={600}
          className="aspect-[4/5] w-full max-w-[280px] object-cover md:row-span-2 lg:row-span-1"
        />
        <div>
          <h2 className="m-0 font-display text-[26px]">Domaines d’intervention</h2>
          <ul className="mt-5 mb-0 list-none p-0 text-[16px] leading-relaxed">
            {p.areas.map((area) => (
              <li key={area} className="border-b border-border-subtle py-2.5 first:pt-0">
                {area}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="m-0 font-display text-[26px]">Informations</h2>
          <dl className="mt-5 mb-0 grid gap-x-6 gap-y-1 text-[15px] sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-y-3">
            <dt className="text-fg-muted">N° RPPS</dt>
            <dd className="m-0 mb-2 sm:mb-0">{p.rpps}</dd>
            {!!p.ordre && (
              <>
                <dt className="text-fg-muted">N° Ordre</dt>
                <dd className="m-0 mb-2 sm:mb-0">{p.ordre}</dd>
              </>
            )}
            <dt className="text-fg-muted">Conventionnement</dt>
            <dd className="m-0 mb-2 sm:mb-0">{p.convention}</dd>
            <dt className="text-fg-muted">Paiement</dt>
            <dd className="m-0">{p.payment}</dd>
          </dl>
          <Button
            asChild
            size="lg"
            className="mt-8 h-auto min-h-11 w-full py-2.5 whitespace-normal sm:w-auto"
          >
            <a href={p.doctolib} target="_blank" rel="noopener noreferrer">
              Prendre rendez-vous sur Doctolib<span className="sr-only"> (nouvel onglet)</span>
            </a>
          </Button>
        </div>
      </section>
      {p.trainings.length > 0 && <Trainings trainings={p.trainings} />}
    </>
  )
}

/** Continuing education, grouped by year: the year in Marcellus on the left, the courses on the
 *  right. Same rules as the "Domaines d’intervention" list, so the page reads as one document. */
function Trainings({ trainings }: { trainings: Training[] }) {
  const years = [...new Set(trainings.map((t) => t.year))].sort((a, b) => b - a)
  return (
    <section
      aria-labelledby="formations"
      className="atlas-divide mx-auto box-content grid max-w-[1120px] grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-8 px-5 py-12 md:grid-cols-[240px_minmax(0,1fr)] md:px-7 md:pb-20 lg:grid-cols-[280px_minmax(0,1fr)]"
    >
      <div>
        <h2 id="formations" className="m-0 font-display text-[26px]">
          Formations
        </h2>
        <p className="mt-4 mb-0 max-w-[30ch] text-[15px] leading-relaxed text-fg-secondary">
          Formation continue, de la plus récente à la plus ancienne.
        </p>
      </div>
      <div>
        {years.map((year) => (
          <div
            key={year}
            className="grid grid-cols-[56px_minmax(0,1fr)] gap-x-5 border-b border-border-subtle py-5 first:pt-0 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-x-8"
          >
            <h3 className="m-0 font-display text-[20px] leading-[1.35] font-normal text-primary-text tabular-nums sm:text-[24px] sm:leading-[1.1]">
              {year}
            </h3>
            <ul className="m-0 grid list-none gap-4 p-0">
              {trainings
                .filter((t) => t.year === year)
                .map((t) => (
                  <li key={t.title}>
                    <p className="m-0 text-[16px] leading-snug">{t.title}</p>
                    <p className="text-fg-muted mt-1 mb-0 text-[14px] leading-snug">{t.by}</p>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
