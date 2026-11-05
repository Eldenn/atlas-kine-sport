import { z } from 'zod'

/** What a visitor can write about. Booking is not here: it goes through Doctolib. */
export const contactTopics = {
  care: 'Une question sur les soins',
  athletes: 'Un club, une équipe, un suivi de sportifs',
  practical: 'Infos pratiques (accès, horaires, paiement)',
  other: 'Autre chose',
} as const

export type ContactTopic = keyof typeof contactTopics

/** The form's fields, checked in the browser for feedback and again on the server, which decides. */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Indiquez votre nom.')
    .max(100, 'Votre nom ne doit pas dépasser 100 caractères.'),
  email: z
    .string()
    .trim()
    .min(1, 'Indiquez votre adresse e-mail, pour que l’on puisse vous répondre.')
    .max(254, 'Cette adresse e-mail est trop longue.')
    .pipe(z.email('Cette adresse e-mail n’est pas valide, par exemple : nom@exemple.fr.')),
  phone: z
    .string()
    .trim()
    .max(30, 'Ce numéro est trop long.')
    .refine(
      (v) => v === '' || /^\+?[\d\s.()-]{8,}$/.test(v),
      'Ce numéro n’est pas valide, par exemple : 06 12 34 56 78.',
    ),
  topic: z
    .string()
    .refine((v) => Object.hasOwn(contactTopics, v), 'Choisissez le sujet de votre message.')
    .transform((v) => v as ContactTopic),
  message: z
    .string()
    .trim()
    .min(10, 'Votre message doit faire au moins 10 caractères.')
    .max(3000, 'Votre message ne doit pas dépasser 3 000 caractères.'),
})

export type ContactInput = z.infer<typeof contactSchema>

/** What the server receives: the fields plus two anti-spam signals that people never see. */
export const contactRequestSchema = contactSchema.extend({
  /** A field hidden from people; bots that fill every input fill it. */
  website: z.string().max(500),
  /** How long the form was open before sending, in ms; bots send at once. */
  elapsedMs: z.number().int().nonnegative(),
})

export type ContactRequest = z.infer<typeof contactRequestSchema>

export type ContactResult =
  { ok: true } | { ok: false; reason: 'invalid' | 'rate-limited' | 'unavailable' | 'failed' }
