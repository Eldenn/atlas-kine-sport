// The 404, inside the site's header and footer. React 19 hoists the <title> into <head>: a page
// that doesn't exist has no route to give it one.
import { PageIntro } from '@/components/atlas/page-intro'
import { Button } from '@/components/ui/button'
import { AppLink } from '@/lib/link'

export function NotFound() {
  return (
    <>
      <title>Page introuvable · Atlas Kiné Sport</title>
      <meta name="robots" content="noindex" />
      <PageIntro eyebrow="Erreur 404" title="Cette page n’existe pas">
        <p>
          Elle a peut-être changé d’adresse avec le nouveau site. Les pages principales sont toutes
          dans le menu.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <AppLink href="/">Retour à l’accueil</AppLink>
          </Button>
          <Button asChild variant="outline">
            <AppLink href="/contact">Prendre rendez-vous</AppLink>
          </Button>
        </div>
      </PageIntro>
    </>
  )
}
