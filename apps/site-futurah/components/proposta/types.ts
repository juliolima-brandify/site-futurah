/**
 * Tipos compartilhados da página de análise/proposta.
 * Cada seção da PageProposta é alimentada a partir desses tipos.
 */

export type VarianteAnalise = "criador" | "empresa" | "infoprodutor";
export type ModeloProposta = "coproducao" | "cash_on_delivery";

export interface HeroData {
  /** Tag pequena acima do título (ex: "Análise estratégica · @handle") */
  badge: string;
  /** Título principal em partes (permite quebra de linha e itálico) */
  titulo: string;
  /** Subtítulo/body abaixo do título */
  subtitulo: string;
  /** Texto do link âncora de "começar a leitura" */
  ctaAncora?: string;
  /** Rodapé pequeno abaixo do CTA */
  rodape?: string;
}

export interface RetratoData {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  /** Mock do Instagram (só pra variante criador) */
  instagramMock?: {
    handle: string;
    displayName: string;
    avatarUrl: string;
    verified: boolean;
    stats: { posts: string; seguidores: string; seguindo: string };
    bio: string[];
    linkExterno: string;
  };
  /** Cards de stats complementares abaixo do mock */
  stats: Array<{ num: string; label: string }>;
  /** Parágrafo de fechamento */
  fechamento?: string;
}

export interface DiagnosticoCard {
  titulo: string;
  body: string;
}

export interface DiagnosticoData {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  cards: DiagnosticoCard[];
}

export interface TeseData {
  eyebrow: string;
  /** Título pode ter trecho em highlight usando marcação {{highlight}}...{{/highlight}} */
  titulo: string;
  body: string;
}

export interface FrenteCard {
  numero: string;
  pillLabel: string;
  pillTone: "lime" | "dark";
  titulo: string;
  body: string;
  bullets: string[];
  /** Se true, o card é escuro destacado (tipo frente 3 do Augusto) */
  destaque?: boolean;
}

export interface FrentesData {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  /** Layout da seção: grade (padrão) ou oferta empilhada. */
  layout?: "grid" | "stack";
  cards: FrenteCard[];
  /** Observação em caixa lime no rodapé (opcional) */
  observacao?: string;
}

export interface CategoriaIdeias {
  numero: string;
  titulo: string;
  itens: string[];
  /** Se true, card ocupa full-width e usa fundo escuro */
  fullWidth?: boolean;
}

export interface BancoIdeiasData {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  categorias: CategoriaIdeias[];
  fechamento?: string;
}

export interface Fase {
  phase: string;
  weeks: string;
  title: string;
  bullets: string[];
}

export interface FasesData {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  fases: Fase[];
}

export interface EscopoData {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  itens: string[];
}

export interface PotencialCard {
  eyebrow: string;
  titulo: string;
  body: string;
  potencialLabel: string;
  potencialValor: string;
  destaque?: boolean;
}

export interface PotencialData {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  cards: PotencialCard[];
  observacao?: string;
  formatosParceria?: string;
}

export interface EncerramentoData {
  eyebrow: string;
  titulo: string;
  body: string;
  emailContato: string;
  disclaimer?: string;
}

export type GrupoPilar = "comportamental" | "dor" | "stack";

export type ChavePilar =
  | "maturidade"
  | "velocidade"
  | "aquisicao"
  | "posicionamento"
  | "processo-comercial"
  | "capacidade-operacional"
  | "stack-plataformas"
  | "automacao-ia";

export interface PilarData {
  chave: ChavePilar;
  nome: string;
  /** Nota inteira de 0 a 10. */
  score: number;
  /** ~140 chars. Explicação curta do score. */
  descricao: string;
  grupo: GrupoPilar;
}

export interface PilaresData {
  /** Exatamente 8 pilares (2 comportamentais + 4 de dor + 2 de stack). */
  pilares: PilarData[];
}

export interface MiniFaqItem {
  pergunta: string;
  resposta: string;
}

export interface MiniFaqData {
  eyebrow: string;
  titulo: string;
  itens: MiniFaqItem[];
}

export interface EconomiaFuncionario {
  cargo: string;
  custoAtualEstimado: number;
  substituivel: boolean;
  como: string;
}

export interface EconomiaPlataforma {
  nome: string;
  custoAtualEstimado: number;
  substituivel: boolean;
  alternativa: string;
}

export interface EconomiaTotais {
  custoAtualMensal: number;
  custoProjetadoMensal: number;
  economiaMensal: number;
  economiaAnual: number;
}

export interface EconomiaCta {
  titulo: string;
  subtitulo?: string;
  botao: string;
  href?: string;
}

export interface EconomiaPrevistaData {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  funcionarios: EconomiaFuncionario[];
  plataformas: EconomiaPlataforma[];
  totais: EconomiaTotais;
  observacao?: string;
  cta: EconomiaCta;
}

/**
 * Estrutura completa da análise — tudo que a PageProposta precisa pra renderizar.
 */
export interface AnaliseData {
  /** Modelo comercial usado na proposta. */
  modelo?: ModeloProposta;
  variante: VarianteAnalise;
  /**
   * URL da agenda (Calendly etc.) usada nos CTAs da página.
   * Snapshot imutável: setado server-side na hora de salvar a análise,
   * a partir de `process.env.NEXT_PUBLIC_AGENDA_URL`. Trocar a URL global
   * depois NÃO altera análises já publicadas.
   * Não é gerada pela IA.
   */
  agendaUrl?: string;
  /** Metadata de página (title, description) */
  meta: {
    title: string;
    description: string;
  };
  hero: HeroData;
  retrato: RetratoData;
  diagnostico: DiagnosticoData;
  tese: TeseData;
  frentes: FrentesData;
  bancoIdeias: BancoIdeiasData;
  fases: FasesData;
  escopo: EscopoData;
  potencial: PotencialData;
  economiaPrevista?: EconomiaPrevistaData;
  /** Pilares pro radar de diagnóstico visual. Hoje só populado em propostas estáticas que opcionalmente queiram exibir. */
  pilares?: PilaresData;
  encerramento: EncerramentoData;
  miniFaq?: MiniFaqData;
}

/**
 * Subset MUITO menor de `AnaliseData`, salvo no JSONB `analises.conteudo` para
 * análises GERADAS PELA IA via `/aplicacao` → `lib/ai/gerar.ts`.
 *
 * A página `/analise/[slug]` só renderiza: callout de valor na mesa, slider
 * de maturidade, radar de pilares, cards de pilares, CTA pra Sessão e
 * fundadores. Esse subset reflete só o que essas seções precisam, evitando
 * que a IA gaste tokens em hero/retrato/diagnostico/tese/frentes/banco/fases/
 * escopo/potencial/encerramento/faq — seções que existem em `AnaliseData`
 * mas SÓ aparecem em propostas estáticas (`/proposta-haytarzan` etc.).
 *
 * - `meta`: gerada pela IA, usada em `generateMetadata` da página.
 * - `pilares`: 6 da IA + 2 derivados em código (Maturidade, Velocidade).
 * - `economiaPrevista`: calculada em código (`lib/ai/economia.ts`), não IA.
 * - `agendaUrl`: snapshot da env `NEXT_PUBLIC_AGENDA_URL`.
 * - `variante`/`modelo`: opcionais, usados só pra propagar contexto pro
 *   tracking (`AnaliseTracker`). Defaults aplicados na hora de renderizar.
 */
export interface AnaliseGeradaConteudo {
  meta: {
    title: string;
    description: string;
  };
  variante?: VarianteAnalise;
  modelo?: ModeloProposta;
  pilares?: PilaresData;
  economiaPrevista?: EconomiaPrevistaData;
  agendaUrl?: string;
}
