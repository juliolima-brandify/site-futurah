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
import { ValorNaMesaSection } from "./sections/ValorNaMesaSection";
import { MaturidadeSlider } from "./sections/MaturidadeSlider";
import { RadarPilares } from "./sections/RadarPilares";
import { PilaresCards } from "./sections/PilaresCards";
import { CtaTeaserSection } from "./sections/CtaTeaserSection";

interface Props {
  data: AnaliseData;
  /**
   * Slot opcional renderizado como primeiro filho do `<main>` da análise.
   * Usado por `/analise/[slug]` pra inserir `<AnaliseTracker>` (sentinelas
   * de scroll ancoradas só ao conteúdo da análise, sem incluir Header/Footer).
   */
  tracker?: React.ReactNode;
  /**
   * Modo teaser: análise gerada via wizard, gated atrás de Sessão Estratégica.
   * Mostra diagnóstico + pilares + economia, esconde frentes/banco/fases/escopo/potencial.
   * Default false — propostas estáticas (Haytarzan etc.) continuam renderizando tudo.
   */
  modoTeaser?: boolean;
}

export function PageProposta({ data, tracker, modoTeaser = false }: Props) {
  const modelo = resolveModeloProposta(data.modelo);
  const ofertaNoFinal = modelo === "cash_on_delivery";
  const esconderEscopo = modelo === "cash_on_delivery";

  if (modoTeaser) {
    return (
      <>
        <Header />
        <main
          className="bg-white relative"
          data-proposta-modelo={modelo}
          data-proposta-teaser="true"
          data-analise-content
        >
          {tracker}
          <HeroSection data={data.hero} />
          {data.economiaPrevista && (
            <ValorNaMesaSection totais={data.economiaPrevista.totais} />
          )}
          <RetratoSection data={data.retrato} />
          <DiagnosticoSection data={data.diagnostico} />
          {data.pilares && <MaturidadeSlider pilares={data.pilares} />}
          {data.pilares && <RadarPilares pilares={data.pilares} />}
          {data.pilares && <PilaresCards pilares={data.pilares} />}
          <TeseSection data={data.tese} />
          {data.economiaPrevista && (
            <EconomiaSection data={data.economiaPrevista} agendaUrl={data.agendaUrl} />
          )}
          <CtaTeaserSection agendaUrl={data.agendaUrl} />
          <EncerramentoSection data={data.encerramento} agendaUrl={data.agendaUrl} />
          <TeamTestimonialSection />
          {data.miniFaq && <MiniFaqSection data={data.miniFaq} />}
        </main>
        <Footer />
      </>
    );
  }

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
