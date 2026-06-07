import type { Metadata } from "next";
import QualificacaoForm from "./QualificacaoForm";

export const metadata: Metadata = {
  title: "Qualificação — Creator Elite",
  description: "Questionário de qualificação para a mentoria com Augusto Felipe.",
  robots: { index: false, follow: false, nocache: true },
};

export default function CreatorEliteQualificacaoPage() {
  return <QualificacaoForm />;
}
