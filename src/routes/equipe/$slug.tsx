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
          description: `${loaderData.name}, kinésithérapeute du sport chez Atlas Kiné Sport : ${loaderData.areas.join(', ').toLowerCase()}.`,
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
      <section className="mx-auto box-content grid max-w-[1120px] gap-12 border-t border-border-subtle px-5 py-12 md:grid-cols-[280px_1fr_1fr] md:px-7">
        <img
          src={p.photo}
          alt={`Portrait de ${p.name}`}
          width={480}
          height={600}
          className="aspect-[4/5] w-full max-w-[280px] rounded-lg object-cover"
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
          <dl className="mt-5 mb-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-[15px]">
            <dt className="text-fg-muted">N° RPPS</dt>
            <dd className="m-0">{p.rpps}</dd>
            {!!p.ordre && (
              <>
                <dt className="text-fg-muted">N° Ordre</dt>
                <dd className="m-0">{p.ordre}</dd>
              </>
            )}
            <dt className="text-fg-muted">Conventionnement</dt>
            <dd className="m-0">{p.convention}</dd>
            <dt className="text-fg-muted">Paiement</dt>
            <dd className="m-0">{p.payment}</dd>
          </dl>
          <Button asChild size="lg" className="mt-8">
            <a href={p.doctolib} target="_blank" rel="noopener noreferrer">
              Prendre rendez-vous sur Doctolib<span className="sr-only"> (nouvel onglet)</span>
            </a>
          </Button>
        </div>
      </section>
    </>
  )
}
