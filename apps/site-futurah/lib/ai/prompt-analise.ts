import type { MarketingAnalise } from "@/lib/db";

export interface PromptInput {
  instagramHandle: string;
  nome?: string | null;
  momento: string;
  gargalo: string;
  velocidade: string;
  marketing: MarketingAnalise | null;
}

const REGRAS = `
Regras gerais:
- Português BR, tom consultivo e direto (não vendedor agressivo).
- Use as informações do wizard como verdade de base. Nunca invente dados do Instagram (nº de seguidores, posts reais, etc.).
- Números conservadores. Não prometa milagres. A Futurah é "IA-first realista": IA com supervisão humana, sem hype.
`.trim();

const PILARES_BRIEF = `
Pilares do radar de diagnóstico (campo "pilares.pilares"):

Você precisa gerar EXATAMENTE 6 pilares — um pra cada chave abaixo. As notas Maturidade e Velocidade são calculadas em código a partir do wizard, NÃO as gere.

O eixo do diagnóstico é MARKETING IA-FIRST (crescimento): aquisição, conversão e onde a IA entra no funil. A economia operacional é prova secundária, não o foco.

1. "aquisicao" — Aquisição. Geração de leads, canais, tráfego, previsibilidade de demanda.
   - Score baixo (0-3) se gargalo="trafego", canais="nao-sei", ou volume="nao-medido". Médio (4-6) se canais depende só de "indicacao" (frágil) ou volume baixo ("ate-10"). Alto (7-8) se já tem tráfego pago rodando ("pago") + volume robusto ("50-200"/"200+"). Calibrar pra baixo quando momento="validacao".

2. "posicionamento" — Posicionamento e Marca. Clareza de oferta, percepção de valor, produção de conteúdo.
   - Score baixo (0-3) se gargalo="posicionamento" ou conteudo="quase-nao". Médio (4-6) se conteudo="eu" (depende do dono) ou "agencia". Alto (6-8) se conteudo="equipe" e momento="escala". Validacao tende a baixo (3-5).

3. "processo-comercial" — Processo Comercial. Velocidade de resposta ao lead, follow-up, conversão.
   - ESTE pilar é dominado pelo tempo de resposta. resposta="sem-processo" → 0-2. "dia-seguinte" → 2-4. "horas" → 5-6. "minutos" → 7-9. Ajustar pra baixo se gargalo="processo".

4. "capacidade-operacional" — Capacidade Operacional. A operação aguenta o volume de leads/demanda sem perder venda?
   - Calibrar: volume alto ("50-200"/"200+") + resposta lenta ("dia-seguinte"/"sem-processo") → baixo (2-4, está perdendo lead). volume baixo + dono fazendo tudo (conteudo="eu") → médio-baixo (3-5). Operação coerente com o volume → 6-8. Se gargalo="gestao", baixo (2-4).

5. "stack-plataformas" — Stack & Plataformas. Eficiência do investimento em ferramentas/operação.
   - Use investimentoFaixa e investimentoAreas. Investimento alto ("20-50k"/"50k+") concentrado em áreas operacionais (comercial/atendimento) → score baixo (3-5, caro e manual). Investimento enxuto ("ate-2k"/"2-8k") → médio-alto (6-8). Médio no meio.

6. "automacao-ia" — Automação & IA. Quanto da operação de marketing/vendas já roda com IA.
   - Dominado por iaHoje. "nunca" → 1-2. "frustrou" → 2-3 (já tentou, gancho do "realista": fazer dar certo com supervisão humana). "pontual" → 3-4. "estruturado" → 5-6. SEMPRE <= 6 — é o pilar onde a Futurah entra.

Para cada pilar:
- "nome": use o nome humano sem aspas (ex: "Aquisição", "Posicionamento", "Processo Comercial", "Capacidade Operacional", "Stack & Plataformas", "Automação & IA").
- "score": inteiro 0-10.
- "descricao": frase curta (~140 chars) explicando POR QUE esse score, citando contexto do wizard. Tom consultivo, segunda pessoa ("Você...", "Sua operação...").

Princípio: ao menos 1 pilar de "dor" (aquisicao/posicionamento/processo-comercial/capacidade-operacional) tem que ter score <= 4 (consistente com o gargalo declarado). Automação-IA sempre <= 6. Isso cria a abertura comercial.
`.trim();

const META_BRIEF = `
Campo "meta":
- "title": "Análise Estratégica — @handle | Futurah" (substitua @handle pelo instagram/site real do lead).
- "description": frase curta (~140 chars) descrevendo a análise. Ex: "Diagnóstico de marketing de @handle: 8 pilares avaliados, leads em risco e onde a IA destrava o crescimento."
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
      return "Não chegam leads suficientes / depende de poucos canais (problema de aquisição)";
    case "posicionamento":
      return "Chegam curiosos que acham caro / oferta não comunica valor (problema de posicionamento)";
    case "processo":
      return "Leads chegam mas escapam — resposta lenta, follow-up falho (problema de conversão)";
    case "gestao":
      return "É escravo da operação, não tem tempo pra crescer (problema de gestão/automação)";
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

function descrevCanais(v: string): string {
  const map: Record<string, string> = {
    organico: "Conteúdo orgânico / redes sociais",
    pago: "Tráfego pago (Meta/Google)",
    indicacao: "Indicação / boca a boca",
    outbound: "Prospecção ativa (outbound)",
    "nao-sei": "Não sabe dizer / é inconstante",
  };
  return map[v] ?? v;
}

function descrevVolume(v: string): string {
  const map: Record<string, string> = {
    "ate-10": "até 10 leads/mês",
    "10-50": "10 a 50 leads/mês",
    "50-200": "50 a 200 leads/mês",
    "200+": "mais de 200 leads/mês",
    "nao-medido": "não mede o volume de leads",
  };
  return map[v] ?? v;
}

function descrevConteudo(v: string): string {
  const map: Record<string, string> = {
    eu: "produz o próprio conteúdo quando dá tempo",
    equipe: "tem equipe/social media produzindo",
    agencia: "terceiriza numa agência",
    "quase-nao": "quase não produz conteúdo",
  };
  return map[v] ?? v;
}

function descrevResposta(v: string): string {
  const map: Record<string, string> = {
    minutos: "responde leads em minutos",
    horas: "responde em algumas horas",
    "dia-seguinte": "responde só no dia seguinte ou mais",
    "sem-processo": "não tem processo definido de resposta",
  };
  return map[v] ?? v;
}

function descrevIaHoje(v: string): string {
  const map: Record<string, string> = {
    nunca: "nunca usou IA no negócio",
    frustrou: "já tentou IA e se frustrou",
    pontual: "uso pontual de IA (ChatGPT etc.)",
    estruturado: "uso estruturado de IA na operação",
  };
  return map[v] ?? v;
}

function descrevInvestimento(v: string): string {
  const map: Record<string, string> = {
    "ate-2k": "até R$ 2k/mês",
    "2-8k": "R$ 2k a R$ 8k/mês",
    "8-20k": "R$ 8k a R$ 20k/mês",
    "20-50k": "R$ 20k a R$ 50k/mês",
    "50k+": "acima de R$ 50k/mês",
  };
  return map[v] ?? v;
}

function descrevAreas(areas: string[]): string {
  const map: Record<string, string> = {
    comercial: "time comercial/vendas",
    atendimento: "atendimento/suporte",
    trafego: "gestão de tráfego",
    conteudo: "produção de conteúdo",
    ferramentas: "ferramentas/SaaS",
  };
  return areas.map((a) => map[a] ?? a).join(", ");
}

export function buildPrompt(input: PromptInput): { system: string; user: string } {
  const system = `Você é um estrategista sênior da Futurah & Co., uma agência brasileira de marketing IA-first: usa agentes de IA (com supervisão humana) pra destravar aquisição, conversão e operação de marketing dos clientes — sem hype, de forma realista.

Sua única tarefa: gerar dois blocos compactos a partir das respostas do wizard que o lead preencheu — (1) metadados da página HTML e (2) os 6 pilares de um radar de diagnóstico. Mais nada.

${REGRAS}

${META_BRIEF}

${PILARES_BRIEF}`;

  const m = input.marketing;
  const user = `DADOS DO LEAD:
${input.nome ? `- Nome: ${input.nome}` : "- Nome: não informado"}
- Instagram/Site: ${input.instagramHandle}
- Momento do negócio: ${descrevMomento(input.momento)}
- Gargalo principal: ${descrevGargalo(input.gargalo)}
- Velocidade: ${descrevVelocidade(input.velocidade)}

FUNIL DE MARKETING:
${
  m
    ? `- Canais de aquisição: ${descrevCanais(m.canais)}
- Volume de leads: ${descrevVolume(m.volume)}
- Produção de conteúdo: ${descrevConteudo(m.conteudo)}
- Tempo de resposta ao lead: ${descrevResposta(m.resposta)}
- Maturidade em IA: ${descrevIaHoje(m.iaHoje)}
- Investimento mensal em operação: ${descrevInvestimento(m.investimentoFaixa)}${
        m.investimentoAreas?.length
          ? ` (concentrado em: ${descrevAreas(m.investimentoAreas)})`
          : ""
      }`
    : "- Não informado"
}

Gere meta + 6 pilares.`;

  return { system, user };
}
