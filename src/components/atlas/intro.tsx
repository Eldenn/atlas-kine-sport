// The intro screen: on the first page of a visit, the Atlas lockup traces itself on the mineral
// ground, then the screen fades away onto the page. It is in the pre-rendered HTML and timed in
// CSS (.atlas-intro in atlas.css), so it never waits for JavaScript and never stays stuck if
// JavaScript fails. A script in <head> marks the visit (sessionStorage) so the next pages of the
// same visit open directly. A click, a tap or a key skips it; reduced motion skips it entirely.
// The page is underneath from the start: search engines and screen readers get it as usual.
import * as React from 'react'

import { AtlasLockup } from '@/components/atlas/atlas-logo'
import { Logo } from '@/components/ui/logo'

/** Runs in <head> before the first paint: a visit's later pages skip the intro. */
export const introScript = `try{var s=sessionStorage;if(s.getItem('atlas-intro'))document.documentElement.dataset.intro='seen';else s.setItem('atlas-intro','1')}catch(e){}`

export function Intro() {
  const [skipped, setSkipped] = React.useState(false)
  React.useEffect(() => {
    const skip = () => {
      setSkipped(true)
    }
    window.addEventListener('keydown', skip, { once: true })
    return () => {
      window.removeEventListener('keydown', skip)
    }
  }, [])
  return (
    <div
      aria-hidden
      data-skipped={skipped || undefined}
      onPointerDown={() => {
        setSkipped(true)
      }}
      className="atlas-intro bg-background text-foreground"
    >
      <Logo animation="draw" duration={1500} className="h-[clamp(150px,32vh,280px)]">
        <AtlasLockup />
      </Logo>
    </div>
  )
}
