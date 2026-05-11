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

const REGRAS = `
Regras editoriais:
- Português BR, tom consultivo e direto (não vendedor agressivo).
- Nunca invente dados específicos do Instagram que você não sabe (nº de seguidores, posts reais).
- Use as informações do wizard como verdade de base.
- Em "encerramento.emailContato" use sempre "contato@futurah.co".
- Em "tese.titulo" você pode marcar destaque com {{highlight}}texto{{/highlight}}.
- Em "encerramento.titulo" você pode marcar itálico com {{italic}}texto{{/italic}}.
- A seção "economiaPrevista" é calculada em código — não a gere.
`.trim();

const PILARES_BRIEF = `
Pilares do radar de diagnóstico (campo "pilares.pilares"):

Você precisa gerar EXATAMENTE 6 pilares — um pra cada chave abaixo. As notas Maturidade e Velocidade são calculadas em código a partir do wizard, NÃO as gere.

1. "aquisicao" — Aquisição. Geração de leads, tráfego pago, qualificação na entrada.
   - Score baixo (0-3) se gargalo="trafego". Médio (4-6) se "posicionamento" ou "processo". Médio-alto (6-7) se "gestao". Calibrar pra cima quando momento="escala", pra baixo quando "validacao".

2. "posicionamento" — Posicionamento e Marca. Clareza de oferta, percepção de valor, "porquê escolher você".
   - Score baixo (0-3) se gargalo="posicionamento". Médio (5-7) nos outros casos. Validacao tende a baixo (3-5), escala tende a alto (6-8).

3. "processo-comercial" — Processo Comercial. Velocidade de atendimento, follow-up, fechamento, qualidade da equipe comercial.
   - Score baixo (0-4) se gargalo="processo". Médio (5-7) nos outros. Se equipe.cargos inclui SDR/atendente-whatsapp/qualificador o score sobe ~1.

4. "capacidade-operacional" — Capacidade Operacional. Tamanho da equipe vs faturamento, gargalos de pessoas.
   - Calibrar: solo + escala → score baixo (2-4, sobrecarregado). Headcount alto + validacao → médio-baixo (3-5, custo alto pra receita). Headcount adequado pro momento → 6-8. Se gargalo="gestao", baixo (2-4).

5. "stack-plataformas" — Stack & Plataformas. Sobreposição/custo de SaaS, integrações soltas.
   - Score 8-9 se plataformas.items vazio ou muito pequeno (1-2 ferramentas). Score baixo (3-5) se tem >5 plataformas ou custoTotalFaixa em "3-8k"/"8k+" (caro/sobreposição). Médio (6-7) no meio.

6. "automacao-ia" — Automação & IA. Quanto da operação já é automatizada com agentes/IA.
   - SEMPRE score baixo a médio-baixo (2-5) — é o pilar onde a Futurah entra. Score baixo (1-3) se gargalo="gestao" ou cargos manuais (atendente-whatsapp, sdr, agendadora, recepcionista, suporte-n1, financeiro-op). Score médio (4-6) só em casos onde já tem alguma automação visível.

Para cada pilar:
- "nome": use o nome humano sem aspas (ex: "Aquisição", "Posicionamento", "Processo Comercial", "Capacidade Operacional", "Stack & Plataformas", "Automação & IA").
- "score": inteiro 0-10.
- "descricao": frase curta (~140 chars) explicando POR QUE esse score, citando contexto do wizard. Tom consultivo, segunda pessoa ("Você...", "Sua operação...").

Princípio: ao menos 1 pilar de "dor" (aquisicao/posicionamento/processo-comercial/capacidade-operacional) tem que ter score <= 4 (consistente com o gargalo declarado). Automação-IA sempre <= 5. Isso cria a abertura comercial.
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

${REGRAS}

${PILARES_BRIEF}`;

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
