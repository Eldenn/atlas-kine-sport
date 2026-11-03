// Services outside reimbursed care, as listed on the practitioners' Doctolib pages (Nov. 2026).
// Shown as plain information: the code of ethics forbids promoting them (R.4321-67).

export interface Tarif {
  label: string
  price: string
}

export const tarifsDelman: Tarif[] = [
  { label: 'Abonnement mensuel, suivi de préparation physique (sur devis)', price: '80 à 130 €' },
]

export const tarifsMoeine: Tarif[] = [
  { label: 'Bilan coaching (1 h)', price: '90 €' },
  { label: 'Bilan préparation physique objectif performance (1 h 30)', price: '140 €' },
  { label: 'Coaching en présentiel, 1 séance (30, 45 ou 60 min)', price: '40 à 75 €' },
  { label: '5 séances de coaching en présentiel', price: '190 à 355 €' },
  { label: '10 séances de coaching en présentiel', price: '360 à 675 €' },
  { label: 'Planification mensuelle (obligatoire en suivi présentiel)', price: '30 €' },
  { label: 'Suivi en ligne (1 mois)', price: '130 €' },
  { label: 'Programme sans suivi en ligne', price: '80 €' },
  { label: 'Accompagnement hybride, 1 mois avec 1 séance encadrée', price: '165 à 200 €' },
  { label: 'Accompagnement hybride, 1 mois avec 5 séances encadrées', price: '310 à 460 €' },
  { label: 'Séance de groupe, 2 à 6 personnes (1 h, prix à diviser)', price: '90 à 150 €' },
  { label: '5 séances de groupe', price: '430 à 720 €' },
  { label: '10 séances de groupe', price: '810 à 1 200 €' },
  { label: 'Préparation physique pour un club (sur devis)', price: '100 à 1 500 €' },
  { label: 'Massage de récupération (20 min)', price: '30 €' },
  { label: 'Massage bien-être (30 min)', price: '45 €' },
  { label: 'Massage bien-être (1 h)', price: '80 €' },
  { label: 'Récupération par compression et glace', price: '15 €' },
]
