// The pieces the site's forms share: validation timing, text and choice fields, the hidden
// anti-spam field and the error banner. Each field checks itself when the visitor leaves it, then
// live once it has been flagged, so an error clears as soon as it's fixed.
import * as React from 'react'
import type { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { practice } from '@/content/practice'
import type { FailReason } from '@/lib/form-common'
import { cn } from '@/lib/utils'

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
export function rules(schema: z.ZodType) {
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

export interface FieldApi {
  name: string
  state: { value: string; meta: { errors: unknown[] } }
  handleChange: (value: string) => void
  handleBlur: () => void
  validate: (cause: 'change') => unknown
}

/** Leaving a field marks it, then checks it. */
function leave(field: Pick<FieldApi, 'handleBlur' | 'validate'>) {
  field.handleBlur()
  void field.validate('change')
}

const errorOf = (field: FieldApi) => field.state.meta.errors[0] as string | undefined

/** Why the form did not go, with the phone number as a fallback. Focusable, to be announced. */
export function SendError({ reason, ref }: { reason: FailReason; ref: React.Ref<HTMLDivElement> }) {
  return (
    <Alert variant="destructive" ref={ref} tabIndex={-1} className="outline-none">
      <AlertTitle>Le message n’est pas parti</AlertTitle>
      <AlertDescription>
        {failMessages[reason]}{' '}
        {reason !== 'invalid' && (
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
  )
}

export function TextField({
  field,
  idPrefix,
  label,
  optional,
  description,
  className,
  ...inputProps
}: {
  field: FieldApi
  /** Keeps ids unique when two forms could share a page. */
  idPrefix: string
  label: string
  optional?: boolean
  description?: string
  className?: string
} & Pick<React.ComponentProps<'input'>, 'type' | 'autoComplete' | 'inputMode' | 'maxLength'>) {
  const id = `${idPrefix}-${field.name}`
  const error = errorOf(field)
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

/** A long answer with a character count. */
export function TextAreaField({
  field,
  idPrefix,
  label,
  help,
  maxLength,
  rows = 6,
}: {
  field: FieldApi
  idPrefix: string
  label: string
  help: React.ReactNode
  maxLength: number
  rows?: number
}) {
  const id = `${idPrefix}-${field.name}`
  const error = errorOf(field)
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        id={id}
        name={field.name}
        rows={rows}
        maxLength={maxLength}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={() => leave(field)}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-help${error ? ` ${id}-error` : ''}`}
        className="min-h-[160px]"
      />
      <FieldDescription id={`${id}-help`} className="flex justify-between gap-4">
        <span>{help}</span>
        <span aria-hidden className="shrink-0 tabular-nums">
          {field.state.value.length} / {maxLength}
        </span>
      </FieldDescription>
      <FieldError id={`${id}-error`} className="text-[13px]">
        {error}
      </FieldError>
    </Field>
  )
}

/** One answer among a few, as radio cards. */
export function ChoiceField({
  field,
  idPrefix,
  legend,
  options,
  columns = 2,
}: {
  field: FieldApi
  idPrefix: string
  legend: string
  options: Record<string, string>
  columns?: 1 | 2
}) {
  const error = errorOf(field)
  const errorId = `${idPrefix}-${field.name}-error`
  return (
    <FieldSet
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
    >
      <FieldLegend>{legend}</FieldLegend>
      <div className={cn('grid gap-2.5', columns === 2 && 'sm:grid-cols-2')}>
        {Object.entries(options).map(([value, label]) => (
          <label
            key={value}
            className="flex cursor-pointer items-start gap-3 rounded-md border border-input bg-inset px-3.5 py-3 text-[14px] transition-colors has-checked:border-primary has-focus-visible:ring-[3px] has-focus-visible:ring-ring"
          >
            <input
              type="radio"
              name={`${idPrefix}-${field.name}`}
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
      <FieldError id={errorId} className="text-[13px]">
        {error}
      </FieldError>
    </FieldSet>
  )
}

/** Hidden from people and assistive tech; a bot that fills every field fills this one. */
export function Honeypot({ field, idPrefix }: { field: FieldApi; idPrefix: string }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={`${idPrefix}-website`}>Ne pas remplir</label>
      <input
        id={`${idPrefix}-website`}
        name={field.name}
        tabIndex={-1}
        autoComplete="off"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </div>
  )
}

/** When the form was opened, set in the browser: the page is prerendered. */
export function useOpenedAt() {
  const openedAt = React.useRef(0)
  React.useEffect(() => {
    openedAt.current = Date.now()
  }, [])
  return openedAt
}
