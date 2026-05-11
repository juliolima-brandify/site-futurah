import Quiz from "../diagnostico/Quiz";

export const metadata = {
  title: "Lista de espera — Construindo um Viral",
  description:
    "Faça o diagnóstico do seu perfil e entre na lista de espera do Construindo um Viral. Aviso de lançamento e preço promocional pra quem está na lista.",
};

export default function ListaEsperaPage() {
  return <Quiz mode="waitlist" />;
}
