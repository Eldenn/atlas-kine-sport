// Sends the contact form to the practice's mailbox (see ./mail.ts).
import { createServerFn } from '@tanstack/react-start'

import {
  contactRequestSchema,
  contactTopics,
  type ContactRequest,
  type ContactResult,
} from '@/lib/contact-schema'
import { oneLine, screen, sendToPractice, subjectLine } from '@/server/mail'

function composeEmail(data: ContactRequest) {
  const topic = contactTopics[data.topic]
  const subject = subjectLine('Site', topic, data.name)
  const text = [
    'Nouveau message envoyé depuis le formulaire du site.',
    '',
    `Nom : ${oneLine(data.name)}`,
    `E-mail : ${data.email}`,
    `Téléphone : ${data.phone || 'non renseigné'}`,
    `Sujet : ${topic}`,
    '',
    'Message :',
    data.message,
    '',
    '—',
    `Pour répondre, écrivez à ${data.email}.`,
    '(Ce message part de la boîte du cabinet : « Répondre » renverrait vers le cabinet.)',
  ].join('\n')
  return { subject, text }
}

export const sendContactMessage = createServerFn({ method: 'POST' })
  .validator(contactRequestSchema)
  .handler(async ({ data }): Promise<ContactResult> => {
    const early = screen(data)
    if (early) return early
    return sendToPractice('contact', composeEmail(data))
  })
