import { PitchStep } from "../diagnostico/Quiz";
import { ViewContentTracker } from "./ViewContentTracker";

export const metadata = {
  title: "Construindo um Viral — Augusto Felipe",
  description:
    "Aprenda o processo de quem chegou a 59 milhões de views por mês sem pagar tráfego — e construa seu primeiro viral ainda essa semana.",
};

// Página de venda direta: só o pitch do workshop (sem o quiz). Ideal pra
// tráfego que já está quente — vai direto pra oferta. O quiz completo (com
// diagnóstico) fica em /diagnostico.
export default function ConstruindoUmViralPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <ViewContentTracker />
      <main className="flex-1">
        <PitchStep />
      </main>
      <footer className="text-center text-xs text-neutral-400 py-6">
        © 2026 — augustofelipe.com
      </footer>
    </div>
  );
}
