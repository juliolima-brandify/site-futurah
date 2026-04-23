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

export interface MiniFaqItem {
  pergunta: string;
  resposta: string;
}

export interface MiniFaqData {
  eyebrow: string;
  titulo: string;
  itens: MiniFaqItem[];
}

/**
 * Estrutura completa da análise — tudo que a PageProposta precisa pra renderizar.
 */
export interface AnaliseData {
  /** Modelo comercial usado na proposta. */
  modelo?: ModeloProposta;
  variante: VarianteAnalise;
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
  encerramento: EncerramentoData;
  miniFaq?: MiniFaqData;
}
