import { z } from 'zod'

import { antiSpamSchema, choiceField, emailField, nameField, phoneField } from '@/lib/form-common'

// The strength and conditioning request form ("Préparation physique" page). It asks only what the
// practice needs to answer and plan a first session: no age, no medical history. Health details
// are discussed at the assessment, under professional secrecy.

export const trainingStarts = {
  assessment: 'Commencer par un bilan physique (recommandé)',
  direct: 'Commencer directement, sans bilan',
} as const

export const trainingFormats = {
  individual: 'Séances au cabinet, en individuel',
  remote: 'Programme à distance ou suivi hybride',
  group: 'En groupe, ou pour un club',
  undecided: 'Je ne sais pas encore',
} as const

export const trainingSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  start: choiceField(trainingStarts, 'Choisissez comment vous souhaitez commencer.'),
  format: choiceField(trainingFormats, 'Choisissez une formule, ou « Je ne sais pas encore ».'),
  sport: z.string().trim().max(120, 'Ce champ ne doit pas dépasser 120 caractères.'),
  goal: z
    .string()
    .trim()
    .min(10, 'Décrivez votre objectif en quelques mots (10 caractères au moins).')
    .max(2000, 'Votre objectif ne doit pas dépasser 2 000 caractères.'),
})

export type TrainingInput = z.infer<typeof trainingSchema>

/** What the server receives: the fields plus the anti-spam signals. */
export const trainingRequestSchema = trainingSchema.extend(antiSpamSchema.shape)

export type TrainingRequest = z.infer<typeof trainingRequestSchema>
