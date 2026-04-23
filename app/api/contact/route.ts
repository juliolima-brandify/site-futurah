import config from "@payload-config"
import { getPayload } from "payload"
import { NextResponse } from "next/server"

const DEFAULT_TENANT_SLUG = "futurah"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, social } = body as {
      name?: string
      email?: string
      social?: string
    }

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })
    const host = request.headers.get("host")?.split(":")[0] ?? ""

    const tenantsByHost = await payload.find({
      collection: "tenants",
      where: { domain: { equals: host } },
      limit: 1,
    })

    let tenantId: string | number | undefined = tenantsByHost.docs[0]?.id
    if (!tenantId) {
      const fallback = await payload.find({
        collection: "tenants",
        where: { slug: { equals: DEFAULT_TENANT_SLUG } },
        limit: 1,
      })
      tenantId = fallback.docs[0]?.id
    }

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant não configurado." }, { status: 500 })
    }

    await payload.create({
      collection: "leads",
      data: {
        nome: name.trim(),
        email: email.trim().toLowerCase(),
        social: social?.trim() || undefined,
        origem: "contact_form",
        tenant: tenantId as any,
      } as any,
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[API] contact:", err)
    return NextResponse.json(
      { error: "Erro ao enviar. Tente de novo." },
      { status: 500 }
    )
  }
}
