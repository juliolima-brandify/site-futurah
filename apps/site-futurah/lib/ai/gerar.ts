import { eq } from "drizzle-orm";
import { generateObject } from "ai";
import { db, analises, type MarketingAnalise } from "@/lib/db";
import { analiseModel } from "./gateway";
import { analiseGeradaSchema } from "./schema";
import { buildPrompt } from "./prompt-analise";
import { calcularEconomiaMarketing } from "./economia";
import { enviarEmailAnalisePronta } from "@/lib/email/resend";
import type { AnaliseGeradaConteudo, PilarData } from "@/components/proposta/types";

/**
 * Pilares "comportamentais" derivados das respostas do wizard. Não dependem
 * da IA — calculamos pra evitar alucinação e garantir consistência visual
 * no radar (sempre 2 pilares com score "âncora").
 */
function derivarPilaresComportamentais(
  momento: string,
  velocidade: string,
): PilarData[] {
  const maturidadeMap: Record<string, { score: number; descricao: string }> = {
    validacao: {
      score: 3,
      descricao:
        "Negócio em validação (< R$ 10k/mês). Estrutura ainda em formação — primeiros clientes em andamento.",
    },
    tracao: {
      score: 6,
      descricao:
        "Fase de tração (R$ 10-50k/mês). Vende com consistência mas precisa de processo pra crescer mais rápido.",
    },
    escala: {
      score: 8,
      descricao:
        "Fase de escala (> R$ 50k/mês). Operação madura — agora é sobre previsibilidade, lucro e processos.",
    },
  };

  const velocidadeMap: Record<string, { score: number; descricao: string }> = {
    prioridade: {
      score: 9,
      descricao:
        "Pronto pra começar — é prioridade total. Pré-condição forte pra plano de aceleração de 90 dias.",
    },
    validar: {
      score: 6,
      descricao:
        "Quer começar mas precisa validar o investimento primeiro. Sessão Estratégica resolve isso.",
    },
    pesquisando: {
      score: 2,
      descricao:
        "Em modo pesquisa de mercado. Sem urgência — qualquer plano fica como referência futura.",
    },
  };

  const m = maturidadeMap[momento] ?? maturidadeMap.tracao;
  const v = velocidadeMap[velocidade] ?? velocidadeMap.validar;

  return [
    {
      chave: "maturidade",
      nome: "Maturidade do Negócio",
      score: m.score,
      descricao: m.descricao,
      grupo: "comportamental",
    },
    {
      chave: "velocidade",
      nome: "Velocidade de Execução",
      score: v.score,
      descricao: v.descricao,
      grupo: "comportamental",
    },
  ];
}

const GRUPO_POR_CHAVE: Record<string, "dor" | "stack"> = {
  aquisicao: "dor",
  posicionamento: "dor",
  "processo-comercial": "dor",
  "capacidade-operacional": "dor",
  "stack-plataformas": "stack",
  "automacao-ia": "stack",
};

/**
 * Gera o conteúdo da análise via Vercel AI Gateway e grava no banco.
 * Idempotente: se já existe `conteudo`, não faz nada.
 *
 * Disparada via `after()` em /api/aplicacao — roda fora do response cycle
 * mas dentro do budget da função serverless.
 *
 * Conteúdo salvo é `AnaliseGeradaConteudo` (subset enxuto de `AnaliseData`):
 * só `meta`, `pilares` (6 da IA + 2 derivados), `economiaPrevista`
 * (calculada em código) e `agendaUrl` (snapshot da env).
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

    const marketing = (row.marketing as MarketingAnalise | null) ?? null;

    const { system, user } = buildPrompt({
      instagramHandle: row.instagramHandle,
      nome: row.nome,
      momento: row.momento ?? "",
      gargalo: row.gargalo ?? "",
      velocidade: row.velocidade ?? "",
      marketing,
    });

    const { object: parsed } = await generateObject({
      model: analiseModel(),
      schema: analiseGeradaSchema,
      system,
      prompt: user,
      temperature: 0.7,
    });

    const economia = calcularEconomiaMarketing(marketing);

    // Snapshot imutável da URL da agenda (Calendly etc.). Lemos da env aqui
    // pra que análises antigas não fiquem com link quebrado se a URL global
    // for trocada depois. Sem env -> CTA cai em fallback no client.
    const agendaUrl = process.env.NEXT_PUBLIC_AGENDA_URL?.trim() || undefined;

    // Merge: 2 comportamentais (derivados em código) + 6 da IA (anotados com grupo).
    const pilaresComportamentais = derivarPilaresComportamentais(
      row.momento ?? "",
      row.velocidade ?? "",
    );
    const pilaresIA: PilarData[] = parsed.pilares.pilares.map((p) => ({
      ...p,
      grupo: GRUPO_POR_CHAVE[p.chave] ?? "dor",
    }));

    const conteudo: AnaliseGeradaConteudo = {
      meta: parsed.meta,
      pilares: { pilares: [...pilaresComportamentais, ...pilaresIA] },
      economiaPrevista: economia
        ? {
            ...economia,
            cta: { ...economia.cta, href: agendaUrl ?? economia.cta.href },
          }
        : undefined,
      agendaUrl,
    };

    // Publica direto (sem revisão humana). Análise é teaser — o plano de
    // ação completo fica gated atrás da Sessão Estratégica.
    await db
      .update(analises)
      .set({
        conteudo,
        status: "publicada",
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(analises.id, analiseId));

    // Email transacional via Resend. Isolado em try/catch — falha de email
    // NÃO marca a análise como 'falhou' (ela já publicou com sucesso).
    // Sem RESEND_API_KEY: helper retorna { skipped: true } silenciosamente.
    try {
      await enviarEmailAnalisePronta({
        to: row.email,
        nome: row.nome ?? null,
        slug: row.slug,
        agendaUrl,
      });
    } catch (emailErr) {
      console.error("[ai/gerar] resend falhou para", analiseId, emailErr);
    }
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
