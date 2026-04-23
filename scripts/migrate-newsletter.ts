import 'dotenv/config'

import config from '../payload.config'
import { getPayload } from 'payload'
import postgres from 'postgres'

const DRY_RUN = process.argv.includes('--dry-run')

type LegacyNewsletter = {
  id: string
  email: string
  subscribed_at: Date
  unsubscribed_at: Date | null
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL nao definida')

  const sql = postgres(process.env.DATABASE_URL, { prepare: false })
  const payload = await getPayload({ config })

  const legacy = await sql<LegacyNewsletter[]>`
    SELECT id, email, subscribed_at, unsubscribed_at
    FROM public.newsletter_subscribers
    ORDER BY subscribed_at ASC
  `
  console.log(`Encontrados ${legacy.length} inscritos legados.`)

  let inserted = 0
  let skipped = 0

  for (const subscriber of legacy) {
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: subscriber.email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      skipped++
      continue
    }

    if (DRY_RUN) {
      console.log(`[dry-run] +${subscriber.email}`)
      inserted++
      continue
    }

    await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        email: subscriber.email,
        subscribedAt: subscriber.subscribed_at.toISOString(),
        unsubscribedAt: subscriber.unsubscribed_at?.toISOString() ?? undefined,
      } as any,
      overrideAccess: true,
    })
    inserted++
  }

  console.log(`Inseridos: ${inserted} | Skipped: ${skipped}`)
  await sql.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
