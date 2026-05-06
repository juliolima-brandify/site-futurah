// Seed/upsert dos tenants oficiais. Idempotente.
//
// Por que SQL direto e nao Payload Local API:
//  - O loader `node --import tsx/esm` tem cycle (ERR_REQUIRE_CYCLE_MODULE) com
//    o `payload.config.ts` deste app (TLA do `lexical` + multi-tenant plugin).
//  - O CLI `node --import tsx/esm payload run scripts/<x>.ts` roda silently
//    (sem stdout/stderr), nao confiavel.
//  - O schema ja foi pushado pelo Payload (`npm run dev` toca `/admin`),
//    entao plain SQL upsert via `postgres` cumpre o trabalho com 0 deps
//    e idempotencia clara.
//
// Como rodar:
//   cd apps/site-futurah
//   npx vercel env pull .env.local --environment=production --yes \
//     --scope=admbrandify-gmailcoms-projects
//   # antes da 1a vez: subir dev brevemente pra pushar schema novo
//   #   npm run dev (em outro terminal)  ; curl -s http://localhost:3000/admin
//   node --import tsx/esm scripts/seed-tenants.ts
//   rm .env.local

import * as dotenv from 'dotenv'
import postgres from 'postgres'

// Load .env.local explicitly (dotenv default carrega só .env).
dotenv.config({ path: '.env.local' })

type TenantSeed = {
  slug: string
  name: string
  siteId: string
  domain: string | null
}

const TENANTS: TenantSeed[] = [
  { slug: 'futurah', name: 'Futurah', siteId: 'futurah', domain: 'futurah.co' },
  {
    slug: 'augusto-felipe',
    name: 'Augusto Felipe',
    siteId: 'augustofelipe',
    domain: 'augustofelipe.com',
  },
  {
    slug: 'fi-de-vidraceiro',
    name: 'Fi de Vidraceiro',
    siteId: 'fidevidraceiro',
    domain: 'fidevidraceiro.augustofelipe.com',
  },
]

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL nao definido')
  const sql = postgres(url, { prepare: false })

  console.log('[seed-tenants] Conectado.')

  for (const t of TENANTS) {
    const existing = await sql<Array<{ id: number; site_id: string | null; name: string; domain: string | null }>>`
      SELECT id, site_id, name, domain FROM payload.tenants WHERE slug = ${t.slug} LIMIT 1
    `
    if (existing.length === 0) {
      const created = await sql<Array<{ id: number }>>`
        INSERT INTO payload.tenants (name, slug, site_id, domain, created_at, updated_at)
        VALUES (${t.name}, ${t.slug}, ${t.siteId}, ${t.domain}, NOW(), NOW())
        RETURNING id
      `
      console.log(
        `[seed-tenants] CREATED slug=${t.slug} id=${created[0].id} siteId=${t.siteId}`,
      )
    } else {
      const row = existing[0]
      const updates: string[] = []
      const willSet: Record<string, string | null> = {}
      if (row.site_id !== t.siteId) willSet.site_id = t.siteId
      // Nao sobrescrever name/domain customizado existente, mas ajustar se vazio.
      if (!row.name || row.name.trim().length === 0) willSet.name = t.name
      if (t.domain && (!row.domain || row.domain.trim().length === 0))
        willSet.domain = t.domain

      if (Object.keys(willSet).length === 0) {
        console.log(
          `[seed-tenants] OK     slug=${t.slug} id=${row.id} (no changes)`,
        )
        continue
      }

      // postgres tagged template não suporta dynamic SET facilmente — fazer um
      // por um. Aceitavel pra 3 tenants.
      if (willSet.site_id !== undefined) {
        await sql`UPDATE payload.tenants SET site_id = ${willSet.site_id}, updated_at = NOW() WHERE id = ${row.id}`
        updates.push('site_id')
      }
      if (willSet.name !== undefined) {
        await sql`UPDATE payload.tenants SET name = ${willSet.name}, updated_at = NOW() WHERE id = ${row.id}`
        updates.push('name')
      }
      if (willSet.domain !== undefined) {
        await sql`UPDATE payload.tenants SET domain = ${willSet.domain}, updated_at = NOW() WHERE id = ${row.id}`
        updates.push('domain')
      }
      console.log(
        `[seed-tenants] UPDATE slug=${t.slug} id=${row.id} fields=${updates.join(',')}`,
      )
    }
  }

  const all = await sql<
    Array<{ id: number; slug: string; site_id: string | null; name: string }>
  >`SELECT id, slug, site_id, name FROM payload.tenants ORDER BY id`
  console.log('\n[seed-tenants] FINAL STATE:')
  for (const r of all) {
    console.log(
      `  - ${r.slug.padEnd(20)} siteId=${(r.site_id ?? '<null>').padEnd(20)} id=${r.id} name="${r.name}"`,
    )
  }

  await sql.end()
  process.exit(0)
}

main().catch((e) => {
  console.error('[seed-tenants] FAILED:', e)
  process.exit(1)
})
