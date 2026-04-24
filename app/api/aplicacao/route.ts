import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db, analises, type EquipeAnalise, type PlataformasAnalise } from "@/lib/db";
import { gerarAnaliseEmBackground } from "@/lib/ai/gerar";

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

    // Dispara geração em background — não aguarda.
    // Enquanto o pipeline de scraping real não existe, a IA gera direto
    // a partir dos dados do wizard.
    gerarAnaliseEmBackground(row.id).catch((err) => {
      console.error("[API] /aplicacao geracao background:", err);
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
