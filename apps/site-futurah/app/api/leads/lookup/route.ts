import config from "@payload-config"
import { NextResponse } from "next/server"
import { getPayload, type Where } from "payload"

// /api/leads/lookup — leitura server-to-server de um lead já ingerido, pra
// outros apps do monorepo (ex: augustofelipe) montarem telas com dados reais.
// Espelha a auth e o tenant-scoping de /api/leads/ingest.
//
// Auth: bearer fixo (`LEADS_INGEST_TOKEN`, mesmo dos demais apps).
// Query: ?siteId=<id>&social=<handle>  OU  ?siteId=<id>&email=<email>
// Resolve siteId → tenant, busca o lead mais recente do tenant que casa.

export const runtime = "nodejs"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

function checkAuth(request: Request): boolean {
  const expected = process.env.LEADS_INGEST_TOKEN
  if (!expected || expected.length < 16) return false
  const auth = request.headers.get("authorization") || ""
  if (!auth.startsWith("Bearer ")) return false
  const got = auth.slice("Bearer ".length).trim()
  if (got.length !== expected.length) return false
  let mismatch = 0
  for (let i = 0; i < got.length; i++) {
    mismatch |= got.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return mismatch === 0
}

function normalizeSocial(v: string): string {
  return v
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "")
    .split(/[/?#]/)[0]
}

export async function GET(request: Request) {
  if (!checkAuth(request)) return bad("unauthorized", 401)

  const url = new URL(request.url)
  const siteId = (url.searchParams.get("siteId") ?? "").trim()
  if (!siteId || siteId.length > 64) return bad("missing_site_id")

  const social = normalizeSocial(url.searchParams.get("social") ?? "")
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase()
  if (!social && !email) return bad("missing_query")
  if (email && !EMAIL_RE.test(email)) return bad("email_invalid")

  const payload = await getPayload({ config })

  const tenants = await payload.find({
    collection: "tenants",
    where: { siteId: { equals: siteId } },
    limit: 1,
    overrideAccess: true,
  })
  const tenantId = tenants.docs[0]?.id
  if (!tenantId) return bad("unknown_site")

  const match: Where = email
    ? { email: { equals: email } }
    : { social: { equals: social } }

  const found = await payload.find({
    collection: "leads",
    where: { and: [{ tenant: { equals: tenantId } }, match] },
    limit: 1,
    sort: "-receivedAt",
    overrideAccess: true,
  })

  const doc = found.docs[0] as Record<string, unknown> | undefined
  if (!doc) return bad("not_found", 404)

  return NextResponse.json({
    ok: true,
    lead: {
      nome: (doc.nome as string) ?? null,
      email: (doc.email as string) ?? null,
      whatsapp: (doc.whatsapp as string) ?? null,
      social: (doc.social as string) ?? null,
      source: (doc.source as string) ?? null,
      answers: doc.answers ?? null,
      receivedAt: (doc.receivedAt as string) ?? null,
    },
  })
}
