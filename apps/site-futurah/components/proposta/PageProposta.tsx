import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { AnaliseData } from "./types";
import { resolveModeloProposta } from "@/lib/proposta/modelos";
import { HeroSection } from "./sections/HeroSection";
import { RetratoSection } from "./sections/RetratoSection";
import { DiagnosticoSection } from "./sections/DiagnosticoSection";
import { TeseSection } from "./sections/TeseSection";
import { FrentesSection } from "./sections/FrentesSection";
import { BancoIdeiasSection } from "./sections/BancoIdeiasSection";
import { FasesSection } from "./sections/FasesSection";
import { EscopoSection } from "./sections/EscopoSection";
import { PotencialSection } from "./sections/PotencialSection";
import { EconomiaSection } from "./sections/EconomiaSection";
import { EncerramentoSection } from "./sections/EncerramentoSection";
import { TeamTestimonialSection } from "@/components/sections/TeamTestimonialSection";
import { MiniFaqSection } from "./sections/MiniFaqSection";

interface Props {
  data: AnaliseData;
  /**
   * Slot opcional renderizado como primeiro filho do `<main>`.
   * Hoje sem uso (a página `/analise/[slug]` monta seu próprio layout enxuto
   * sem usar `PageProposta`). Mantido pra propostas estáticas que queiram
   * inserir tracking custom.
   */
  tracker?: React.ReactNode;
}

/**
 * Página completa de proposta — usada SÓ por propostas estáticas:
 * `/proposta-haytarzan`, `/proposta-augusto-felipe`, `/proposta-carlos-damiao`.
 *
 * A análise gerada via wizard (`/analise/[slug]`) NÃO usa este componente —
 * tem layout próprio minimalista em `app/(site)/analise/[slug]/page.tsx`
 * (sem Header/Footer, sem Hero/Retrato/Diagnóstico/Tese/Economia/Encerramento).
 */
export function PageProposta({ data, tracker }: Props) {
  const modelo = resolveModeloProposta(data.modelo);
  const ofertaNoFinal = modelo === "cash_on_delivery";
  const esconderEscopo = modelo === "cash_on_delivery";

  return (
    <>
      <Header />
      <main
        className="bg-white relative"
        data-proposta-modelo={modelo}
        data-analise-content
      >
        {tracker}
        <HeroSection data={data.hero} />
        <RetratoSection data={data.retrato} />
        <DiagnosticoSection data={data.diagnostico} />
        <TeseSection data={data.tese} />
        {!ofertaNoFinal && <FrentesSection data={data.frentes} />}
        <BancoIdeiasSection data={data.bancoIdeias} />
        <FasesSection data={data.fases} />
        {!esconderEscopo && <EscopoSection data={data.escopo} />}
        <PotencialSection data={data.potencial} />
        {ofertaNoFinal && <FrentesSection data={data.frentes} />}
        {data.economiaPrevista && (
          <EconomiaSection data={data.economiaPrevista} agendaUrl={data.agendaUrl} />
        )}
        <EncerramentoSection data={data.encerramento} agendaUrl={data.agendaUrl} />
        <TeamTestimonialSection />
        {data.miniFaq && <MiniFaqSection data={data.miniFaq} />}
      </main>
      <Footer />
    </>
  );
}
