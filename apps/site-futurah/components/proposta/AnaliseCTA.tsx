"use client";

import { useCallback } from "react";

/**
 * CTA wrapper instrumentado: dispara `analise_cta_click` via tracker SDK
 * em pointerdown/auxclick (cobre clique normal, do meio e long-press) antes
 * de a navegação descartar a janela.
 *
 * Visual fica 100% por classes/style passados pelo caller.
 */

type Props = {
  href: string;
  /** Onde o CTA está renderizado (pra segmentar no dashboard de tracking). */
  location: "economia" | "encerramento";
  external?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

declare global {
  interface Window {
    __FUTURAH_ANALISE_SLUG__?: string;
  }
}

export function AnaliseCTA({
  href,
  location,
  external,
  className,
  style,
  children,
}: Props) {
  const handleActivate = useCallback(() => {
    // Lazy import — só carrega o SDK quando o usuário interage. Mantém o
    // bundle inicial enxuto.
    import("@futurah/tracker-sdk")
      .then((m) => {
        const slug =
          typeof window !== "undefined"
            ? window.__FUTURAH_ANALISE_SLUG__
            : undefined;
        // Só dispara `analise_cta_click` quando estamos numa página de análise
        // gerada (`/analise/[slug]` setou a flag). Em propostas estáticas
        // (Haytarzan, Augusto, Carlos) cai em `link_click` pra não poluir
        // a métrica do funil de análises.
        if (slug) {
          m.trackClick({
            url: href,
            label: "agendar_sessao_estrategica",
            target: location,
            event: "analise_cta_click",
            extra: { slug, location },
          });
        } else {
          m.trackClick({
            url: href,
            label: "agendar_sessao_estrategica",
            target: location,
            event: "link_click",
            extra: { location },
          });
        }
      })
      .catch(() => {
        // Silencioso: se o SDK quebra, o link continua funcionando.
      });
  }, [href, location]);

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
      style={style}
      onPointerDown={handleActivate}
      onAuxClick={handleActivate}
    >
      {children}
    </a>
  );
}
