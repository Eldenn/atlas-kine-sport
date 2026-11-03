import { createFileRoute } from '@tanstack/react-router'

import { DoctolibButtons } from '@/components/atlas/doctolib-buttons'
import { PageIntro } from '@/components/atlas/page-intro'
import { ContactDetails, ContactSection, OpeningHours } from '@/components/contact-section'
import { cabinet } from '@/content/cabinet'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  head: () =>
    seo({
      path: '/contact',
      title: 'Prendre rendez-vous',
      description:
        'Prenez rendez-vous avec Delman Ahmed Mustafa ou Moeine Khalifeh sur Doctolib, ou contactez le cabinet Atlas Kiné Sport.',
    }),
  component: Contact,
})

function Contact() {
  return (
    <>
      <PageIntro eyebrow="Contact" title="Prenez rendez-vous">
        <p>
          Les rendez-vous se prennent directement sur l’agenda Doctolib de chaque praticien. Pour
          une autre question, appelez le cabinet.
        </p>
        <div className="mt-8">
          <DoctolibButtons />
        </div>
      </PageIntro>
      {/* The contact form (Hostinger Mail API, server function) arrives with the pages step. */}
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
        />
        <OpeningHours hours={cabinet.hours} />
      </ContactSection>
    </>
  )
}
