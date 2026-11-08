// The contact form. Checks each field when the visitor leaves it, then live once it has been
// flagged, so an error clears as soon as it's fixed. The server checks everything again and sends.
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import * as React from 'react'
import type { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { practice } from '@/content/practice'
import { contactSchema, contactTopics, type ContactResult } from '@/lib/contact-schema'
import { AppLink } from '@/lib/link'
import { sendContactMessage } from '@/server/contact'

type FailReason = Exclude<ContactResult, { ok: true }>['reason']

const failMessages: Record<FailReason, string> = {
  invalid: 'Certains champs ne sont pas valides. Vérifiez-les puis renvoyez le message.',
  'rate-limited':
    'Plusieurs messages sont partis d’ici en peu de temps. Réessayez dans un quart d’heure,',
  unavailable: 'L’envoi de messages est momentanément indisponible. Réessayez plus tard,',
  failed: 'Votre message n’a pas pu partir. Réessayez dans un instant,',
}

/** The first problem with a value, as a sentence, or nothing. */
function firstError(schema: z.ZodType, value: unknown) {
  const result = schema.safeParse(value)
  return result.success ? undefined : result.error.issues[0]?.message
}

/**
 * One validator, run on change but silent until the field has been left once (or the form
 * submitted): no error while someone is still typing, and an error clears as soon as it's fixed.
 * All errors live under the same cause, so fixing a field always clears its message.
 */
function rules(schema: z.ZodType) {
  return {
    onChange: ({
      value,
      fieldApi,
    }: {
      value: unknown
      fieldApi: { state: { meta: { isBlurred: boolean } } }
    }) => (fieldApi.state.meta.isBlurred ? firstError(schema, value) : undefined),
  }
}

/** Leaving a field marks it, then checks it. */
function leave(field: { handleBlur: () => void; validate: (cause: 'change') => unknown }) {
  field.handleBlur()
  void field.validate('change')
}

const FIELDS = ['name', 'email', 'phone', 'topic', 'message'] as const

const MESSAGE_MAX = 3000

export function ContactForm() {
  const send = useServerFn(sendContactMessage)
  const [status, setStatus] = React.useState<'idle' | 'sent' | FailReason>('idle')
  const openedAt = React.useRef(0)
  const formRef = React.useRef<HTMLFormElement>(null)
  const sentRef = React.useRef<HTMLHeadingElement>(null)
  const errorRef = React.useRef<HTMLDivElement>(null)

  // Set in the browser: the page is prerendered, so a value from render time would be stale.
  React.useEffect(() => {
    openedAt.current = Date.now()
  }, [])

  const form = useForm({
    defaultValues: { name: '', email: '', phone: '', topic: '', message: '', website: '' },
    onSubmitInvalid: () => {
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      })
    },
    onSubmit: async ({ value }) => {
      setStatus('idle')
      let result: ContactResult
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
        {status !== 'idle' && (
          <Alert variant="destructive" ref={errorRef} tabIndex={-1} className="outline-none">
            <AlertTitle>Le message n’est pas parti</AlertTitle>
            <AlertDescription>
              {failMessages[status]}{' '}
              {status !== 'invalid' && (
                <>
                  ou appelez le cabinet au{' '}
                  <a href={`tel:${practice.phoneE164}`} className="underline">
                    {practice.phone}
                  </a>
                  .
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-7 md:grid-cols-2 md:gap-5">
          <form.Field name="name" validators={rules(contactSchema.shape.name)}>
            {(field) => <TextField field={field} label="Nom et prénom" autoComplete="name" />}
          </form.Field>
          <form.Field name="email" validators={rules(contactSchema.shape.email)}>
            {(field) => (
              <TextField
                field={field}
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
          {(field) => {
            const error = field.state.meta.errors[0] as string | undefined
            return (
              <FieldSet
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'topic-error' : undefined}
              >
                <FieldLegend>Sujet</FieldLegend>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {Object.entries(contactTopics).map(([value, label]) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-start gap-3 rounded-md border border-input bg-inset px-3.5 py-3 text-[14px] transition-colors has-checked:border-primary has-focus-visible:ring-[3px] has-focus-visible:ring-ring"
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={value}
                        checked={field.state.value === value}
                        onChange={() => field.handleChange(value)}
                        onBlur={() => leave(field)}
                        aria-invalid={error ? true : undefined}
                        className="mt-0.5 size-4 shrink-0 accent-primary outline-none"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <FieldError id="topic-error" className="text-[13px]">
                  {error}
                </FieldError>
              </FieldSet>
            )
          }}
        </form.Field>

        <form.Field name="message" validators={rules(contactSchema.shape.message)}>
          {(field) => {
            const error = field.state.meta.errors[0] as string | undefined
            const length = field.state.value.length
            return (
              <Field data-invalid={error ? true : undefined}>
                <FieldLabel htmlFor="contact-message">Message</FieldLabel>
                <Textarea
                  id="contact-message"
                  name={field.name}
                  rows={6}
                  maxLength={MESSAGE_MAX}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={() => leave(field)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={`contact-message-help${error ? ' contact-message-error' : ''}`}
                  className="min-h-[160px]"
                />
                <FieldDescription id="contact-message-help" className="flex justify-between gap-4">
                  <span>
                    Pas de détails médicaux ici : on en parle en séance, sous le secret
                    professionnel.
                  </span>
                  <span aria-hidden className="shrink-0 tabular-nums">
                    {length} / {MESSAGE_MAX}
                  </span>
                </FieldDescription>
                <FieldError id="contact-message-error" className="text-[13px]">
                  {error}
                </FieldError>
              </Field>
            )
          }}
        </form.Field>

        {/* Hidden from people and assistive tech; a bot that fills every field fills this one. */}
        <form.Field name="website">
          {(field) => (
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="contact-website">Ne pas remplir</label>
              <input
                id="contact-website"
                name={field.name}
                tabIndex={-1}
                autoComplete="off"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
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

interface TextFieldApi {
  name: string
  state: { value: string; meta: { errors: unknown[] } }
  handleChange: (value: string) => void
  handleBlur: () => void
  validate: (cause: 'change') => unknown
}

function TextField({
  field,
  label,
  optional,
  description,
  className,
  ...inputProps
}: {
  field: TextFieldApi
  label: string
  optional?: boolean
  description?: string
  className?: string
} & Pick<React.ComponentProps<'input'>, 'type' | 'autoComplete' | 'inputMode'>) {
  const id = `contact-${field.name}`
  const error = field.state.meta.errors[0] as string | undefined
  const describedBy = [description && `${id}-help`, error && `${id}-error`].filter(Boolean)
  return (
    <Field data-invalid={error ? true : undefined} className={className}>
      <FieldLabel htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-muted-foreground">(facultatif)</span>}
      </FieldLabel>
      <Input
        id={id}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={() => leave(field)}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy.length ? describedBy.join(' ') : undefined}
        {...inputProps}
      />
      {description && <FieldDescription id={`${id}-help`}>{description}</FieldDescription>}
      <FieldError id={`${id}-error`} className="text-[13px]">
        {error}
      </FieldError>
    </Field>
  )
}
