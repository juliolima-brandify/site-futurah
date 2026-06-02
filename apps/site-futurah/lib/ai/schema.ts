import { z } from "zod";

/**
 * Schema do output da IA — fonte da verdade pra geração da análise.
 *
 * O `generateObject` do Vercel AI SDK usa este schema pra:
 *  - estruturar a chamada (function calling / json schema)
 *  - validar em runtime o output
 *  - inferir tipos TS
 *
 * **Enxuto desde 2026-05-11**: a página `/analise/[slug]` só renderiza
 * callout de valor + slider de maturidade + radar de pilares + cards +
 * CTA + fundadores. A IA gera SÓ o que aparece: `meta` (pra metadata da
 * página HTML) e `pilares.pilares` (6 pilares pro radar — os outros 2,
 * Maturidade e Velocidade, são derivados em código).
 *
 * `economiaPrevista` é calculada determinísticamente em `lib/ai/economia.ts`.
 * `agendaUrl` vem da env `NEXT_PUBLIC_AGENDA_URL`. Nada disso é da IA.
 */

const pilarChaveIASchema = z.enum([
  "aquisicao",
  "posicionamento",
  "processo-comercial",
  "capacidade-operacional",
  "stack-plataformas",
  "automacao-ia",
]);

const pilarSchema = z.object({
  chave: pilarChaveIASchema,
  nome: z.string().describe("Nome humano do pilar (ex: 'Aquisição', 'Posicionamento')"),
  score: z.number().int().min(0).max(10).describe("Nota inteira 0-10"),
  descricao: z
    .string()
    .describe("Frase curta (~140 chars) explicando o score com base nas respostas do lead"),
  // Narrativa só pros pilares de DOR (score <= 5). null nos saudáveis.
  problema: z
    .string()
    .nullable()
    .describe("Só se score<=5: o que está travando, 1 frase direta em 2ª pessoa. Senão null."),
  impacto: z
    .string()
    .nullable()
    .describe("Só se score<=5: por que isso custa crescimento/dinheiro, 1 frase concreta. Senão null."),
  solucaoIA: z
    .string()
    .nullable()
    .describe(
      "Só se score<=5: como um agente de IA da Futurah resolve, específico e exemplificado (a execução é feita pela Futurah, não algo que o lead monta sozinho). Senão null.",
    ),
  antes: z
    .string()
    .nullable()
    .describe("Só se score<=5: estado atual curtíssimo pra contraste (máx ~8 chars, ex '3h', '0%'). Senão null."),
  depois: z
    .string()
    .nullable()
    .describe("Só se score<=5: estado com IA curtíssimo (máx ~8 chars, ex '10s', '65%'). Senão null."),
});

const pilaresSchema = z.object({
  pilares: z
    .array(pilarSchema)
    .length(6)
    .describe(
      "Exatamente 6 pilares, um pra cada chave do enum. Maturidade/Velocidade são calculados em código.",
    ),
});

export const analiseGeradaSchema = z.object({
  meta: z.object({
    title: z
      .string()
      .describe("Title da página HTML, ex: 'Análise Estratégica — @handle | Futurah'"),
    description: z.string().describe("Description curta da página, ~150 chars"),
  }),
  pilares: pilaresSchema,
});

export type AnaliseGerada = z.infer<typeof analiseGeradaSchema>;
