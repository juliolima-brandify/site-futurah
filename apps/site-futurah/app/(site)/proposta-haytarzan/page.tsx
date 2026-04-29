import type { Metadata } from "next";
import { PageProposta } from "@/components/proposta/PageProposta";
import { haytarzanData } from "@/lib/proposta/haytarzan-data";

export const metadata: Metadata = {
  title: haytarzanData.meta.title,
  description: haytarzanData.meta.description,
  robots: { index: false, follow: false },
};

export default function PropostaHaytarzan() {
  return <PageProposta data={haytarzanData} />;
}
