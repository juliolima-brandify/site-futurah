import { NextResponse } from 'next/server'
import { getWriteClient } from '@/lib/sanity-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body as { email?: string }

    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'E-mail é obrigatório.' },
        { status: 400 }
      )
    }

    const client = getWriteClient()
    if (!client) {
      return NextResponse.json(
        { error: 'Serviço de newsletter não configurado.' },
        { status: 503 }
      )
    }

    await client.create({
      _type: 'newsletter',
      email: email.trim(),
      subscribedAt: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[API] newsletter:', err)
    return NextResponse.json(
      { error: 'Erro ao inscrever. Tente de novo.' },
      { status: 500 }
    )
  }
}
