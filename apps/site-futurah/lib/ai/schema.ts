import { z } from "zod";

/**
 * Schema do output da IA — fonte da verdade pra geração da análise.
 *
 * Espelha `AnaliseData` (`components/proposta/types.ts`). O `generateObject`
 * do Vercel AI SDK usa este schema pra:
 *  - estruturar a chamada (function calling / json schema)
 *  - validar em runtime o output
 *  - inferir tipos TS
 *
 * Importante: a seção `economiaPrevista` é OMITIDA do schema porque é
 * calculada programaticamente (`lib/ai/economia.ts`) — não deixamos a IA
 * alucinar números.
 */

const heroSchema = z.object({
  badge: z.string().describe("Tag pequena acima do título, ex: 'Análise estratégica · @handle'"),
  titulo: z.string().describe("Título principal — pode usar quebras de linha"),
  subtitulo: z.string().describe("Subtítulo/body abaixo do título"),
  ctaAncora: z.string().nullable().describe("Texto do link âncora 'começar a leitura'"),
  rodape: z.string().nullable(),
});

const retratoStatSchema = z.object({
  num: z.string(),
  label: z.string(),
});

const retratoSchema = z.object({
  eyebrow: z.string(),
  titulo: z.string(),
  subtitulo: z.string(),
  stats: z.array(retratoStatSchema).min(3).max(4).describe("3-4 stats complementares"),
  fechamento: z.string().nullable(),
});

const diagnosticoCardSchema = z.object({
  titulo: z.string(),
  body: z.string(),
});

const diagnosticoSchema = z.object({
  eyebrow: z.string(),
  titulo: z.string(),
  subtitulo: z.string(),
  cards: z.array(diagnosticoCardSchema).length(3).describe("Exatamente 3 cards"),
});

const teseSchema = z.object({
  eyebrow: z.string(),
  titulo: z
    .string()
    .describe("Pode usar marcação {{highlight}}texto{{/highlight}} pra destacar trecho"),
  body: z.string(),
});

const frenteCardSchema = z.object({
  numero: z.string().describe("'01', '02', '03', etc."),
  pillLabel: z.string(),
  pillTone: z.enum(["lime", "dark"]),
  titulo: z.string(),
  body: z.string(),
  bullets: z.array(z.string()).length(4).describe("Exatamente 4 bullets"),
  destaque: z.boolean().nullable(),
});

const frentesSchema = z.object({
  eyebrow: z.string(),
  titulo: z.string(),
  subtitulo: z.string(),
  layout: z.enum(["grid", "stack"]).nullable().describe("Default 'stack' pra cash_on_delivery"),
  cards: z.array(frenteCardSchema).min(2).max(3),
  observacao: z.string().nullable(),
});

const categoriaIdeiasSchema = z.object({
  numero: z.string().describe("'01', '02', '03'"),
  titulo: z.string(),
  itens: z.array(z.string()).length(4),
  fullWidth: z.boolean().nullable(),
});

const bancoIdeiasSchema = z.object({
  eyebrow: z.string(),
  titulo: z.string(),
  subtitulo: z.string(),
  categorias: z.array(categoriaIdeiasSchema).min(2).max(3),
  fechamento: z.string().nullable(),
});

const faseSchema = z.object({
  phase: z.string().describe("'Fase 01', 'Fase 02', 'Fase 03'"),
  weeks: z.string().describe("Ex: 'Semanas 1-4'"),
  title: z.string(),
  bullets: z.array(z.string()).length(3),
});

const fasesSchema = z.object({
  eyebrow: z.string(),
  titulo: z.string(),
  subtitulo: z.string(),
  fases: z.array(faseSchema).length(3),
});

const escopoSchema = z.object({
  eyebrow: z.string(),
  titulo: z.string(),
  subtitulo: z.string(),
  itens: z.array(z.string()).min(4).max(6),
});

const potencialCardSchema = z.object({
  eyebrow: z.string(),
  titulo: z.string(),
  body: z.string(),
  potencialLabel: z.string(),
  potencialValor: z.string(),
  destaque: z.boolean().nullable(),
});

const potencialSchema = z.object({
  eyebrow: z.string(),
  titulo: z.string(),
  subtitulo: z.string(),
  cards: z.array(potencialCardSchema).length(3).describe("Exatamente 3 cards, um com destaque:true"),
  observacao: z.string().nullable(),
  formatosParceria: z.string().nullable(),
});

const encerramentoSchema = z.object({
  eyebrow: z.string(),
  titulo: z.string().describe("Pode usar marcação {{italic}}texto{{/italic}}"),
  body: z.string(),
  emailContato: z.string().describe("Sempre 'contato@futurah.co'"),
  disclaimer: z.string().nullable(),
});

const miniFaqItemSchema = z.object({
  pergunta: z.string(),
  resposta: z.string(),
});

const miniFaqSchema = z.object({
  eyebrow: z.string(),
  titulo: z.string(),
  itens: z.array(miniFaqItemSchema).min(3).max(6),
});

/**
 * Schema completo do `AnaliseData` SEM `economiaPrevista`.
 * É o que a IA precisa gerar.
 */
export const analiseGeradaSchema = z.object({
  modelo: z.enum(["coproducao", "cash_on_delivery"]).describe("Default 'cash_on_delivery'"),
  variante: z.enum(["criador", "empresa", "infoprodutor"]),
  meta: z.object({
    title: z.string(),
    description: z.string(),
  }),
  hero: heroSchema,
  retrato: retratoSchema,
  diagnostico: diagnosticoSchema,
  tese: teseSchema,
  frentes: frentesSchema,
  bancoIdeias: bancoIdeiasSchema,
  fases: fasesSchema,
  escopo: escopoSchema,
  potencial: potencialSchema,
  encerramento: encerramentoSchema,
  miniFaq: miniFaqSchema.nullable(),
});

export type AnaliseGerada = z.infer<typeof analiseGeradaSchema>;
