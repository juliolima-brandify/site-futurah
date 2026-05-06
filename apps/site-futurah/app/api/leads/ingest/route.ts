import config from "@payload-config"
import { NextResponse } from "next/server"
import { getPayload } from "payload"

// /api/leads/ingest — endpoint server-to-server pra outros apps do monorepo
// (augustofelipe, fidevidraceiro, etc.) inserirem leads no Payload central
// com tenant scope correto.
//
// Auth: bearer fixo (`LEADS_INGEST_TOKEN`). Setado no painel Vercel em todos
// os projetos que ingerem (site-futurah pra ler, augustofelipe pra escrever).
//
// Mapping siteId → tenant: lookup em payload.tenants pelo campo `siteId`
// (text unique). Tenant não-encontrado → 400 unknown_site (não 401, pra
// distinguir token-bom-com-site-errado de token-ruim).

export const runtime = "nodejs"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type IngestPayload = {
  siteId?: string
  name?: string
  email?: string
  whatsapp?: string
  source?: string
  answers?: unknown
}

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

function checkAuth(request: Request): boolean {
  const expected = process.env.LEADS_INGEST_TOKEN
  if (!expected || expected.length < 16) {
    // Mantém endpoint offline se a token não estiver configurada (defesa).
    return false
  }
  const auth = request.headers.get("authorization") || ""
  if (!auth.startsWith("Bearer ")) return false
  const got = auth.slice("Bearer ".length).trim()
  if (got.length !== expected.length) return false
  // Constant-time compare: javascript === leaks length but lengths já casam.
  let mismatch = 0
  for (let i = 0; i < got.length; i++) {
    mismatch |= got.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return mismatch === 0
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return bad("unauthorized", 401)
  }

  let body: IngestPayload
  try {
    body = (await request.json()) as IngestPayload
  } catch {
    return bad("invalid_json")
  }

  const siteId = (body.siteId ?? "").toString().trim()
  if (!siteId || siteId.length > 64) return bad("missing_site_id")

  const name = (body.name ?? "").toString().trim().slice(0, 120)
  if (name.length < 2) return bad("name_invalid")

  const email = (body.email ?? "").toString().trim().toLowerCase().slice(0, 254)
  if (!EMAIL_RE.test(email)) return bad("email_invalid")

  const whatsappRaw = (body.whatsapp ?? "").toString().replace(/\D+/g, "")
  if (whatsappRaw && (whatsappRaw.length < 10 || whatsappRaw.length > 11)) {
    return bad("whatsapp_invalid")
  }

  const source =
    (body.source ?? "").toString().trim().slice(0, 64) || "ingest"

  // answers: aceita qualquer JSON (object/array/null). Cap em ~16KB pra evitar
  // payloads abusivos. Se vier string, deixa string. Se vier outro primitivo,
  // descarta.
  let answers: unknown = null
  if (body.answers !== undefined && body.answers !== null) {
    try {
      const json = JSON.stringify(body.answers)
      if (json && json.length <= 16 * 1024) {
        answers = body.answers
      }
    } catch {
      answers = null
    }
  }

  const payload = await getPayload({ config })

  const tenants = await payload.find({
    collection: "tenants",
    where: { siteId: { equals: siteId } },
    limit: 1,
    overrideAccess: true,
  })

  const tenantId = tenants.docs[0]?.id
  if (!tenantId) {
    return bad("unknown_site")
  }

  // Idempotência: se já existe lead (tenant + email) recente, devolvemos o
  // mesmo id sem duplicar. Sem unique index global no email (cliente B pode
  // ter o mesmo lead que cliente A), mas dentro do tenant deduplicamos.
  const existing = await payload.find({
    collection: "leads",
    where: {
      and: [
        { email: { equals: email } },
        { tenant: { equals: tenantId } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    const dupId = existing.docs[0].id
    return NextResponse.json({ ok: true, id: dupId, dedup: true })
  }

  try {
    const created = await payload.create({
      collection: "leads",
      data: {
        nome: name,
        email,
        whatsapp: whatsappRaw || undefined,
        source,
        // `origem` campo legado: refletir source pra manter o admin coerente.
        origem: source,
        answers: answers ?? undefined,
        receivedAt: new Date().toISOString(),
        tenant: tenantId as never,
      } as never,
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true, id: created.id, dedup: false })
  } catch (err) {
    console.error("[api/leads/ingest] create failed", err)
    return bad("persist_failed", 500)
  }
}
