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

interface Props {
  data: AnaliseData;
}

export function PageProposta({ data }: Props) {
  const modelo = resolveModeloProposta(data.modelo);

  return (
    <>
      <Header />
      <main className="bg-white" data-proposta-modelo={modelo}>
        <HeroSection data={data.hero} />
        <RetratoSection data={data.retrato} />
        <DiagnosticoSection data={data.diagnostico} />
        <TeseSection data={data.tese} />
        <FrentesSection data={data.frentes} />
        <BancoIdeiasSection data={data.bancoIdeias} />
        <FasesSection data={data.fases} />
        <EscopoSection data={data.escopo} />
        <PotencialSection data={data.potencial} />
        <EncerramentoSection data={data.encerramento} />
      </main>
      <Footer />
    </>
  );
}
