import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageIntro } from '@/components/atlas/page-intro'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { practitioners } from '@/content/cabinet'
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
  component: Fiche,
})

function Fiche() {
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
      <section className="mx-auto box-content grid max-w-[1120px] grid-cols-[minmax(0,1fr)] gap-12 border-t border-border-subtle px-5 py-12 md:grid-cols-[240px_minmax(0,1fr)] md:px-7 lg:grid-cols-[280px_minmax(0,1fr)_minmax(0,1fr)]">
        <img
          src={p.photo}
          alt={`Portrait de ${p.name}`}
          width={480}
          height={600}
          className="aspect-[4/5] w-full max-w-[280px] rounded-lg object-cover md:row-span-2 lg:row-span-1"
        />
        <div>
          <h2 className="m-0 font-display text-[26px]">Domaines d’intervention</h2>
          <ul className="mt-5 mb-0 flex list-none flex-wrap gap-2 p-0">
            {p.areas.map((area) => (
              <li key={area}>
                <Badge variant="outline">{area}</Badge>
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
    </>
  )
}
