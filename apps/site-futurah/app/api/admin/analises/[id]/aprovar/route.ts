import { NextResponse, after } from "next/server";
import { eq, and } from "drizzle-orm";
import { db, analises } from "@/lib/db";
import { getSuperadminOrNull } from "@/app/admin/analises/lib/auth";
import { enviarEmailAnalisePronta } from "@/lib/email/resend";
import type { AnaliseData } from "@/components/proposta/types";

/**
 * POST /api/admin/analises/[id]/aprovar
 *
 * Transiciona análise de `pendente_revisao` -> `publicada` e dispara
 * email transacional pro lead via Resend (não bloqueia a resposta — usa
 * `after()` pra rodar depois).
 *
 * Idempotente em parte: se a análise já está `publicada`, retorna 409
 * (não envia email de novo). Se está `falhou`, retorna 409.
 */
export async function POST(
  _request: Request,
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

  // UPDATE com WHERE em status='pendente_revisao' garante atomicidade —
  // se outro admin aprovou primeiro, esse update não afeta nada.
  const updated = await db
    .update(analises)
    .set({
      status: "publicada",
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(analises.id, id),
        eq(analises.status, "pendente_revisao"),
      ),
    )
    .returning({
      id: analises.id,
      slug: analises.slug,
      email: analises.email,
      nome: analises.nome,
      conteudo: analises.conteudo,
    });

  const row = updated[0];
  if (!row) {
    // Ou não existe, ou já foi aprovada/rejeitada. Vamos checar pra dar
    // erro mais útil ao admin.
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
        error: `análise já está em status '${existing.status}', não pode aprovar`,
      },
      { status: 409 },
    );
  }

  // Dispara email no after() pra não bloquear o admin. Falha silenciosa —
  // sem RESEND_API_KEY o helper só dá warn e segue.
  after(async () => {
    try {
      const conteudo = row.conteudo as AnaliseData | null;
      const agendaUrl = conteudo?.agendaUrl;
      await enviarEmailAnalisePronta({
        to: row.email,
        nome: row.nome,
        slug: row.slug,
        agendaUrl,
      });
    } catch (err) {
      console.error("[admin/analises/aprovar] email falhou:", err);
    }
  });

  return NextResponse.json({ ok: true, slug: row.slug });
}
