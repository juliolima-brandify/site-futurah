import type { Metadata } from "next";
import type { PilaresData } from "@/components/proposta/types";
import { MaturidadeSlider } from "@/components/proposta/sections/MaturidadeSlider";
import { RadarPilares } from "@/components/proposta/sections/RadarPilares";
import { PilaresCards } from "@/components/proposta/sections/PilaresCards";
import { CtaCallSection } from "@/components/proposta/sections/CtaCallSection";
import { TeamTestimonialSection } from "@/components/sections/TeamTestimonialSection";

export const metadata: Metadata = {
  title: "Prévia (mock) — Diagnóstico Futurah",
  robots: { index: false, follow: false },
};

// Caso de exemplo só pra visualizar o layout final. NÃO usa banco nem IA.
const MOCK: PilaresData = {
  pilares: [
    {
      chave: "maturidade",
      nome: "Maturidade do Negócio",
      score: 6,
      grupo: "comportamental",
      descricao:
        "Fase de tração (R$ 10-50k/mês). Vende com consistência, mas precisa de processo pra crescer mais rápido.",
    },
    {
      chave: "velocidade",
      nome: "Velocidade de Execução",
      score: 6,
      grupo: "comportamental",
      descricao:
        "Quer começar, mas precisa validar o investimento primeiro. A call resolve isso.",
    },
    {
      chave: "processo-comercial",
      nome: "Processo Comercial",
      score: 2,
      grupo: "dor",
      descricao: "Sem processo de resposta — leads esperam horas.",
      problema: "Seus leads esperam horas por uma resposta.",
      impacto:
        "Lead esfria em minutos. Cada hora de espera derruba sua conversão — e o cliente fecha com quem responde primeiro.",
      solucaoIA:
        "Um agente de IA responde em ~10s, qualifica, tira dúvidas e já agenda, 24/7. A Futurah monta e supervisiona isso pra você.",
      antes: "3h",
      depois: "10s",
    },
    {
      chave: "aquisicao",
      nome: "Aquisição",
      score: 4,
      grupo: "dor",
      descricao: "Depende de indicação, sem canal previsível.",
      problema: "Seus clientes vêm quase só de indicação.",
      impacto:
        "Sem um canal previsível, seu faturamento oscila e você não consegue planejar o próximo passo.",
      solucaoIA:
        "Estruturamos tráfego pago + um agente que qualifica cada lead na entrada, enchendo sua agenda de forma previsível.",
      antes: "5/mês",
      depois: "40/mês",
    },
    {
      chave: "automacao-ia",
      nome: "Automação & IA",
      score: 2,
      grupo: "stack",
      descricao: "Operação 100% manual.",
      problema: "Hoje quase tudo na sua operação é feito na mão.",
      impacto:
        "Seu time gasta horas em tarefas repetitivas que poderiam rodar sozinhas — e você paga caro por isso.",
      solucaoIA:
        "Agentes de IA assumem atendimento, qualificação e follow-up, com um especialista da Futurah auditando a qualidade.",
      antes: "0%",
      depois: "70%",
    },
    {
      chave: "capacidade-operacional",
      nome: "Capacidade Operacional",
      score: 5,
      grupo: "dor",
      descricao: "Equipe no limite pro volume atual.",
      problema: "Sua equipe já está no limite pro volume de hoje.",
      impacto:
        "Crescer significaria contratar mais — custo fixo que pesa no caixa antes de o retorno chegar.",
      solucaoIA:
        "A IA absorve o volume operacional, então você cresce o atendimento sem inflar a folha.",
      antes: "R$ 8k",
      depois: "R$ 3k",
    },
    {
      chave: "posicionamento",
      nome: "Posicionamento",
      score: 6,
      grupo: "dor",
      descricao:
        "Oferta clara, mas a comunicação ainda podia destacar melhor o seu diferencial.",
    },
    {
      chave: "stack-plataformas",
      nome: "Stack & Plataformas",
      score: 7,
      grupo: "stack",
      descricao: "Stack enxuto e bem aproveitado pro momento atual.",
    },
  ],
};

export default function AnalisePreviewPage() {
  return (
    <main className="bg-white relative">
      <MaturidadeSlider pilares={MOCK} />
      <RadarPilares pilares={MOCK} />
      <PilaresCards pilares={MOCK} />
      <CtaCallSection />
      <TeamTestimonialSection />
    </main>
  );
}
