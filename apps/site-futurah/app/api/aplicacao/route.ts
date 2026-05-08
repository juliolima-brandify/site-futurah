import { NextResponse, after } from "next/server";
import { nanoid } from "nanoid";
import { db, analises, type EquipeAnalise, type PlataformasAnalise } from "@/lib/db";
import { gerarAnaliseEmBackground } from "@/lib/ai/gerar";
import {
  consume,
  extractIp,
  RL_APLICACAO_IP,
  RL_APLICACAO_EMAIL,
} from "@/lib/rate-limit";

interface Body {
  nome?: string;
  email?: string;
  whatsapp?: string;
  instagramHandle?: string;
  momento?: string;
  gargalo?: string;
  velocidade?: string;
  equipe?: EquipeAnalise;
  plataformas?: PlataformasAnalise;
}

function normalizeHandle(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  // se veio URL, extrai o último segmento
  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const url = new URL(trimmed);
      const parts = url.pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1] ?? url.hostname;
      return last.replace(/^@/, "");
    }
  } catch {
    // fallthrough
  }
  return trimmed.replace(/^@/, "");
}

export async function POST(request: Request) {
  try {
    // Rate-limit por IP (5/h). Roda antes de qualquer parsing custoso —
    // bot spam não consome AI Gateway nem hits no Postgres.
    const ip = extractIp(request.headers);
    const ipCheck = consume(RL_APLICACAO_IP, ip);
    if (!ipCheck.ok) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde alguns minutos e tente de novo." },
        {
          status: 429,
          headers: { "Retry-After": String(ipCheck.retryAfterSeconds) },
        },
      );
    }

    const body = (await request.json()) as Body;

    const email = body.email?.trim().toLowerCase() ?? "";
    const rawHandle = body.instagramHandle?.trim() ?? "";
    const instagramHandle = normalizeHandle(rawHandle);

    if (!email || !instagramHandle) {
      return NextResponse.json(
        { error: "E-mail e site/Instagram são obrigatórios." },
        { status: 400 },
      );
    }

    if (!body.momento || !body.gargalo || !body.velocidade) {
      return NextResponse.json(
        { error: "Responda momento, gargalo e velocidade." },
        { status: 400 },
      );
    }

    // Rate-limit por email (2/24h) — só agora que email foi validado.
    // Cada submissão queima crédito do AI Gateway, então mantemos baixo.
    const emailCheck = consume(RL_APLICACAO_EMAIL, email);
    if (!emailCheck.ok) {
      return NextResponse.json(
        {
          error:
            "Você já solicitou uma análise recentemente. Confira o email — se não chegou, fale com a gente em contato@futurah.co.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(emailCheck.retryAfterSeconds) },
        },
      );
    }

    const slug = nanoid(22);

    const [row] = await db
      .insert(analises)
      .values({
        slug,
        tipo: "express",
        status: "pendente_dados",
        instagramHandle,
        email,
        nome: body.nome?.trim() || null,
        whatsapp: body.whatsapp?.trim() || null,
        momento: body.momento,
        gargalo: body.gargalo,
        velocidade: body.velocidade,
        equipe: body.equipe ?? null,
        plataformas: body.plataformas ?? null,
      })
      .returning({ id: analises.id, slug: analises.slug });

    // Dispara geração após a resposta — `after()` mantém a função serverless
    // viva até o callback terminar (sem isso, Vercel pode cortar antes da
    // OpenAI/gateway responder e a análise trava em 'gerando').
    after(async () => {
      try {
        await gerarAnaliseEmBackground(row.id);
      } catch (err) {
        console.error("[API] /aplicacao geracao background:", err);
      }
    });

    return NextResponse.json({ id: row.id, slug: row.slug });
  } catch (err) {
    console.error("[API] /aplicacao:", err);
    return NextResponse.json(
      { error: "Erro ao processar. Tente novamente." },
      { status: 500 },
    );
  }
}
