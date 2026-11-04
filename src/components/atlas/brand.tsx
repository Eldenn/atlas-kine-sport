// The logo in the header and the footer, as inline SVG in the text colour: in the footer the full
// lockup (the symbol, ATLAS, KINÉ SPORT), as on the moodboard and the intro screen; `compact` keeps
// the symbol alone, for the header. On hover or keyboard focus a light sweeps across it once
// (Coreloom's Logo, "shine").
import { AtlasLockup, AtlasMark } from '@/components/atlas/atlas-logo'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

export function Brand({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Logo
      href="/"
      label="Atlas Kiné Sport, accueil"
      animation="shine"
      trigger="hover"
      className={cn('text-foreground', className)}
    >
      {/* Logo sizes its SVG to the height of its box: this box gives the logo its size. */}
      <span className={cn('flex', compact ? 'h-10' : 'h-28')}>
        {compact ? <AtlasMark /> : <AtlasLockup />}
      </span>
    </Logo>
  )
}
