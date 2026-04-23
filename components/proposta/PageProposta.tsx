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
import { EncerramentoSection } from "./sections/EncerramentoSection";
import { TeamTestimonialSection } from "@/components/sections/TeamTestimonialSection";
import { MiniFaqSection } from "./sections/MiniFaqSection";

interface Props {
  data: AnaliseData;
}

export function PageProposta({ data }: Props) {
  const modelo = resolveModeloProposta(data.modelo);
  const ofertaNoFinal = modelo === "cash_on_delivery";
  const esconderEscopo = modelo === "cash_on_delivery";

  return (
    <>
      <Header />
      <main className="bg-white" data-proposta-modelo={modelo}>
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
        <EncerramentoSection data={data.encerramento} />
        <TeamTestimonialSection />
        {data.miniFaq && <MiniFaqSection data={data.miniFaq} />}
      </main>
      <Footer />
    </>
  );
}
