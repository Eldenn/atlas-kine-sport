// The practice's photos, one entry per slot on the site. A slot without a file (null) is not drawn:
// the section around it lays itself out without a picture until the photo is delivered. To add
// one: put the file in public/images/photos/, set `src` (and `width`, `height`, `alt`) here.
// The shot list for each slot is in docs/photo-shoot.md.

export interface Photo {
  src: string
  width: number
  height: number
  /** What the photo shows, for screen readers. */
  alt: string
}

export const photos = {
  /** Home page, training-floor section: the sprint track and the load area, landscape 4:3. */
  trainingFloor: null as Photo | null,
  /** Practice page: the whole training floor seen from the entrance, wide 21:9. */
  trainingFloorWide: null as Photo | null,
  /** Practice page, "Pourquoi Atlas" section: the lit emblem on the walnut slats, portrait 4:5. */
  emblem: null as Photo | null,
}
