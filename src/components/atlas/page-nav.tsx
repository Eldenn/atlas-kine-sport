// "Sur cette page": the anchors of a long page, in a band that sticks under the site header from
// md up. Sections it points to need `scroll-mt-20 md:scroll-mt-32` to clear both bars.
export function PageNav({ sections }: { sections: readonly { id: string; label: string }[] }) {
  return (
    <nav
      aria-label="Sur cette page"
      className="border-y border-border-subtle bg-background/85 backdrop-blur-md md:sticky md:top-16 md:z-10"
    >
      <ul className="m-0 mx-auto box-content flex max-w-[1120px] list-none flex-wrap gap-x-6 gap-y-2 px-5 py-3.5 md:px-7">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="inline-flex items-baseline gap-2 rounded-xs text-[14px] text-fg-secondary underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** The scroll margin for a section a PageNav points to. */
export const anchorOffset = 'scroll-mt-20 md:scroll-mt-32'
