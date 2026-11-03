// Stands in for the practice's real photos until they are delivered (the moodboard rules out stock
// photos). A quiet frame in the page's colours with what the photo will show.
import { cn } from '@/lib/utils'

export function PhotoPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`Photo à venir : ${label}`}
      className={cn(
        'flex size-full min-h-[240px] items-end bg-[repeating-linear-gradient(135deg,var(--surface-1)_0_14px,var(--surface-2)_14px_28px)] p-5',
        className,
      )}
    >
      <span className="atlas-eyebrow text-fg-muted text-[10px]">Photo à venir · {label}</span>
    </div>
  )
}
