import type { ModeloProposta } from "@/components/proposta/types";
import type { AnaliseData } from "@/components/proposta/types";

export const PROPOSTA_MODELOS = {
  coproducao: {
    id: "coproducao",
    label: "Coproducao",
    resumo: "Divisao de receita com operacao compartilhada.",
  },
  cash_on_delivery: {
    id: "cash_on_delivery",
    label: "Cash on Delivery",
    resumo: "Pagamento vinculado a resultado/entrega validada.",
  },
} as const satisfies Record<
  ModeloProposta,
  { id: ModeloProposta; label: string; resumo: string }
>;

export const MODELO_PROPOSTA_PADRAO: ModeloProposta = "coproducao";

export function resolveModeloProposta(modelo?: ModeloProposta): ModeloProposta {
  return modelo ?? MODELO_PROPOSTA_PADRAO;
}

export function asCoproducao(data: AnaliseData): AnaliseData {
  return { ...data, modelo: "coproducao" };
}

export function asCashOnDelivery(data: AnaliseData): AnaliseData {
  return { ...data, modelo: "cash_on_delivery" };
}
