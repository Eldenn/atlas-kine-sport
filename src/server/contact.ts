// Sends the contact form to the practice's mailbox through the Hostinger Mail API.
// Runs only on the server: the token never reaches the browser. API contract (hostinger-mail-api-sdk
// 1.19): POST /api/v1/mailboxes/{mailboxResourceId}/send, Bearer token, 204 when sent.
import { createServerFn } from '@tanstack/react-start'
import { getRequestIP } from '@tanstack/react-start/server'

import {
  contactRequestSchema,
  contactTopics,
  type ContactRequest,
  type ContactResult,
} from '@/lib/contact-schema'

const API_BASE = 'https://api.mail.hostinger.com'
const MIN_FILL_MS = 3000
const RATE_WINDOW_MS = 15 * 60 * 1000
const RATE_MAX = 5

// Per-IP send times. In memory: the app runs as one process and restarts on deploy, which is
// enough to slow a script down without storing anything about visitors.
const recentSends = new Map<string, number[]>()

function rateLimited(ip: string, now: number) {
  // Forget sends older than the window first: the privacy notice promises 15 minutes at most.
  for (const [key, list] of recentSends) {
    const fresh = list.filter((t) => now - t < RATE_WINDOW_MS)
    if (fresh.length) recentSends.set(key, fresh)
    else recentSends.delete(key)
  }
  const times = recentSends.get(ip) ?? []
  if (times.length >= RATE_MAX) return true
  recentSends.set(ip, [...times, now])
  return false
}

/** One line, no control characters: what goes into a header-like field. */
const oneLine = (value: string) => value.replace(/[\r\n\t]+/g, ' ').trim()

function composeEmail(data: ContactRequest) {
  const topic = contactTopics[data.topic]
  const subject = oneLine(`Site · ${topic} · ${data.name}`)
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
    // Bots: answer as if it worked, so they learn nothing.
    if (data.website !== '' || data.elapsedMs < MIN_FILL_MS) return { ok: true }

    const ip = getRequestIP({ xForwardedFor: true }) ?? 'unknown'
    if (rateLimited(ip, Date.now())) return { ok: false, reason: 'rate-limited' }

    const token = process.env.HOSTINGER_MAIL_API_TOKEN
    const mailbox = process.env.HOSTINGER_MAILBOX_ID
    const to = process.env.CONTACT_TO
    const email = composeEmail(data)

    if (!token || !mailbox || !to) {
      if (import.meta.env.DEV) {
        // Local development without credentials: show what would be sent.
        console.info('[contact] Hostinger not configured, message not sent:\n', email)
        return { ok: true }
      }
      console.error(
        '[contact] HOSTINGER_MAIL_API_TOKEN, HOSTINGER_MAILBOX_ID or CONTACT_TO missing',
      )
      return { ok: false, reason: 'unavailable' }
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/v1/mailboxes/${encodeURIComponent(mailbox)}/send`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            to: to.split(',').map((address) => address.trim()),
            displayName: 'Site Atlas Kiné Sport',
            subject: email.subject,
            text: email.text,
          }),
          signal: AbortSignal.timeout(15_000),
        },
      )
      if (response.ok) return { ok: true }
      // Log the status and the API's error, never the visitor's message.
      console.error('[contact] Hostinger Mail API', response.status, await response.text())
      return { ok: false, reason: 'failed' }
    } catch (error) {
      console.error('[contact] Hostinger Mail API unreachable', error)
      return { ok: false, reason: 'failed' }
    }
  })
