import { createFileRoute } from '@tanstack/react-router'
import { AccessibilityIcon, CheckIcon, InfoIcon } from 'lucide-react'
import type * as React from 'react'

import { DoctolibButtons } from '@/components/atlas/doctolib-buttons'
import { PageIntro } from '@/components/atlas/page-intro'
import { ContactDetails, OpeningHours } from '@/components/contact-section'
import { CtaSection } from '@/components/cta-section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cabinet, type Practitioner, practitioners } from '@/content/cabinet'
import { byCategory, type Tarif, tarifsDelman, tarifsMoeine } from '@/content/tarifs'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/infos-pratiques')({
  head: () =>
    seo({
      path: '/infos-pratiques',
      title: 'Infos pratiques et tarifs',
      description:
        'Horaires, accès, conventionnement, moyens de paiement et tarifs des prestations non remboursées du cabinet Atlas Kiné Sport.',
    }),
  component: InfosPratiques,
})

const sections = [
  { id: 'venir', label: 'Venir au cabinet' },
  { id: 'remboursement', label: 'Remboursement et paiement' },
  { id: 'premiere-seance', label: 'Votre première séance' },
  { id: 'tarifs', label: 'Tarifs hors remboursement' },
] as const

// box-content, like PageIntro: the text lines up with the page title.
const container = 'mx-auto box-content max-w-[1120px] px-5 md:px-7'
// Room for the sticky site header (64 px) and the page's own nav under it.
const anchorOffset = 'scroll-mt-20 md:scroll-mt-32'

const tarifs: Record<string, Tarif[]> = {
  'delman-ahmed-mustafa': tarifsDelman,
  'moeine-khalifeh': tarifsMoeine,
}

function SectionHeading({
  id,
  index,
  title,
  children,
}: {
  id: string
  index: number
  title: string
  children?: React.ReactNode
}) {
  return (
    <div>
      <p className="atlas-eyebrow m-0 text-primary-text">{String(index + 1).padStart(2, '0')}</p>
      <h2 id={id} className="mt-3 mb-0 font-display text-[clamp(28px,3.2vw,36px)] leading-[1.15]">
        {title}
      </h2>
      {!!children && (
        <div className="mt-4 max-w-[58ch] text-[16px] leading-[1.7] text-fg-secondary">
          {children}
        </div>
      )}
    </div>
  )
}

function PageNav() {
  return (
    <nav
      aria-label="Sur cette page"
      className="border-y border-border-subtle bg-background/85 backdrop-blur-md md:sticky md:top-16 md:z-10"
    >
      <ul className={`${container} m-0 flex list-none flex-wrap gap-x-6 gap-y-2 py-3.5`}>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="inline-flex items-baseline gap-2 rounded-xs text-[14px] text-fg-secondary underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring"
            >
              <span aria-hidden className="font-mono text-[11px] text-primary-text">
                {String(i + 1).padStart(2, '0')}
              </span>
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function VenirAuCabinet() {
  return (
    <section id="venir" aria-labelledby="venir-titre" className={`${anchorOffset} py-16 md:py-24`}>
      <div className={`${container} grid gap-12 lg:grid-cols-2 lg:gap-16`}>
        <div className="flex flex-col gap-10">
          <SectionHeading id="venir-titre" index={0} title={sections[0].label}>
            <p className="m-0">
              Le cabinet reçoit sur rendez-vous, du lundi au vendredi, à Chasseneuil-du-Poitou.
            </p>
          </SectionHeading>
          <ContactDetails
            address={
              <>
                {cabinet.address.street}
                <br />
                {cabinet.address.postalCode} {cabinet.address.city}
              </>
            }
            directionsHref={cabinet.directionsHref}
            phone={cabinet.phone}
            items={[
              {
                icon: <AccessibilityIcon />,
                label: 'Accès et accessibilité',
                value:
                  cabinet.access ??
                  'Une question sur l’accès, le stationnement ou une mobilité réduite ? Appelez le cabinet, on vous explique.',
              },
            ]}
          />
        </div>
        <Card className="gap-5 self-start px-6 py-6 md:px-8 md:py-7">
          <h3 className="m-0 font-display text-[22px]">Horaires</h3>
          <OpeningHours hours={cabinet.hours} className="text-[15px]" />
        </Card>
      </div>
    </section>
  )
}

function PractitionerPayment({ p }: { p: Practitioner }) {
  const rows: [string, React.ReactNode][] = [
    ['Conventionnement', p.convention],
    [
      'Paiement accepté',
      <ul key="pay" className="m-0 flex list-none flex-wrap gap-2 p-0">
        {p.paymentMethods.map((m) => (
          <li key={m}>
            <Badge variant="outline" className="font-sans text-[12.5px] tracking-normal">
              {m}
            </Badge>
          </li>
        ))}
      </ul>,
    ],
  ]
  return (
    <Card className="gap-5 px-6 py-6">
      <div>
        <h3 className="m-0 font-display text-[22px]">{p.name}</h3>
        <p className="m-0 mt-1 text-[13.5px] text-muted-foreground">{p.profession}</p>
      </div>
      <dl className="m-0 grid gap-4 sm:grid-cols-2 sm:gap-6">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1.5">
            <dt className="text-[12.5px] text-muted-foreground">{label}</dt>
            <dd className="m-0 text-[15px] text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      {!p.acceptsCard && (
        <p className="m-0 flex items-center gap-2 text-[14px] font-medium text-foreground">
          <InfoIcon aria-hidden className="size-4 shrink-0 text-primary-text" />
          Carte bancaire non acceptée
        </p>
      )}
    </Card>
  )
}

function Remboursement() {
  const bring = [
    'L’ordonnance de votre médecin',
    'Votre carte Vitale à jour',
    'Votre carte de mutuelle',
  ]
  return (
    <div
      data-theme="light"
      data-surface="bone"
      data-accent="atlas"
      className="bg-background text-foreground"
    >
      <section
        id="remboursement"
        aria-labelledby="remboursement-titre"
        className={`${anchorOffset} py-16 md:py-24`}
      >
        <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`}>
          <div className="flex flex-col gap-8">
            <SectionHeading id="remboursement-titre" index={1} title={sections[1].label}>
              <p className="m-0">
                Les deux kinésithérapeutes sont conventionnés. Les séances prescrites par un médecin
                sont facturées au tarif de la Sécurité sociale, sans dépassement d’honoraires, avec
                tiers payant : vous n’avancez pas la part de l’Assurance maladie.
              </p>
            </SectionHeading>
            <div>
              <p className="m-0 mb-3 text-[14px] font-medium text-foreground">
                Pour être remboursé, pensez à :
              </p>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {bring.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px]">
                    <CheckIcon aria-hidden className="size-4 shrink-0 text-primary-text" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-5 self-start">
            {practitioners.map((p) => (
              <PractitionerPayment key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function PremiereSeance() {
  // TODO(Matthieu): the cancellation rule (notice period) to add to the second answer.
  const items = [
    {
      question: 'Que faut-il apporter ?',
      answer:
        'L’ordonnance, votre carte Vitale et votre carte de mutuelle. Ajoutez vos examens d’imagerie et comptes rendus si vous en avez, et une tenue de sport : short ou legging, baskets.',
    },
    {
      question: 'Comment déplacer ou annuler un rendez-vous ?',
      answer: `Depuis votre espace Doctolib, ou en appelant le cabinet au ${cabinet.phone}. Prévenez le plus tôt possible : le créneau pourra être proposé à un autre patient.`,
    },
    {
      question: 'Comment se passe la première séance ?',
      answer:
        'Elle commence par un bilan : on parle de vous, de votre douleur ou de votre blessure, de votre activité, puis on passe aux tests. Les objectifs et le programme se construisent à partir de là.',
    },
    {
      question: 'Les prestations hors prescription sont-elles remboursées ?',
      answer:
        'Non, l’Assurance maladie ne les prend pas en charge. Certaines mutuelles participent : renseignez-vous auprès de la vôtre.',
    },
  ]
  return (
    <section
      id="premiere-seance"
      aria-labelledby="premiere-seance-titre"
      className={`${anchorOffset} py-16 md:py-24`}
    >
      <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`}>
        <SectionHeading id="premiere-seance-titre" index={2} title={sections[2].label}>
          <p className="m-0">Ce qu’il faut savoir avant de venir.</p>
        </SectionHeading>
        <Accordion type="single" collapsible defaultValue="q-0">
          {items.map((item, i) => (
            <AccordionItem key={item.question} value={`q-${i}`}>
              <AccordionTrigger className="text-[16px]">{item.question}</AccordionTrigger>
              <AccordionContent className="text-[15px] leading-[1.7]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function TarifGroups({ p }: { p: Practitioner }) {
  const groups = byCategory(tarifs[p.slug] ?? [])
  const titleId = `tarifs-${p.slug}`
  return (
    <div
      aria-labelledby={titleId}
      role="group"
      className="grid gap-8 border-t border-border-subtle pt-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12"
    >
      <div>
        <h3 id={titleId} className="m-0 font-display text-[22px]">
          {p.name}
        </h3>
        <p className="m-0 mt-1 text-[13.5px] text-muted-foreground">{p.profession}</p>
      </div>
      <div className={groups.length > 1 ? 'grid gap-x-12 gap-y-10 md:grid-cols-2' : 'grid'}>
        {groups.map((g) => (
          <div key={g.category}>
            <h4 className="m-0 mb-2 font-mono text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              {g.category}
            </h4>
            <dl className="m-0">
              {g.items.map((t) => (
                <div
                  key={t.label}
                  className="flex items-baseline justify-between gap-6 border-b border-border-subtle py-3 last:border-b-0"
                >
                  <dt className="text-[15px] leading-[1.5] text-fg-secondary">{t.label}</dt>
                  <dd className="m-0 text-[15px] whitespace-nowrap text-foreground tabular-nums">
                    {t.price}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}

function Tarifs() {
  return (
    <section
      id="tarifs"
      aria-labelledby="tarifs-titre"
      className={`${anchorOffset} border-t border-border-subtle py-16 md:py-24`}
    >
      <div className={`${container} flex flex-col gap-12`}>
        <SectionHeading id="tarifs-titre" index={3} title={sections[3].label}>
          <p className="m-0">
            Préparation physique, coaching et massages hors prescription ne sont pas pris en charge
            par l’Assurance maladie. Tarifs indicatifs, à confirmer avec le praticien.
          </p>
        </SectionHeading>
        <div className="flex flex-col gap-12">
          {practitioners.map((p) => (
            <TarifGroups key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

function InfosPratiques() {
  return (
    <>
      <PageIntro eyebrow="Infos pratiques" title="Horaires, accès et tarifs">
        <p className="m-0">
          Tout ce qu’il faut savoir pour venir au cabinet : où nous trouver, quand, ce qui est
          remboursé et ce qui ne l’est pas.
        </p>
      </PageIntro>
      <PageNav />
      <VenirAuCabinet />
      <Remboursement />
      <PremiereSeance />
      <Tarifs />
      <CtaSection
        className="pt-4"
        title={<span className="font-display">Prendre rendez-vous</span>}
        description="Chaque kinésithérapeute gère son agenda sur Doctolib."
        actions={<DoctolibButtons />}
      />
    </>
  )
}
