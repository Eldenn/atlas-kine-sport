// The logo in the header and the footer: the Atlas symbol (inline SVG, in the text colour) beside
// "ATLAS" in Marcellus over "KINÉ SPORT" in spaced Montserrat, as on the moodboard. On hover or
// keyboard focus a light sweeps across it once (Coreloom's Logo, "shine").
import { AtlasMark } from '@/components/atlas/atlas-logo'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

export function Brand({ className }: { className?: string }) {
  return (
    <Logo
      href="/"
      label="Atlas Kiné Sport, accueil"
      animation="shine"
      trigger="hover"
      className={cn('leading-none whitespace-nowrap text-foreground', className)}
    >
      {/* Logo sizes its SVG to the height of its box: this box gives the symbol its size. */}
      <span className="flex h-9">
        <AtlasMark />
      </span>
      <span className="ml-2.5 flex flex-col items-center">
        <span className="font-display text-[24px] tracking-[0.08em]">ATLAS</span>
        <span className="atlas-eyebrow mt-1 text-[8.5px] tracking-[0.42em] text-primary-text">
          Kiné sport
        </span>
      </span>
    </Logo>
  )
}
