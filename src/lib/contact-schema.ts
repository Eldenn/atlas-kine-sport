import { z } from 'zod'

import {
  antiSpamSchema,
  choiceField,
  emailField,
  type FormResult,
  nameField,
  phoneField,
} from '@/lib/form-common'

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
  name: nameField,
  email: emailField,
  phone: phoneField,
  topic: choiceField(contactTopics, 'Choisissez le sujet de votre message.'),
  message: z
    .string()
    .trim()
    .min(10, 'Votre message doit faire au moins 10 caractères.')
    .max(3000, 'Votre message ne doit pas dépasser 3 000 caractères.'),
})

export type ContactInput = z.infer<typeof contactSchema>

/** What the server receives: the fields plus the anti-spam signals. */
export const contactRequestSchema = contactSchema.extend(antiSpamSchema.shape)

export type ContactRequest = z.infer<typeof contactRequestSchema>

export type ContactResult = FormResult
