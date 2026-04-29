import type { Metadata } from "next";
import { PageProposta } from "@/components/proposta/PageProposta";
import { carlosDamiaoData } from "@/lib/proposta/carlos-damiao-data";

export const metadata: Metadata = {
  title: carlosDamiaoData.meta.title,
  description: carlosDamiaoData.meta.description,
  robots: { index: false, follow: false },
};

export default function PropostaCarlosDamiao() {
  return <PageProposta data={carlosDamiaoData} />;
}
