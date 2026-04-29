import type { EquipeAnalise, PlataformasAnalise } from "@/lib/db";
import { CATALOGO_CARGOS, CATALOGO_PLATAFORMAS } from "./catalogo";

export interface PromptInput {
  instagramHandle: string;
  nome?: string | null;
  momento: string;
  gargalo: string;
  velocidade: string;
  equipe: EquipeAnalise | null;
  plataformas: PlataformasAnalise | null;
}

const SHAPE_INSTRUCTIONS = `
Você devolve JSON válido com ESTA estrutura (sem comentários):

{
  "modelo": "cash_on_delivery",
  "variante": "empresa",
  "meta": { "title": string, "description": string },
  "hero": {
    "badge": string,
    "titulo": string,
    "subtitulo": string,
    "ctaAncora": string (opcional),
    "rodape": string (opcional)
  },
  "retrato": {
    "eyebrow": string,
    "titulo": string,
    "subtitulo": string,
    "stats": [{ "num": string, "label": string }] (3-4 itens),
    "fechamento": string (opcional)
  },
  "diagnostico": {
    "eyebrow": string,
    "titulo": string,
    "subtitulo": string,
    "cards": [{ "titulo": string, "body": string }] (3 itens)
  },
  "tese": {
    "eyebrow": string,
    "titulo": string (pode usar {{highlight}}texto{{/highlight}} para destacar),
    "body": string
  },
  "frentes": {
    "eyebrow": string,
    "titulo": string,
    "subtitulo": string,
    "layout": "stack",
    "cards": [{
      "numero": "01" | "02" | "03",
      "pillLabel": string,
      "pillTone": "lime" | "dark",
      "titulo": string,
      "body": string,
      "bullets": [string, string, string, string],
      "destaque": boolean (opcional)
    }] (2-3 cards)
  },
  "bancoIdeias": {
    "eyebrow": string,
    "titulo": string,
    "subtitulo": string,
    "categorias": [{
      "numero": "01" | "02" | "03",
      "titulo": string,
      "itens": [string, string, string, string]
    }] (2-3 categorias)
  },
  "fases": {
    "eyebrow": string,
    "titulo": string,
    "subtitulo": string,
    "fases": [{
      "phase": "Fase 01" | "Fase 02" | "Fase 03",
      "weeks": string (ex: "Semanas 1-4"),
      "title": string,
      "bullets": [string, string, string]
    }] (3 fases)
  },
  "escopo": {
    "eyebrow": string,
    "titulo": string,
    "subtitulo": string,
    "itens": [string] (4-6 itens)
  },
  "potencial": {
    "eyebrow": string,
    "titulo": string,
    "subtitulo": string,
    "cards": [{
      "eyebrow": string,
      "titulo": string,
      "body": string,
      "potencialLabel": string,
      "potencialValor": string,
      "destaque": boolean (opcional)
    }] (3 cards, um com destaque: true),
    "observacao": string (opcional)
  },
  "encerramento": {
    "eyebrow": string,
    "titulo": string (pode usar {{italic}}texto{{/italic}}),
    "body": string,
    "emailContato": "contato@futurah.co"
  }
}

Regras:
- Português BR, tom consultivo e direto (não vendedor agressivo).
- Nunca invente dados específicos do Instagram que você não sabe (nº de seguidores, posts reais).
- Use as informações do wizard como verdade de base.
- Não gere a seção "economiaPrevista" — ela é calculada programaticamente.
`.trim();

function descrevMomento(momento: string): string {
  switch (momento) {
    case "validacao":
      return "Fase de Validação (fatura < R$ 10k/mês, buscando primeiros clientes)";
    case "tracao":
      return "Fase de Tração (R$ 10k a R$ 50k/mês, já vende mas quer crescer mais rápido)";
    case "escala":
      return "Fase de Escala (> R$ 50k/mês, busca processos, time e lucro previsível)";
    default:
      return momento;
  }
}

function descrevGargalo(gargalo: string): string {
  switch (gargalo) {
    case "trafego":
      return "Gasta com anúncios e o telefone não toca (problema de tráfego/qualificação)";
    case "posicionamento":
      return "Chegam muitos curiosos que acham caro (problema de posicionamento/branding)";
    case "processo":
      return "Equipe demora para atender e perde vendas (problema de processo comercial)";
    case "gestao":
      return "É escravo da operação, não tem tempo (problema de gestão/automação)";
    default:
      return gargalo;
  }
}

function descrevVelocidade(velocidade: string): string {
  switch (velocidade) {
    case "prioridade":
      return "Começar é prioridade total";
    case "validar":
      return "Quer começar mas precisa validar o investimento";
    case "pesquisando":
      return "Está apenas pesquisando mercado";
    default:
      return velocidade;
  }
}

function descrevHeadcount(v: string): string {
  const map: Record<string, string> = {
    solo: "trabalha sozinho",
    "2-5": "2 a 5 pessoas",
    "6-10": "6 a 10 pessoas",
    "11-25": "11 a 25 pessoas",
    "26-50": "26 a 50 pessoas",
    "50+": "mais de 50 pessoas",
  };
  return map[v] ?? v;
}

function descrevCustoFunc(v: string): string {
  const map: Record<string, string> = {
    "ate-2k": "até R$ 2k/funcionário",
    "2-3.5k": "R$ 2k a R$ 3,5k/funcionário",
    "3.5-5.5k": "R$ 3,5k a R$ 5,5k/funcionário",
    "5.5-9k": "R$ 5,5k a R$ 9k/funcionário",
    "9-15k": "R$ 9k a R$ 15k/funcionário",
    "15k+": "acima de R$ 15k/funcionário",
  };
  return map[v] ?? v;
}

function descrevCustoPlat(v: string): string {
  const map: Record<string, string> = {
    "ate-500": "até R$ 500/mês",
    "500-1.5k": "R$ 500 a R$ 1.500/mês",
    "1.5-3k": "R$ 1.500 a R$ 3.000/mês",
    "3-8k": "R$ 3.000 a R$ 8.000/mês",
    "8k+": "acima de R$ 8.000/mês",
  };
  return map[v] ?? v;
}

export function buildPrompt(input: PromptInput): { system: string; user: string } {
  const system = `Você é um estrategista sênior da Futurah & Co., uma agência brasileira AI-first que substitui headcount operacional e plataformas pagas por agentes de IA. Sua missão: gerar uma análise estratégica personalizada para o lead a partir do questionário que ele preencheu.

Tom: consultivo, direto, sem bullshit. Números conservadores. Não prometa milagres.

${SHAPE_INSTRUCTIONS}`;

  const cargosLista = input.equipe?.cargos
    .map((c) => CATALOGO_CARGOS[c]?.label ?? c)
    .join(", ");
  const cargosOutros = input.equipe?.cargosOutros?.trim();

  const plataformasLista = input.plataformas?.items
    .map((p) => CATALOGO_PLATAFORMAS[p]?.label ?? p)
    .join(", ");
  const plataformasOutras = input.plataformas?.outras?.trim();

  const user = `DADOS DO LEAD:
${input.nome ? `- Nome: ${input.nome}` : "- Nome: não informado"}
- Instagram/Site: ${input.instagramHandle}
- Momento do negócio: ${descrevMomento(input.momento)}
- Gargalo principal: ${descrevGargalo(input.gargalo)}
- Velocidade: ${descrevVelocidade(input.velocidade)}

EQUIPE:
${input.equipe ? `- Headcount: ${descrevHeadcount(input.equipe.headcount)}
- Cargos: ${cargosLista || "—"}${cargosOutros ? ` | Outros: ${cargosOutros}` : ""}
- Custo médio: ${descrevCustoFunc(input.equipe.custoMedioFaixa)}` : "- Não informado"}

PLATAFORMAS:
${input.plataformas ? `- Itens: ${plataformasLista || "—"}${plataformasOutras ? ` | Outras: ${plataformasOutras}` : ""}
- Custo total mensal: ${descrevCustoPlat(input.plataformas.custoTotalFaixa)}` : "- Não informado"}

Gere o JSON da análise estratégica.`;

  return { system, user };
}
