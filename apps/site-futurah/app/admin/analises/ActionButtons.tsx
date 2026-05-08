"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  id: string;
  slug: string;
}

/**
 * Botões "Aprovar" / "Rejeitar" da revisão de análise.
 * Bate em `/api/admin/analises/[id]/{aprovar,rejeitar}` (ambos POST).
 */
export function ActionButtons({ id, slug }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<"aprovar" | "rejeitar" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function aprovar() {
    setBusy("aprovar");
    setError(null);
    try {
      const res = await fetch(`/api/admin/analises/${id}/aprovar`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "erro");
      setBusy(null);
    }
  }

  async function rejeitar() {
    const nota = window.prompt(
      "Nota de rejeição (opcional) — vai ficar gravada em `revisor_notas`:",
      "",
    );
    if (nota === null) return; // cancelou
    setBusy("rejeitar");
    setError(null);
    try {
      const res = await fetch(`/api/admin/analises/${id}/rejeitar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nota: nota.trim() || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "erro");
      setBusy(null);
    }
  }

  return (
    <div className="anr-actions-row" data-slug={slug}>
      <button
        type="button"
        className="anr-btn anr-btn-primary"
        onClick={aprovar}
        disabled={busy !== null}
      >
        {busy === "aprovar" ? "Aprovando..." : "Aprovar"}
      </button>
      <button
        type="button"
        className="anr-btn anr-btn-danger"
        onClick={rejeitar}
        disabled={busy !== null}
      >
        {busy === "rejeitar" ? "Rejeitando..." : "Rejeitar"}
      </button>
      {error && <span className="anr-error">{error}</span>}
    </div>
  );
}
