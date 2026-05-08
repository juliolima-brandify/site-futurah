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
   * Slot opcional renderizado como primeiro filho do `<main>` da análise.
   * Usado por `/analise/[slug]` pra inserir `<AnaliseTracker>` (sentinelas
   * de scroll ancoradas só ao conteúdo da análise, sem incluir Header/Footer).
   */
  tracker?: React.ReactNode;
}

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
