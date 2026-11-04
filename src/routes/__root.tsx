/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts, useLocation } from '@tanstack/react-router'
import type * as React from 'react'

import { Brand } from '@/components/atlas/brand'
import { Intro, introScript } from '@/components/atlas/intro'
import { RouterLink } from '@/components/atlas/router-link'
import { NotFound } from '@/components/atlas/not-found'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cabinet, legalLinks, nav, practitioners, SITE_URL } from '@/content/cabinet'
import { CoreloomI18nProvider } from '@/lib/i18n'
import { AppLink, CoreloomLinkProvider } from '@/lib/link'
import montserratWoff2 from '@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2?url'
import marcellusWoff2 from '@fontsource/marcellus/files/marcellus-latin-400-normal.woff2?url'
import appCss from '@/styles/globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#121a26' },
      { property: 'og:site_name', content: cabinet.name },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // The two fonts of the first screen, latin subset: fetched with the CSS, not after it.
      {
        rel: 'preload',
        href: marcellusWoff2,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: montserratWoff2,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      { rel: 'icon', href: '/favicon-64.png', type: 'image/png' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
    scripts: [
      { children: introScript },
      { type: 'application/ld+json', children: JSON.stringify(structuredData) },
    ],
  }),
  shellComponent: RootDocument,
  component: Layout,
  notFoundComponent: NotFound,
})

// schema.org description of the practice, read by search engines for the local results.
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Physiotherapy',
  name: cabinet.name,
  description: cabinet.description,
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  logo: `${SITE_URL}/images/emblem-bone.png`,
  hasMap: cabinet.directionsHref,
  medicalSpecialty: 'PhysicalTherapy',
  telephone: '+33772508017',
  address: {
    '@type': 'PostalAddress',
    streetAddress: cabinet.address.street,
    postalCode: cabinet.address.postalCode,
    addressLocality: cabinet.address.city,
    addressCountry: 'FR',
  },
  openingHoursSpecification: [
    {
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:30',
      closes: '13:00',
    },
    {
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '14:00',
      closes: '19:00',
    },
  ],
  employee: practitioners.map((p) => ({ '@type': 'Person', name: p.name, jobTitle: p.profession })),
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // The moodboard's dark mineral page with the gold accent; light bands set their own theme.
    // The intro script adds data-intro to <html> before React hydrates it.
    <html
      lang="fr"
      suppressHydrationWarning
      data-theme="dark"
      data-surface="mineral"
      data-accent="atlas"
    >
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function Layout() {
  const { pathname } = useLocation()
  return (
    <CoreloomI18nProvider locale="fr">
      <CoreloomLinkProvider component={RouterLink}>
        <TooltipProvider>
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
          >
            Aller au contenu
          </a>
          <SiteHeader
            brand={<Brand compact />}
            links={nav.map((link) => ({ ...link, active: pathname.startsWith(link.href) }))}
            actions={
              <Button asChild size="sm" className="hidden lg:inline-flex">
                <AppLink href="/contact">Prendre rendez-vous</AppLink>
              </Button>
            }
            mobileActions={
              <Button asChild className="w-full">
                <AppLink href="/contact">Prendre rendez-vous</AppLink>
              </Button>
            }
          />
          <main id="contenu">
            <Outlet />
          </main>
          <Footer />
          <Toaster />
          <Intro />
        </TooltipProvider>
      </CoreloomLinkProvider>
    </CoreloomI18nProvider>
  )
}

function Footer() {
  const { address } = cabinet
  return (
    <SiteFooter
      brand={
        <div className="space-y-4">
          <Brand />
          <p className="m-0 max-w-[34ch] text-[14px] leading-relaxed text-fg-secondary">
            Kinésithérapie du sport à Chasseneuil-du-Poitou. Bilan, soins et reconditionnement.
          </p>
        </div>
      }
      columns={[
        { title: 'Le site', links: [...nav] },
        {
          title: 'Le cabinet',
          content: (
            <address className="text-[14px] leading-relaxed text-fg-secondary not-italic">
              {address.street}
              <br />
              {address.postalCode} {address.city}
              <br />
              <a href="tel:+33772508017" className="hover:text-foreground">
                {cabinet.phone}
              </a>
            </address>
          ),
        },
        {
          title: 'Horaires',
          content: (
            <p className="m-0 text-[14px] leading-relaxed text-fg-secondary">
              Du lundi au vendredi
              <br />8 h 30 – 13 h · 14 h – 19 h
            </p>
          ),
        },
      ]}
      note={`© ${new Date().getFullYear()} ${cabinet.name} · Bouger, récupérer, performer`}
      links={[...legalLinks]}
    />
  )
}
