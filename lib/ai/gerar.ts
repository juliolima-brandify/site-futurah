import { eq } from "drizzle-orm";
import {
  db,
  analises,
  type EquipeAnalise,
  type PlataformasAnalise,
} from "@/lib/db";
import { getOpenAI, OPENAI_MODEL } from "./openai";
import { buildPrompt } from "./prompt-analise";
import { calcularEconomia } from "./economia";
import type { AnaliseData } from "@/components/proposta/types";

/**
 * Gera o conteúdo da análise via OpenAI e grava no banco.
 * Idempotente: se já existe `conteudo`, não faz nada.
 *
 * Roda em background (fire-and-forget) — chamado após POST /api/aplicacao.
 * Enquanto não há scraping real, a IA trabalha só com os dados do wizard.
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

    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("OpenAI retornou resposta vazia");

    const parsed = JSON.parse(raw) as Partial<AnaliseData>;

    // Cálculo programático da economia — não deixamos a IA alucinar números.
    const economia = calcularEconomia(equipe, plataformas);

    const conteudo: AnaliseData = {
      modelo: parsed.modelo ?? "cash_on_delivery",
      variante: parsed.variante ?? "empresa",
      meta: parsed.meta ?? {
        title: `Análise estratégica | @${row.instagramHandle}`,
        description: "Análise personalizada gerada pela Futurah & Co.",
      },
      hero: parsed.hero!,
      retrato: parsed.retrato!,
      diagnostico: parsed.diagnostico!,
      tese: parsed.tese!,
      frentes: parsed.frentes!,
      bancoIdeias: parsed.bancoIdeias!,
      fases: parsed.fases!,
      escopo: parsed.escopo!,
      potencial: parsed.potencial!,
      encerramento: parsed.encerramento!,
      miniFaq: parsed.miniFaq,
      economiaPrevista: economia ?? parsed.economiaPrevista,
    };

    validateConteudo(conteudo);

    // TODO(fase 4): mudar para "pendente_revisao" quando o admin de revisão existir.
    // Por enquanto publica direto.
    await db
      .update(analises)
      .set({
        conteudo,
        status: "publicada",
        publishedAt: new Date(),
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

function validateConteudo(conteudo: AnaliseData): void {
  const required = [
    "hero",
    "retrato",
    "diagnostico",
    "tese",
    "frentes",
    "bancoIdeias",
    "fases",
    "escopo",
    "potencial",
    "encerramento",
  ] as const;
  for (const key of required) {
    if (!conteudo[key]) {
      throw new Error(`Seção obrigatória ausente no conteudo: ${key}`);
    }
  }
}
