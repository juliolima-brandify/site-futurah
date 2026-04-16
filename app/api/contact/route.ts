import { NextResponse } from 'next/server'
import { getWriteClient } from '@/lib/sanity-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, social } = body as { name?: string; email?: string; social?: string }

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Nome e e-mail são obrigatórios.' },
        { status: 400 }
      )
    }

    const client = getWriteClient()
    if (!client) {
      return NextResponse.json(
        { error: 'Serviço de contato não configurado.' },
        { status: 503 }
      )
    }

    await client.create({
      _type: 'lead',
      name: name.trim(),
      email: email.trim(),
      social: typeof social === 'string' ? social.trim() : undefined,
      receivedAt: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[API] contact:', err)
    return NextResponse.json(
      { error: 'Erro ao enviar. Tente de novo.' },
      { status: 500 }
    )
  }
}
