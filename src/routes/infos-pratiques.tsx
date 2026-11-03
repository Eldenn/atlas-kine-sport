import { createFileRoute } from '@tanstack/react-router'

import { PageIntro } from '@/components/atlas/page-intro'
import { ContactDetails, ContactSection, OpeningHours } from '@/components/contact-section'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cabinet, practitioners } from '@/content/cabinet'
import { type Tarif, tarifsDelman, tarifsMoeine } from '@/content/tarifs'
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

function TarifTable({ title, tarifs }: { title: string; tarifs: Tarif[] }) {
  const id = `tarifs-${title.toLowerCase().replace(/[^a-z]+/g, '-')}`
  return (
    <div>
      <h3 id={id} className="mt-0 mb-4 font-display text-[22px]">
        {title}
      </h3>
      <Table aria-labelledby={id}>
        <TableHeader>
          <TableRow>
            <TableHead>Prestation</TableHead>
            <TableHead className="text-end">Tarif</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tarifs.map((t) => (
            <TableRow key={t.label}>
              <TableCell className="whitespace-normal">{t.label}</TableCell>
              <TableCell className="text-end whitespace-nowrap">{t.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function InfosPratiques() {
  return (
    <>
      <PageIntro eyebrow="Infos pratiques" title="Horaires, accès et tarifs" />
      <ContactSection className="border-t border-border-subtle">
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
            // TODO(Matthieu): accessibility of the practice (step-free access, parking, bus line).
            { label: 'Accès', value: 'Informations d’accès et d’accessibilité à compléter.' },
          ]}
        />
        <OpeningHours hours={cabinet.hours} />
      </ContactSection>

      <section
        aria-labelledby="remboursement"
        className="mx-auto max-w-[1120px] border-t border-border-subtle px-5 py-16 md:px-7"
      >
        <h2 id="remboursement" className="m-0 font-display text-[32px]">
          Soins remboursés
        </h2>
        <p className="mt-4 max-w-[65ch] leading-relaxed text-fg-secondary">
          Les deux kinésithérapeutes sont conventionnés : les séances prescrites par un médecin sont
          facturées au tarif de la Sécurité sociale, sans dépassement d’honoraires, avec tiers
          payant. Pensez à votre carte Vitale à jour et à votre carte de mutuelle.
        </p>
        <dl className="mt-8 grid gap-6 md:grid-cols-2">
          {practitioners.map((p) => (
            <div key={p.slug} className="rounded-lg border border-border p-5">
              <dt className="font-display text-[20px]">{p.name}</dt>
              <dd className="mt-2 ml-0 text-[15px] text-fg-secondary">
                {p.convention}. Paiement : {p.payment.toLowerCase()}.
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="non-rembourse"
        className="mx-auto max-w-[1120px] border-t border-border-subtle px-5 py-16 md:px-7"
      >
        <h2 id="non-rembourse" className="m-0 font-display text-[32px]">
          Prestations non remboursées
        </h2>
        <p className="mt-4 max-w-[65ch] leading-relaxed text-fg-secondary">
          Préparation physique, coaching et massages hors prescription ne sont pas pris en charge
          par l’Assurance maladie. Tarifs indicatifs, à confirmer avec le praticien.
        </p>
        <div className="mt-10 grid gap-12">
          <TarifTable title="Delman Ahmed Mustafa" tarifs={tarifsDelman} />
          <TarifTable title="Moeine Khalifeh" tarifs={tarifsMoeine} />
        </div>
      </section>
    </>
  )
}
