import 'dotenv/config'

import config from '../payload.config'
import { getPayload } from 'payload'
import postgres from 'postgres'

const DRY_RUN = process.argv.includes('--dry-run')
const TENANT_SLUG = 'futurah'

type LegacyLead = {
  id: string
  nome: string
  email: string
  social: string | null
  origem: string | null
  received_at: Date
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL nao definida')

  const sql = postgres(process.env.DATABASE_URL, { prepare: false })
  const payload = await getPayload({ config })

  const tenant = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: TENANT_SLUG } },
    limit: 1,
  })

  if (tenant.docs.length === 0) throw new Error(`Tenant ${TENANT_SLUG} nao existe`)
  const tenantId = tenant.docs[0].id

  const legacy = await sql<LegacyLead[]>`
    SELECT id, nome, email, social, origem, received_at
    FROM public.leads
    ORDER BY received_at ASC
  `
  console.log(`Encontrados ${legacy.length} leads legados.`)

  let inserted = 0
  let skipped = 0

  for (const lead of legacy) {
    // Dedup por (email + tenant) - receivedAt removido pois round-trip
    // .toISOString() pode perder precisao e falsear duplicatas
    const existing = await payload.find({
      collection: 'leads',
      where: {
        and: [
          { email: { equals: lead.email } },
          { tenant: { equals: tenantId } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      skipped++
      continue
    }

    if (DRY_RUN) {
      console.log(`[dry-run] +lead ${lead.email}`)
      inserted++
      continue
    }

    await payload.create({
      collection: 'leads',
      data: {
        nome: lead.nome,
        email: lead.email,
        social: lead.social ?? undefined,
        origem: lead.origem ?? 'contact_form',
        receivedAt: lead.received_at.toISOString(),
        tenant: tenantId as any,
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
