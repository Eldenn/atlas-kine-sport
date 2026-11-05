// The practice's photos, one entry per slot on the site. A slot without a file (null) is not drawn:
// the section around it lays itself out without a picture until the photo is delivered. To add
// one: put the file in public/images/photos/, set `src` (and `width`, `height`, `alt`) here.
// The shot list for each slot is in docs/prises-de-vue.md.

export interface Photo {
  src: string
  width: number
  height: number
  /** What the photo shows, for screen readers. */
  alt: string
}

export const photos = {
  /** Home page, plateau section: the sprint track and the load area, landscape 4:3. */
  plateau: null as Photo | null,
  /** Le cabinet: the whole plateau seen from the entrance, wide 21:9. */
  plateauVue: null as Photo | null,
  /** Le cabinet, "Pourquoi Atlas": the lit emblem on the walnut slats, portrait 4:5. */
  embleme: null as Photo | null,
}
