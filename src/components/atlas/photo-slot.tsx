// A slot for one of the practice's photos (src/content/photos.ts). Renders the photo when it exists
// and nothing otherwise: no striped "photo to come" frame on the public site. Callers check
// `photo` too, to lay the section out without the frame.
import type { Photo } from '@/content/photos'
import { cn } from '@/lib/utils'

export function PhotoSlot({
  photo,
  className,
  sizes,
}: {
  photo: Photo | null
  className?: string
  sizes?: string
}) {
  if (!photo) return null
  return (
    <img
      src={photo.src}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      sizes={sizes}
      loading="lazy"
      decoding="async"
      className={cn('size-full object-cover', className)}
    />
  )
}
