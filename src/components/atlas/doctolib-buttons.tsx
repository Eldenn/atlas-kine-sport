// One Doctolib button per practitioner: appointments are booked on their own agenda.
import { ArrowUpRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { practitioners } from '@/content/practice'

export function DoctolibButtons({ variant = 'default' }: { variant?: 'default' | 'outline' }) {
  return (
    <div className="flex flex-wrap gap-3">
      {practitioners.map((p) => (
        <Button key={p.slug} asChild variant={variant}>
          <a href={p.doctolib} target="_blank" rel="noopener noreferrer">
            {p.name.split(' ')[0]} sur Doctolib
            <ArrowUpRightIcon aria-hidden />
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
        </Button>
      ))}
    </div>
  )
}
