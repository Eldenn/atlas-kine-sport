import { createFileRoute } from '@tanstack/react-router'

import { PageIntro } from '@/components/atlas/page-intro'
import { PhotoPlaceholder } from '@/components/atlas/photo-placeholder'
import { CtaSection } from '@/components/cta-section'
import { MediaSection } from '@/components/media-section'
import { Button } from '@/components/ui/button'
import { AppLink } from '@/lib/link'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/cabinet')({
  head: () =>
    seo({
      path: '/cabinet',
      title: 'Le cabinet',
      description:
        'Une rééducation active : vous travaillez avec le kiné, sur un plateau technique conçu comme une salle d’entraînement.',
    }),
  component: Cabinet,
})

function Cabinet() {
  return (
    <>
      <PageIntro eyebrow="Le cabinet" title="Transformer l’obstacle en progression">
        <p>
          Une blessure interrompt une saison, un projet, parfois un quotidien. Chez Atlas, la
          rééducation est active : vous travaillez avec le kiné, pas seulement sous ses mains.
          Chaque programme part de votre bilan, avance par étapes mesurées, et vise un retour
          durable à votre activité.
        </p>
      </PageIntro>
      <MediaSection
        eyebrow={<span className="atlas-eyebrow">Plateau technique</span>}
        title="Conçu comme une salle d’entraînement"
        media={<PhotoPlaceholder label="vue d’ensemble du plateau" />}
        className="border-t border-border-subtle"
      >
        <p>
          Parquet, piste de sprint, zone de charges et espace de soins au calme. Les capteurs de
          force et l’analyse vidéo servent à une chose : décider sur des mesures, pas sur des
          impressions.
        </p>
      </MediaSection>
      <MediaSection
        eyebrow={<span className="atlas-eyebrow">Pourquoi Atlas</span>}
        title="Le titan et la première vertèbre"
        mediaPosition="start"
        media={<PhotoPlaceholder label="l’emblème du cabinet" />}
      >
        <p>
          En mythologie, Atlas porte le monde : force, endurance, stabilité. En anatomie, l’atlas
          (C1) soutient la tête et lui donne sa mobilité. Le nom dit ce que nous faisons : soutenir
          la reconstruction du corps, jusqu’à ce qu’il retrouve force et mouvement.
        </p>
      </MediaSection>
      <CtaSection
        title={<span className="font-display">Commencer par un bilan</span>}
        description="Le premier rendez-vous fait le point sur votre blessure, vos objectifs et votre sport."
        actions={
          <Button asChild size="lg">
            <AppLink href="/contact">Prendre rendez-vous</AppLink>
          </Button>
        }
      />
    </>
  )
}
