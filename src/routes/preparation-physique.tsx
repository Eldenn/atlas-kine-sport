import { createFileRoute } from '@tanstack/react-router'

import { PageIntro } from '@/components/atlas/page-intro'
import { anchorOffset, PageNav } from '@/components/atlas/page-nav'
import { TrainingForm } from '@/components/atlas/training-form'
import { trainingServices } from '@/content/care'
import { practice } from '@/content/practice'
import { AppLink } from '@/lib/link'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/preparation-physique')({
  head: () =>
    seo({
      path: '/preparation-physique',
      title: 'Préparation physique encadrée par un kinésithérapeute',
      name: 'Préparation physique',
      description:
        'Préparation physique à Chasseneuil-du-Poitou, encadrée par un kinésithérapeute : bilan de départ, séances au cabinet, suivi à distance, groupes et clubs. Non remboursée.',
    }),
  component: TrainingPage,
})

const sections = [
  { id: 'remboursement', label: 'Non remboursée' },
  { id: 'prestations', label: 'Les prestations' },
  { id: 'bilan', label: 'Le bilan de départ' },
  { id: 'demande', label: 'Faire une demande' },
] as const

const container = 'mx-auto box-content max-w-[1120px] px-5 md:px-7'

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="m-0 font-display text-[clamp(28px,3.6vw,40px)] leading-[1.12]">
      {children}
    </h2>
  )
}

function Reimbursement() {
  return (
    <section
      id="remboursement"
      aria-labelledby="remboursement-title"
      className={`${anchorOffset} py-16 md:py-24`}
    >
      <div className={`${container} grid gap-10 lg:grid-cols-2 lg:gap-16`}>
        <div>
          <SectionHeading id="remboursement-title">
            Pourquoi elle n’est pas remboursée
          </SectionHeading>
          <div className="mt-5 grid gap-4 text-[17px] leading-[1.7] text-fg-secondary">
            <p className="m-0">
              L’Assurance maladie rembourse les soins de kinésithérapie prescrits par un médecin
              pour traiter une pathologie. La préparation physique ne traite pas une blessure : elle
              prépare le corps à une pratique, une saison, une échéance.
            </p>
            <p className="m-0">
              Elle se fait donc sans ordonnance et reste à votre charge, même encadrée par un
              kinésithérapeute.
            </p>
          </div>
        </div>
        <div className="lg:pt-2">
          <h3 className="m-0 font-display text-[24px]">Encadrée par un kiné</h3>
          <ul className="m-0 mt-5 grid list-none gap-0 p-0 leading-relaxed text-fg-secondary">
            <li className="border-t border-border-subtle py-4">
              Le programme tient compte de vos blessures passées et de vos points faibles.
            </li>
            <li className="border-t border-border-subtle py-4">
              Il se déroule sur le plateau technique de la rééducation : charges, piste de sprint,
              capteurs de force, plateforme de saut.
            </li>
            <li className="border-y border-border-subtle py-4">
              Après une rééducation terminée, il peut prendre le relais pour continuer à progresser.
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section
      id="prestations"
      aria-labelledby="prestations-title"
      className={`${anchorOffset} atlas-divide py-16 md:py-24`}
    >
      <div
        className={`${container} grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-16`}
      >
        <div>
          <SectionHeading id="prestations-title">Les prestations</SectionHeading>
          <p className="mt-5 mb-0 leading-relaxed text-fg-secondary">
            Les formules et les tarifs varient selon le praticien.{' '}
            <AppLink href="/infos-pratiques#tarifs" className="underline hover:text-foreground">
              Voir les tarifs
            </AppLink>
            .
          </p>
        </div>
        <ul className="m-0 grid list-none content-start gap-x-10 gap-y-8 p-0 sm:grid-cols-2">
          {trainingServices.map((s) => (
            <li key={s.title} className="border-t border-border-subtle pt-5">
              <h3 className="m-0 font-display text-[22px]">{s.title}</h3>
              <p className="mt-2 mb-0 leading-relaxed text-fg-secondary">{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Assessment() {
  return (
    <section
      id="bilan"
      aria-labelledby="bilan-title"
      data-theme="light"
      data-surface="bone"
      data-accent="atlas"
      className={`${anchorOffset} bg-background py-16 text-foreground md:py-24`}
    >
      <div className={container}>
        <SectionHeading id="bilan-title">Avec ou sans bilan de départ</SectionHeading>
        <p className="mt-5 mb-0 max-w-[60ch] text-[17px] leading-[1.7] text-fg-secondary">
          Le bilan est recommandé, pas obligatoire. Vous pouvez aussi remplir le formulaire et
          commencer directement.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          <div className="border-t-2 border-primary pt-6">
            <p className="atlas-eyebrow m-0 text-primary-text">Recommandé</p>
            <h3 className="mt-2 mb-0 font-display text-[26px]">Avec un bilan</h3>
            <p className="mt-3 mb-0 leading-relaxed text-fg-secondary">
              Les tests de départ donnent des mesures de référence : force, mobilité, saut, vitesse.
              Le programme part de ces chiffres, et les mêmes tests, refaits en cours de route,
              montrent ce qui a progressé.
            </p>
          </div>
          <div className="border-t border-border pt-6">
            <p className="atlas-eyebrow m-0 text-fg-secondary">Possible</p>
            <h3 className="mt-2 mb-0 font-display text-[26px]">Sans bilan</h3>
            <p className="mt-3 mb-0 leading-relaxed text-fg-secondary">
              Le programme part de ce que vous nous dites dans le formulaire. Sans mesure de départ,
              nous n’aurons pas de données pour vérifier votre progression.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Request() {
  return (
    <section
      id="demande"
      aria-labelledby="demande-title"
      className={`${anchorOffset} py-16 md:py-24`}
    >
      <div className={`${container} grid gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]`}>
        <div>
          <SectionHeading id="demande-title">Faire une demande</SectionHeading>
          <p className="mt-3 mb-10 max-w-[52ch] leading-relaxed text-fg-secondary">
            Quelques informations pour préparer votre première séance. Le cabinet vous recontacte.
          </p>
          <TrainingForm titleId="demande-title" />
        </div>
        <aside aria-labelledby="ensuite-title" className="lg:pt-[92px]">
          <h3 id="ensuite-title" className="m-0 font-display text-[22px]">
            Ensuite
          </h3>
          <ol className="m-0 mt-5 grid list-none gap-0 p-0 text-[15px] leading-relaxed text-fg-secondary">
            <li className="grid grid-cols-[auto_1fr] gap-4 border-t border-border-subtle py-4">
              <span aria-hidden className="text-primary-text tabular-nums">
                1
              </span>
              Le cabinet lit votre demande et vous répond par e-mail, ou par téléphone si vous
              l’avez laissé.
            </li>
            <li className="grid grid-cols-[auto_1fr] gap-4 border-t border-border-subtle py-4">
              <span aria-hidden className="text-primary-text tabular-nums">
                2
              </span>
              Il vous propose un premier créneau : le bilan, ou directement une séance.
            </li>
            <li className="grid grid-cols-[auto_1fr] gap-4 border-y border-border-subtle py-4">
              <span aria-hidden className="text-primary-text tabular-nums">
                3
              </span>
              Le tarif est confirmé avant de commencer.
            </li>
          </ol>
          <p className="mt-6 mb-0 text-[15px] leading-relaxed text-fg-secondary">
            Une question avant ? Appelez le cabinet au{' '}
            <a href={`tel:${practice.phoneE164}`} className="underline hover:text-foreground">
              {practice.phone}
            </a>
            .
          </p>
        </aside>
      </div>
    </section>
  )
}

function TrainingPage() {
  return (
    <>
      <PageIntro eyebrow="Préparation physique" title="Se préparer avec un kinésithérapeute">
        <p className="m-0">
          Gagner en force, en puissance, en vitesse, ou reprendre après une pause : un programme
          construit à partir de votre sport et de vos objectifs, sur le plateau technique du
          cabinet.
        </p>
      </PageIntro>
      <PageNav sections={sections} />
      <Reimbursement />
      <Services />
      <Assessment />
      <Request />
    </>
  )
}
