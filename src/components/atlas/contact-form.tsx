// The contact form. The server checks everything again and sends (src/server/contact.ts).
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
import { contactSchema, contactTopics } from '@/lib/contact-schema'
import type { FailReason, FormResult } from '@/lib/form-common'
import { AppLink } from '@/lib/link'
import { sendContactMessage } from '@/server/contact'

const FIELDS = ['name', 'email', 'phone', 'topic', 'message'] as const
const ID = 'contact'

export function ContactForm() {
  const send = useServerFn(sendContactMessage)
  const [status, setStatus] = React.useState<'idle' | 'sent' | FailReason>('idle')
  const openedAt = useOpenedAt()
  const formRef = React.useRef<HTMLFormElement>(null)
  const sentRef = React.useRef<HTMLHeadingElement>(null)
  const errorRef = React.useRef<HTMLDivElement>(null)

  const form = useForm({
    defaultValues: { name: '', email: '', phone: '', topic: '', message: '', website: '' },
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
            ...contactSchema.parse(value),
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
          Message envoyé
        </h3>
        <p className="mt-3 mb-0 max-w-[52ch] leading-relaxed text-fg-secondary">
          Merci. Le cabinet vous répondra par e-mail. Pour un rendez-vous, l’agenda Doctolib de
          chaque praticien reste le plus rapide.
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
          Écrire un autre message
        </Button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      noValidate
      aria-labelledby="contact-form-title"
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
          <form.Field name="name" validators={rules(contactSchema.shape.name)}>
            {(field) => (
              <TextField field={field} idPrefix={ID} label="Nom et prénom" autoComplete="name" />
            )}
          </form.Field>
          <form.Field name="email" validators={rules(contactSchema.shape.email)}>
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
        </div>

        <form.Field name="phone" validators={rules(contactSchema.shape.phone)}>
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
              className="md:max-w-[calc(50%-10px)]"
            />
          )}
        </form.Field>

        <form.Field name="topic" validators={rules(contactSchema.shape.topic)}>
          {(field) => (
            <ChoiceField field={field} idPrefix={ID} legend="Sujet" options={contactTopics} />
          )}
        </form.Field>

        <form.Field name="message" validators={rules(contactSchema.shape.message)}>
          {(field) => (
            <TextAreaField
              field={field}
              idPrefix={ID}
              label="Message"
              maxLength={3000}
              help="Pas de détails médicaux ici : on en parle en séance, sous le secret professionnel."
            />
          )}
        </form.Field>

        <form.Field name="website">
          {(field) => <Honeypot field={field} idPrefix={ID} />}
        </form.Field>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 max-w-[46ch] text-[13px] leading-relaxed text-muted-foreground">
            Vos coordonnées servent uniquement à vous répondre.{' '}
            <AppLink href="/confidentialite" className="underline hover:text-foreground">
              En savoir plus
            </AppLink>
          </p>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" size="lg" disabled={isSubmitting} className="shrink-0">
                {isSubmitting && <Spinner className="text-current" />}
                {isSubmitting ? 'Envoi…' : 'Envoyer le message'}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </FieldGroup>
    </form>
  )
}
