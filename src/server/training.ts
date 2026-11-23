// Sends a strength and conditioning request to the practice's mailbox (see ./mail.ts).
import { createServerFn } from '@tanstack/react-start'

import type { FormResult } from '@/lib/form-common'
import {
  trainingFormats,
  trainingRequestSchema,
  trainingStarts,
  type TrainingRequest,
} from '@/lib/training-schema'
import { oneLine, screen, sendToPractice, subjectLine } from '@/server/mail'

function composeEmail(data: TrainingRequest) {
  const withAssessment = data.start === 'assessment'
  const subject = subjectLine(
    'Préparation physique',
    withAssessment ? 'avec bilan' : 'sans bilan',
    data.name,
  )
  const text = [
    'Nouvelle demande de préparation physique envoyée depuis le site.',
    '',
    `Nom : ${oneLine(data.name)}`,
    `E-mail : ${data.email}`,
    `Téléphone : ${data.phone || 'non renseigné'}`,
    '',
    `Démarrage : ${trainingStarts[data.start]}`,
    `Formule : ${trainingFormats[data.format]}`,
    `Sport et niveau : ${data.sport ? oneLine(data.sport) : 'non renseigné'}`,
    '',
    'Objectif :',
    data.goal,
    '',
    '—',
    ...(withAssessment
      ? []
      : ['Sans bilan de départ : pas de mesures de référence pour suivre la progression.', '']),
    `Pour répondre, écrivez à ${data.email}.`,
    '(Ce message part de la boîte du cabinet : « Répondre » renverrait vers le cabinet.)',
  ].join('\n')
  return { subject, text }
}

export const sendTrainingRequest = createServerFn({ method: 'POST' })
  .validator(trainingRequestSchema)
  .handler(async ({ data }): Promise<FormResult> => {
    const early = screen(data)
    if (early) return early
    return sendToPractice('training', composeEmail(data))
  })
