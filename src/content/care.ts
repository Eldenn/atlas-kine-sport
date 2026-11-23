// What the practice offers, as the practitioners described it (Nov. 2026): the treatments used in
// physiotherapy, the strength and conditioning services and recovery. Tools are named generically:
// the code of ethics forbids naming equipment brands.

export interface Treatment {
  title: string
  /** The tool used, shown in parentheses after the title. */
  tool?: string
  text: string
}

/** Active treatment: the patient does the work. The core of rehabilitation. */
export const activeTreatments: Treatment[] = [
  {
    title: 'Exercices d’activation',
    tool: 'électromyographie, EMG',
    text: 'Réveiller un muscle qui ne répond plus bien après une blessure ou une opération. Le capteur montre à l’écran, en direct, si le muscle se contracte.',
  },
  {
    title: 'Renforcement',
    tool: 'charges libres, charges guidées',
    text: 'Reconstruire la force, avec des charges dosées puis augmentées par paliers.',
  },
  {
    title: 'Contrôle moteur',
    text: 'Retrouver un geste précis et stable : posture, alignement, coordination.',
  },
  {
    title: 'Explosivité',
    tool: 'biofeedback de vitesse',
    text: 'Travailler la vitesse d’exécution : la vitesse de chaque répétition est mesurée et affichée.',
  },
  {
    title: 'Pliométrie et puissance',
    tool: 'plateforme de saut',
    text: 'Préparer le retour aux sauts, aux appuis et aux changements de direction. La plateforme mesure la hauteur et le temps de contact au sol.',
  },
]

/** Passive treatment: done to the patient, mostly in the acute phase. */
export const passiveTreatments: Treatment[] = [
  {
    title: 'Thérapie manuelle',
    tool: 'avec les mains',
    text: 'Adaptée à la phase aiguë et, selon la situation, pour amener vers le travail actif.',
  },
  {
    title: 'Compression et glaçage',
    tool: 'appareil de compression froide',
    text: 'En phase aiguë, après un traumatisme, quand il y a une inflammation ou un gonflement.',
  },
]

/** Strength and conditioning services. Prices are in src/content/fees.ts (shown on /infos-pratiques). */
export const trainingServices = [
  {
    title: 'Bilan physique de départ',
    text: 'Force, mobilité, saut, vitesse : des tests qui mesurent votre point de départ et fixent les objectifs. Les mêmes tests, refaits en cours de route, montrent ce qui progresse.',
  },
  {
    title: 'Séances au cabinet',
    text: 'En individuel, sur le plateau technique, de 30 minutes à 1 heure. À la séance ou par carnet, avec une planification du mois.',
  },
  {
    title: 'Suivi au mois',
    text: 'Un abonnement mensuel, adapté à votre calendrier sportif. Sur devis.',
  },
  {
    title: 'À distance ou hybride',
    text: 'Un programme à suivre de votre côté, avec ou sans suivi en ligne, ou un mois qui alterne travail en autonomie et séances encadrées.',
  },
  {
    title: 'Groupes et clubs',
    text: 'Des séances de 2 à 6 personnes, ou la préparation physique d’une équipe. Sur devis pour les clubs.',
  },
]

/** Recovery, outside reimbursed care. */
export const recoveryServices = [
  {
    title: 'Massage de récupération',
    text: 'Une séance courte après un effort, une compétition ou un bloc d’entraînement chargé.',
  },
  {
    title: 'Compression et froid',
    text: 'L’appareil de compression froide, en séance de récupération après l’effort.',
  },
]
