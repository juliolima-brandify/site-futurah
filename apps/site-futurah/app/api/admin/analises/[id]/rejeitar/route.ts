import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db, analises } from "@/lib/db";
import { getSuperadminOrNull } from "@/app/admin/analises/lib/auth";

interface Body {
  nota?: string;
}

/**
 * POST /api/admin/analises/[id]/rejeitar
 *
 * Transiciona análise de `pendente_revisao` -> `falhou` e grava nota
 * opcional em `revisor_notas`. Não dispara email — rejeição é interna.
 */
export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await getSuperadminOrNull();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json({ error: "id ausente" }, { status: 400 });
  }

  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    // body vazio é ok — nota é opcional
  }
  const nota = body.nota?.trim() || null;

  const updated = await db
    .update(analises)
    .set({
      status: "falhou",
      revisorNotas: nota ?? "rejeitada na revisão (sem nota)",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(analises.id, id),
        eq(analises.status, "pendente_revisao"),
      ),
    )
    .returning({ id: analises.id, slug: analises.slug });

  const row = updated[0];
  if (!row) {
    const [existing] = await db
      .select({ status: analises.status })
      .from(analises)
      .where(eq(analises.id, id))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: "análise não encontrada" }, { status: 404 });
    }
    return NextResponse.json(
      {
        error: `análise já está em status '${existing.status}', não pode rejeitar`,
      },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true, slug: row.slug });
}
