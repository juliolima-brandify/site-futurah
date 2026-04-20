import type { Metadata } from "next";
import { PageProposta } from "@/components/proposta/PageProposta";
import { augustoData } from "@/lib/proposta/augusto-data";

export const metadata: Metadata = {
  title: augustoData.meta.title,
  description: augustoData.meta.description,
  robots: { index: false, follow: false },
};

export default function PropostaAugustoFelipe() {
  return <PageProposta data={augustoData} />;
}
