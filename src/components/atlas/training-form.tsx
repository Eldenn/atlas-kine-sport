// The strength and conditioning request form. The server checks everything again and sends
// (src/server/training.ts).
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import * as React from 'react'

import {
  ChoiceField,
  Honeypot,
  rules,
  SendError,
  TextAreaField,
  TextField,
  useOpenedAt,
} from '@/components/atlas/form-parts'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import type { FailReason, FormResult } from '@/lib/form-common'
import { AppLink } from '@/lib/link'
import { trainingFormats, trainingSchema, trainingStarts } from '@/lib/training-schema'
import { sendTrainingRequest } from '@/server/training'

const FIELDS = ['name', 'email', 'phone', 'start', 'format', 'sport', 'goal'] as const
const ID = 'training'

export function TrainingForm({ titleId }: { titleId: string }) {
  const send = useServerFn(sendTrainingRequest)
  const [status, setStatus] = React.useState<'idle' | 'sent' | FailReason>('idle')
  const openedAt = useOpenedAt()
  const formRef = React.useRef<HTMLFormElement>(null)
  const sentRef = React.useRef<HTMLHeadingElement>(null)
  const errorRef = React.useRef<HTMLDivElement>(null)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      start: '',
      format: '',
      sport: '',
      goal: '',
      website: '',
    },
    onSubmitInvalid: () => {
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      })
    },
    onSubmit: async ({ value }) => {
      setStatus('idle')
      let result: FormResult
      try {
        result = await send({
          data: {
            ...trainingSchema.parse(value),
            website: value.website,
            elapsedMs: Math.max(0, Date.now() - openedAt.current),
          },
        })
      } catch {
        result = { ok: false, reason: 'failed' }
      }
      setStatus(result.ok ? 'sent' : result.reason)
      requestAnimationFrame(() => (result.ok ? sentRef : errorRef).current?.focus())
    },
  })

  if (status === 'sent') {
    return (
      <div className="border-border-accent rounded-lg border bg-card p-8">
        <h3 ref={sentRef} tabIndex={-1} className="m-0 font-display text-[28px] outline-none">
          Demande envoyée
        </h3>
        <p className="mt-3 mb-0 max-w-[52ch] leading-relaxed text-fg-secondary">
          Merci. Le cabinet vous répond par e-mail ou par téléphone pour convenir d’un premier
          rendez-vous et vous confirmer le tarif.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            form.reset()
            openedAt.current = Date.now()
            setStatus('idle')
          }}
        >
          Faire une autre demande
        </Button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      noValidate
      aria-labelledby={titleId}
      onSubmit={(event) => {
        event.preventDefault()
        // Submitting counts as leaving every field, so all their errors show.
        for (const name of FIELDS) form.setFieldMeta(name, (meta) => ({ ...meta, isBlurred: true }))
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        {status !== 'idle' && <SendError reason={status} ref={errorRef} />}

        <div className="grid gap-7 md:grid-cols-2 md:gap-5">
          <form.Field name="name" validators={rules(trainingSchema.shape.name)}>
            {(field) => (
              <TextField field={field} idPrefix={ID} label="Nom et prénom" autoComplete="name" />
            )}
          </form.Field>
          <form.Field name="email" validators={rules(trainingSchema.shape.email)}>
            {(field) => (
              <TextField
                field={field}
                idPrefix={ID}
                label="Adresse e-mail"
                type="email"
                autoComplete="email"
                inputMode="email"
              />
            )}
          </form.Field>
          <form.Field name="phone" validators={rules(trainingSchema.shape.phone)}>
            {(field) => (
              <TextField
                field={field}
                idPrefix={ID}
                label="Téléphone"
                optional
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                description="Si vous préférez qu’on vous rappelle."
              />
            )}
          </form.Field>
          <form.Field name="sport" validators={rules(trainingSchema.shape.sport)}>
            {(field) => (
              <TextField
                field={field}
                idPrefix={ID}
                label="Sport et niveau"
                optional
                maxLength={120}
                description="Par exemple : football, régional ; course à pied, loisir."
              />
            )}
          </form.Field>
        </div>

        <form.Field name="start" validators={rules(trainingSchema.shape.start)}>
          {(field) => (
            <ChoiceField
              field={field}
              idPrefix={ID}
              legend="Pour commencer"
              options={trainingStarts}
            />
          )}
        </form.Field>

        <form.Field name="format" validators={rules(trainingSchema.shape.format)}>
          {(field) => (
            <ChoiceField
              field={field}
              idPrefix={ID}
              legend="Formule envisagée"
              options={trainingFormats}
            />
          )}
        </form.Field>

        <form.Field name="goal" validators={rules(trainingSchema.shape.goal)}>
          {(field) => (
            <TextAreaField
              field={field}
              idPrefix={ID}
              label="Votre objectif"
              maxLength={2000}
              rows={5}
              help="Une échéance, une compétition, une reprise… Pas d’antécédents médicaux ici : on en parle au bilan, sous le secret professionnel."
            />
          )}
        </form.Field>

        <form.Field name="website">
          {(field) => <Honeypot field={field} idPrefix={ID} />}
        </form.Field>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 max-w-[46ch] text-[13px] leading-relaxed text-muted-foreground">
            Ces informations servent uniquement à préparer votre prise en charge.{' '}
            <AppLink
              href="/confidentialite#preparation-physique"
              className="underline hover:text-foreground"
            >
              En savoir plus
            </AppLink>
          </p>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" size="lg" disabled={isSubmitting} className="shrink-0">
                {isSubmitting && <Spinner className="text-current" />}
                {isSubmitting ? 'Envoi…' : 'Envoyer la demande'}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </FieldGroup>
    </form>
  )
}
