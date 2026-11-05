// Services outside reimbursed care, as listed on the practitioners' Doctolib pages (Nov. 2026).
// Shown as plain information: the code of ethics forbids promoting them (R.4321-67).
// The page groups lines by `category`, in the order categories first appear.

export interface Fee {
  category: string
  label: string
  price: string
}

export const delmanFees: Fee[] = [
  {
    category: 'Préparation physique',
    label: 'Abonnement mensuel, suivi de préparation physique (sur devis)',
    price: '80 à 130 €',
  },
]

export const moeineFees: Fee[] = [
  { category: 'Bilans', label: 'Bilan coaching (1 h)', price: '90 €' },
  {
    category: 'Bilans',
    label: 'Bilan préparation physique objectif performance (1 h 30)',
    price: '140 €',
  },
  {
    category: 'Coaching en présentiel',
    label: '1 séance (30, 45 ou 60 min)',
    price: '40 à 75 €',
  },
  { category: 'Coaching en présentiel', label: '5 séances', price: '190 à 355 €' },
  { category: 'Coaching en présentiel', label: '10 séances', price: '360 à 675 €' },
  {
    category: 'Coaching en présentiel',
    label: 'Planification mensuelle (obligatoire en suivi présentiel)',
    price: '30 €',
  },
  { category: 'Suivi à distance et hybride', label: 'Suivi en ligne (1 mois)', price: '130 €' },
  {
    category: 'Suivi à distance et hybride',
    label: 'Programme sans suivi en ligne',
    price: '80 €',
  },
  {
    category: 'Suivi à distance et hybride',
    label: 'Hybride, 1 mois avec 1 séance encadrée',
    price: '165 à 200 €',
  },
  {
    category: 'Suivi à distance et hybride',
    label: 'Hybride, 1 mois avec 5 séances encadrées',
    price: '310 à 460 €',
  },
  {
    category: 'Groupes et clubs',
    label: 'Séance de groupe, 2 à 6 personnes (1 h, prix à diviser)',
    price: '90 à 150 €',
  },
  { category: 'Groupes et clubs', label: '5 séances de groupe', price: '430 à 720 €' },
  { category: 'Groupes et clubs', label: '10 séances de groupe', price: '810 à 1 200 €' },
  {
    category: 'Groupes et clubs',
    label: 'Préparation physique pour un club (sur devis)',
    price: '100 à 1 500 €',
  },
  { category: 'Récupération', label: 'Massage de récupération (20 min)', price: '30 €' },
  { category: 'Récupération', label: 'Massage bien-être (30 min)', price: '45 €' },
  { category: 'Récupération', label: 'Massage bien-être (1 h)', price: '80 €' },
  { category: 'Récupération', label: 'Récupération par compression et glace', price: '15 €' },
]

/** The lines grouped by category, in the order categories first appear. */
export function byCategory(fees: Fee[]) {
  const groups = new Map<string, Fee[]>()
  for (const t of fees) groups.set(t.category, [...(groups.get(t.category) ?? []), t])
  return [...groups].map(([category, items]) => ({ category, items }))
}
