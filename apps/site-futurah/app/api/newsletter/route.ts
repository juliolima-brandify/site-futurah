import config from "@payload-config"
import { getPayload } from "payload"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body as { email?: string }

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "E-mail é obrigatório." },
        { status: 400 }
      )
    }

    const normalized = email.trim().toLowerCase()
    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: "newsletter-subscribers",
      where: { email: { equals: normalized } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: "newsletter-subscribers",
        id: existing.docs[0].id,
        data: {
          subscribedAt: new Date().toISOString(),
          unsubscribedAt: null as any,
        } as any,
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: "newsletter-subscribers",
        data: {
          email: normalized,
          subscribedAt: new Date().toISOString(),
        } as any,
        overrideAccess: true,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[API] newsletter:", err)
    return NextResponse.json(
      { error: "Erro ao inscrever. Tente de novo." },
      { status: 500 }
    )
  }
}
