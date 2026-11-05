import { createFileRoute } from '@tanstack/react-router'

import { ContactForm } from '@/components/atlas/contact-form'
import { DoctolibButtons } from '@/components/atlas/doctolib-buttons'
import { PageIntro } from '@/components/atlas/page-intro'
import { ContactDetails, OpeningHours } from '@/components/contact-section'
import { practice } from '@/content/practice'
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
          une autre question, écrivez-nous ou appelez le cabinet.
        </p>
        <div className="mt-8">
          <DoctolibButtons />
        </div>
      </PageIntro>
      <section className="atlas-divide px-5 py-20 md:px-7">
        <div className="mx-auto grid max-w-[1120px] gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div>
            <h2
              id="contact-form-title"
              className="m-0 font-display text-[clamp(28px,3.5vw,36px)] leading-[1.15]"
            >
              Écrire au cabinet
            </h2>
            <p className="mt-3 mb-10 max-w-[52ch] leading-relaxed text-fg-secondary">
              Une question avant de venir, un club qui cherche un suivi : laissez un message, le
              cabinet vous répond par e-mail.
            </p>
            <ContactForm />
          </div>
          <aside aria-label="Coordonnées et horaires" className="flex flex-col gap-10">
            <ContactDetails
              address={
                <>
                  {practice.address.street}
                  <br />
                  {practice.address.postalCode} {practice.address.city}
                </>
              }
              directionsHref={practice.directionsHref}
              phone={practice.phone}
            />
            <OpeningHours hours={practice.hours} />
          </aside>
        </div>
      </section>
    </>
  )
}
