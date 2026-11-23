import { z } from 'zod'

// What the site's forms share, in the browser and on the server.

export const nameField = z
  .string()
  .trim()
  .min(2, 'Indiquez votre nom.')
  .max(100, 'Votre nom ne doit pas dépasser 100 caractères.')

export const emailField = z
  .string()
  .trim()
  .min(1, 'Indiquez votre adresse e-mail, pour que l’on puisse vous répondre.')
  .max(254, 'Cette adresse e-mail est trop longue.')
  .pipe(z.email('Cette adresse e-mail n’est pas valide, par exemple : nom@exemple.fr.'))

export const phoneField = z
  .string()
  .trim()
  .max(30, 'Ce numéro est trop long.')
  .refine(
    (v) => v === '' || /^\+?[\d\s.()-]{8,}$/.test(v),
    'Ce numéro n’est pas valide, par exemple : 06 12 34 56 78.',
  )

/** A choice among the keys of `options`, with the message shown when none is picked. */
export function choiceField<T extends Record<string, string>>(options: T, message: string) {
  return z
    .string()
    .refine((v) => Object.hasOwn(options, v), message)
    .transform((v) => v as keyof T & string)
}

/** Two signals people never see, sent with every form. */
export const antiSpamSchema = z.object({
  /** A field hidden from people; bots that fill every input fill it. */
  website: z.string().max(500),
  /** How long the form was open before sending, in ms; bots send at once. */
  elapsedMs: z.number().int().nonnegative(),
})

export type AntiSpam = z.infer<typeof antiSpamSchema>

export type FormResult =
  { ok: true } | { ok: false; reason: 'invalid' | 'rate-limited' | 'unavailable' | 'failed' }

export type FailReason = Exclude<FormResult, { ok: true }>['reason']
