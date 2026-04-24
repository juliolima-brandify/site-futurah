import { pgTable, uuid, text, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Análises geradas a partir do form de aplicação.
 * Cada lead que preenche o formulário gera 1 documento aqui.
 */
export const analises = pgTable(
  "analises",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),

    // tipo do produto
    tipo: text("tipo", { enum: ["express", "completa"] }).notNull().default("express"),

    // pipeline status
    status: text("status", {
      enum: [
        "pendente_dados",
        "scraping",
        "gerando",
        "pendente_revisao",
        "publicada",
        "falhou",
      ],
    })
      .notNull()
      .default("pendente_dados"),

    // dados do form
    instagramHandle: text("instagram_handle").notNull(),
    email: text("email").notNull(),
    nome: text("nome"),
    whatsapp: text("whatsapp"),
    // campos antigos (deprecated, mantidos para não quebrar migrations)
    objetivo: text("objetivo"),
    monetizaHoje: text("monetiza_hoje"),
    tempoDisponivel: text("tempo_disponivel"),
    // campos atuais do wizard
    momento: text("momento"),
    gargalo: text("gargalo"),
    velocidade: text("velocidade"),

    // qualificação operacional (step 5 do wizard)
    equipe: jsonb("equipe"),
    plataformas: jsonb("plataformas"),

    // dados externos / gerados
    dadosScraped: jsonb("dados_scraped"),
    conteudo: jsonb("conteudo"),
    revisorNotas: text("revisor_notas"),

    // pagamento (só para 'completa')
    pago: boolean("pago").notNull().default(false),
    stripeSessionId: text("stripe_session_id"),

    // tracking de leitura
    publishedAt: timestamp("published_at", { withTimezone: true }),
    firstViewedAt: timestamp("first_viewed_at", { withTimezone: true }),
    lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index("analises_status_idx").on(table.status),
    emailIdx: index("analises_email_idx").on(table.email),
    instagramIdx: index("analises_instagram_idx").on(table.instagramHandle),
  })
);

/**
 * Eventos de tracking de uma análise (open, scroll, click).
 */
export const analiseEventos = pgTable(
  "analise_eventos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    analiseId: uuid("analise_id")
      .notNull()
      .references(() => analises.id, { onDelete: "cascade" }),
    tipo: text("tipo").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    analiseIdx: index("analise_eventos_analise_idx").on(table.analiseId),
  })
);

export type Analise = typeof analises.$inferSelect;
export type NewAnalise = typeof analises.$inferInsert;

export type HeadcountFaixa = "solo" | "2-5" | "6-10" | "11-25" | "26-50" | "50+";
export type CustoFuncionarioFaixa =
  | "ate-2k"
  | "2-3.5k"
  | "3.5-5.5k"
  | "5.5-9k"
  | "9-15k"
  | "15k+";
export type CustoPlataformasFaixa =
  | "ate-500"
  | "500-1.5k"
  | "1.5-3k"
  | "3-8k"
  | "8k+";

export interface EquipeAnalise {
  headcount: HeadcountFaixa;
  cargos: string[];
  cargosOutros?: string;
  custoMedioFaixa: CustoFuncionarioFaixa;
}

export interface PlataformasAnalise {
  items: string[];
  outras?: string;
  custoTotalFaixa: CustoPlataformasFaixa;
}
