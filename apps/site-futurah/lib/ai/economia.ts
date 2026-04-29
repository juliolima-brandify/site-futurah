import type {
  EconomiaPrevistaData,
  EconomiaFuncionario,
  EconomiaPlataforma,
} from "@/components/proposta/types";
import type { EquipeAnalise, PlataformasAnalise } from "@/lib/db";
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
