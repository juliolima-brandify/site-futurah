import PropostaDeck from "./PropostaDeck";

// Proposta comercial privada (link mandado direto pra BYD) — fora do índice.
export const metadata = {
  title: "Proposta Comercial · Augusto Felipe × BYD",
  description:
    "Festival Interlagos 2026 — ativações digitais e artísticas de Augusto Felipe (Fi de Vidraceiro) para a BYD.",
  robots: { index: false, follow: false },
};

export default function PropostaBydPage() {
  return <PropostaDeck />;
}
