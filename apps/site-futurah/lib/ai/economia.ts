import type {
  EconomiaPrevistaData,
  EconomiaFuncionario,
  EconomiaPlataforma,
} from "@/components/proposta/types";
import type {
  EquipeAnalise,
  PlataformasAnalise,
  MarketingAnalise,
  AreaInvestimento,
} from "@/lib/db";
import {
  CATALOGO_CARGOS,
  CATALOGO_PLATAFORMAS,
  CUSTO_ESTIMADO_CARGO,
  CUSTO_ESTIMADO_PLATAFORMA,
} from "./catalogo";

const HEADCOUNT_MULTIPLICADOR: Record<string, number> = {
  solo: 1,
  "2-5": 3,
  "6-10": 7,
  "11-25": 15,
  "26-50": 35,
  "50+": 60,
};

const CUSTO_FUNCIONARIO_PONTO_MEDIO: Record<string, number> = {
  "ate-2k": 1800,
  "2-3.5k": 2700,
  "3.5-5.5k": 4500,
  "5.5-9k": 7000,
  "9-15k": 11500,
  "15k+": 17000,
};

const CUSTO_PLATAFORMAS_PONTO_MEDIO: Record<string, number> = {
  "ate-500": 400,
  "500-1.5k": 1000,
  "1.5-3k": 2200,
  "3-8k": 5000,
  "8k+": 10000,
};

/**
 * Calcula EconomiaPrevistaData a partir das respostas do wizard,
 * cruzando com o catálogo de substituição.
 *
 * Faz cálculo determinístico — não depende da IA — evitando que a LLM
 * alucine números.
 */
export function calcularEconomia(
  equipe: EquipeAnalise | null,
  plataformas: PlataformasAnalise | null,
): EconomiaPrevistaData | null {
  if (!equipe && !plataformas) return null;

  const funcionarios: EconomiaFuncionario[] = [];
  const plataformasList: EconomiaPlataforma[] = [];

  let custoFuncionariosAtual = 0;
  let custoFuncionariosProjetado = 0;

  if (equipe) {
    const headcountFator = HEADCOUNT_MULTIPLICADOR[equipe.headcount] ?? 1;
    const custoFaixa = CUSTO_FUNCIONARIO_PONTO_MEDIO[equipe.custoMedioFaixa] ?? 4500;

    for (const cargoId of equipe.cargos) {
      const cargo = CATALOGO_CARGOS[cargoId];
      if (!cargo) continue;

      // usa custo estimado do catálogo como base; ajusta pela faixa declarada
      const custoCatalogo = CUSTO_ESTIMADO_CARGO[cargoId] ?? custoFaixa;
      const custoAtual = Math.round((custoCatalogo + custoFaixa) / 2);

      funcionarios.push({
        cargo: cargo.label,
        custoAtualEstimado: custoAtual,
        substituivel: cargo.substituivel,
        como: cargo.como,
      });

      custoFuncionariosAtual += custoAtual;
      if (!cargo.substituivel) {
        custoFuncionariosProjetado += custoAtual;
      }
    }

    // se houver outros cargos não catalogados, adiciona um bloco genérico
    if (equipe.cargosOutros?.trim()) {
      const outros = equipe.cargosOutros
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const outro of outros) {
        const custoAtual = custoFaixa;
        funcionarios.push({
          cargo: outro,
          custoAtualEstimado: custoAtual,
          substituivel: false,
          como: "Avaliado caso a caso na Sessão Estratégica.",
        });
        custoFuncionariosAtual += custoAtual;
        custoFuncionariosProjetado += custoAtual;
      }
    }

    // fator de escala: se headcount indicar múltiplas pessoas, multiplica
    // por um fator moderado (evita superestimar)
    const fatorEscala = Math.max(1, Math.min(headcountFator / 3, 4));
    custoFuncionariosAtual = Math.round(custoFuncionariosAtual * fatorEscala);
    custoFuncionariosProjetado = Math.round(
      custoFuncionariosProjetado * fatorEscala,
    );
  }

  let custoPlataformasAtual = 0;
  let custoPlataformasProjetado = 0;

  if (plataformas) {
    const declaradoTotal =
      CUSTO_PLATAFORMAS_PONTO_MEDIO[plataformas.custoTotalFaixa] ?? 1000;

    // soma dos estimados por item
    let somaEstimada = 0;
    for (const id of plataformas.items) {
      somaEstimada += CUSTO_ESTIMADO_PLATAFORMA[id] ?? 200;
    }

    // usa o maior dos dois como base (declarado pelo user ou estimado)
    const baseTotal = Math.max(declaradoTotal, somaEstimada);
    const ratio = somaEstimada > 0 ? baseTotal / somaEstimada : 1;

    for (const id of plataformas.items) {
      const item = CATALOGO_PLATAFORMAS[id];
      if (!item) continue;

      const custoAtual = Math.round(
        (CUSTO_ESTIMADO_PLATAFORMA[id] ?? 200) * ratio,
      );
      plataformasList.push({
        nome: item.label,
        custoAtualEstimado: custoAtual,
        substituivel: item.substituivel,
        alternativa: item.alternativa,
      });

      custoPlataformasAtual += custoAtual;
      if (!item.substituivel) {
        custoPlataformasProjetado += custoAtual;
      }
    }

    if (plataformas.outras?.trim()) {
      const outras = plataformas.outras
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const outra of outras) {
        plataformasList.push({
          nome: outra,
          custoAtualEstimado: 0,
          substituivel: false,
          alternativa: "Avaliado caso a caso na Sessão Estratégica.",
        });
      }
    }
  }

  const custoAtualMensal = custoFuncionariosAtual + custoPlataformasAtual;
  const custoProjetadoMensal =
    custoFuncionariosProjetado + custoPlataformasProjetado;
  const economiaMensal = Math.max(0, custoAtualMensal - custoProjetadoMensal);
  const economiaAnual = economiaMensal * 12;

  return {
    eyebrow: "Raio-X de custos",
    titulo: "Quanto dá pra economizar trocando operação por IA",
    subtitulo:
      "Mapeamento do seu stack atual cruzado com o que a Futurah automatiza. Números estimados — número exato sai na call.",
    funcionarios,
    plataformas: plataformasList,
    totais: {
      custoAtualMensal,
      custoProjetadoMensal,
      economiaMensal,
      economiaAnual,
    },
    observacao:
      "Estimativas baseadas em faixas médias de mercado e no catálogo de substituição da Futurah. O plano definitivo sai após diagnóstico completo.",
    cta: {
      titulo: "Quer ver o plano detalhado dessa economia?",
      subtitulo:
        "Agende uma Sessão Estratégica — a gente detalha cada substituição e o cronograma de implementação.",
      botao: "Agendar Sessão Estratégica",
      href: "#contato",
    },
  };
}

// Ponto médio mensal de cada faixa de investimento declarada no wizard.
const INVESTIMENTO_PONTO_MEDIO: Record<string, number> = {
  "ate-2k": 1500,
  "2-8k": 5000,
  "8-20k": 13000,
  "20-50k": 32000,
  "50k+": 70000,
};

// Quanto de cada área de investimento a IA da Futurah tipicamente absorve.
// Áreas operacionais (comercial/atendimento) são as mais substituíveis;
// ferramentas só em parte (sempre sobra um núcleo de SaaS).
const AREA_FATOR_SUBSTITUICAO: Record<AreaInvestimento, number> = {
  comercial: 0.55,
  atendimento: 0.65,
  trafego: 0.4,
  conteudo: 0.5,
  ferramentas: 0.35,
};

/**
 * Prova de economia enxuta para o diagnóstico de marketing IA-first.
 *
 * Em vez de mapear cargo a cargo (wizard antigo), parte da faixa única de
 * investimento mensal declarada + as áreas onde esse dinheiro é concentrado,
 * e estima quanto a operação assistida por IA libera. Determinístico — sem IA.
 *
 * Renderiza só `totais.economiaMensal` na `/analise` (as listas detalhadas
 * `funcionarios`/`plataformas` ficam vazias; só propostas estáticas as usam).
 */
export function calcularEconomiaMarketing(
  marketing: MarketingAnalise | null,
): EconomiaPrevistaData | null {
  if (!marketing) return null;

  const custoAtualMensal = INVESTIMENTO_PONTO_MEDIO[marketing.investimentoFaixa] ?? 5000;

  const areas = marketing.investimentoAreas ?? [];
  // Fator médio de substituição das áreas marcadas. Sem áreas → assume 0.45.
  const fatorMedio =
    areas.length > 0
      ? areas.reduce((acc, a) => acc + (AREA_FATOR_SUBSTITUICAO[a] ?? 0.4), 0) /
        areas.length
      : 0.45;

  const economiaMensal = Math.round(custoAtualMensal * fatorMedio);
  const custoProjetadoMensal = custoAtualMensal - economiaMensal;
  const economiaAnual = economiaMensal * 12;

  return {
    eyebrow: "Raio-X de investimento",
    titulo: "Quanto do seu investimento a IA libera todo mês",
    subtitulo:
      "Estimativa a partir do que você investe hoje em operação de marketing e vendas. Número exato sai na call com um fundador.",
    funcionarios: [],
    plataformas: [],
    totais: {
      custoAtualMensal,
      custoProjetadoMensal,
      economiaMensal,
      economiaAnual,
    },
    observacao:
      "Estimativa baseada na faixa de investimento declarada e nas áreas onde a IA da Futurah costuma atuar. O plano definitivo sai após o diagnóstico completo.",
    cta: {
      titulo: "Quer ver pra onde esse valor pode ir?",
      subtitulo:
        "Fale com um dos fundadores — a gente detalha onde a IA entra no seu funil e o que isso libera de caixa.",
      botao: "Falar com um fundador",
      href: "#contato",
    },
  };
}
