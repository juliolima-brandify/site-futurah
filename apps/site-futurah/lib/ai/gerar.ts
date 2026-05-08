import { eq } from "drizzle-orm";
import { generateObject } from "ai";
import {
  db,
  analises,
  type EquipeAnalise,
  type PlataformasAnalise,
} from "@/lib/db";
import { analiseModel } from "./gateway";
import { analiseGeradaSchema } from "./schema";
import { buildPrompt } from "./prompt-analise";
import { calcularEconomia } from "./economia";
import type { AnaliseData } from "@/components/proposta/types";

// OpenAI strict mode exige todo campo no `required`, então o schema usa
// `.nullable()` em vez de `.optional()`. Normalizamos `null` -> ausência
// antes de salvar pra `AnaliseData` (que tem `?: T`, não `T | null`).
function stripNulls<T>(obj: T): T {
  if (Array.isArray(obj)) return obj.map(stripNulls) as T;
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== null) out[k] = stripNulls(v);
    }
    return out as T;
  }
  return obj;
}

/**
 * Gera o conteúdo da análise via Vercel AI Gateway e grava no banco.
 * Idempotente: se já existe `conteudo`, não faz nada.
 *
 * Disparada via `after()` em /api/aplicacao — roda fora do response cycle
 * mas dentro do budget da função serverless.
 */
export async function gerarAnaliseEmBackground(analiseId: string): Promise<void> {
  const [row] = await db
    .select()
    .from(analises)
    .where(eq(analises.id, analiseId))
    .limit(1);

  if (!row) return;
  if (row.conteudo) return;

  try {
    await db
      .update(analises)
      .set({ status: "gerando", updatedAt: new Date() })
      .where(eq(analises.id, analiseId));

    const equipe = (row.equipe as EquipeAnalise | null) ?? null;
    const plataformas = (row.plataformas as PlataformasAnalise | null) ?? null;

    const { system, user } = buildPrompt({
      instagramHandle: row.instagramHandle,
      nome: row.nome,
      momento: row.momento ?? "",
      gargalo: row.gargalo ?? "",
      velocidade: row.velocidade ?? "",
      equipe,
      plataformas,
    });

    const { object: parsed } = await generateObject({
      model: analiseModel(),
      schema: analiseGeradaSchema,
      system,
      prompt: user,
      temperature: 0.7,
    });

    const economia = calcularEconomia(equipe, plataformas);

    // Snapshot imutável da URL da agenda (Calendly etc.). Lemos da env aqui
    // pra que análises antigas não fiquem com link quebrado se a URL global
    // for trocada depois. Sem env -> CTA cai em fallback no client.
    const agendaUrl = process.env.NEXT_PUBLIC_AGENDA_URL?.trim() || undefined;

    const cleaned = stripNulls(parsed) as Omit<AnaliseData, "agendaUrl" | "economiaPrevista">;
    const conteudo: AnaliseData = {
      ...cleaned,
      agendaUrl,
      economiaPrevista: economia
        ? {
            ...economia,
            cta: { ...economia.cta, href: agendaUrl ?? economia.cta.href },
          }
        : undefined,
    };

    // Análise vai pra revisão humana antes de publicar (Fase 4 / B5).
    // Quando admin aprova em /admin/analises, status muda pra 'publicada'.
    await db
      .update(analises)
      .set({
        conteudo,
        status: "pendente_revisao",
        updatedAt: new Date(),
      })
      .where(eq(analises.id, analiseId));
  } catch (err) {
    console.error("[ai/gerar]", analiseId, err);
    try {
      await db
        .update(analises)
        .set({
          status: "falhou",
          revisorNotas: err instanceof Error ? err.message : String(err),
          updatedAt: new Date(),
        })
        .where(eq(analises.id, analiseId));
    } catch (updateErr) {
      console.error("[ai/gerar] falha ao marcar 'falhou':", updateErr);
    }
  }
}
