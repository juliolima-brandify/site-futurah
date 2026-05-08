"use client";

import { useEffect } from "react";

interface Props {
  slug: string;
  variante: string;
  modelo: string;
}

declare global {
  interface Window {
    __FUTURAH_ANALISE_SLUG__?: string;
  }
}

/**
 * Tracker da página de análise. Dispara três eventos via `@futurah/tracker-sdk`:
 *  - `analise_view` — no mount (props: slug, variante, modelo)
 *  - `analise_scroll_50` — quando o usuário cruza 50% da altura do main
 *  - `analise_scroll_90` — idem 90%
 *
 * Os scrolls são marcados via IntersectionObserver em sentinelas absolutos
 * (montados aqui mesmo). Não detectamos altura no JS — deixamos o browser
 * fazer o trabalho e disparamos quando os elementos entram na viewport.
 *
 * `window.__FUTURAH_ANALISE_SLUG__` fica setado pra que `AnaliseCTA` possa
 * propagar o slug nos seus eventos sem prop drilling.
 *
 * Reusa o `siteId='futurah'` do tracker já configurado pra este site —
 * o `<TrackerBoundary />` global cuida do init/pageview.
 */
export function AnaliseTracker({ slug, variante, modelo }: Props) {
  useEffect(() => {
    // Slug global pra os CTAs lerem
    window.__FUTURAH_ANALISE_SLUG__ = slug;

    // analise_view + observers
    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    const fired = new Set<string>();

    import("@futurah/tracker-sdk")
      .then((m) => {
        if (cancelled) return;
        m.track("analise_view", { slug, variante, modelo });

        // Observa as sentinelas (id="anr-sentinel-50/90")
        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              const id = entry.target.id;
              if (id === "anr-sentinel-50" && !fired.has("50")) {
                fired.add("50");
                m.track("analise_scroll_50", { slug });
              } else if (id === "anr-sentinel-90" && !fired.has("90")) {
                fired.add("90");
                m.track("analise_scroll_90", { slug });
              }
            }
          },
          { threshold: 0 },
        );
        const s50 = document.getElementById("anr-sentinel-50");
        const s90 = document.getElementById("anr-sentinel-90");
        if (s50) observer.observe(s50);
        if (s90) observer.observe(s90);
      })
      .catch(() => {
        // Silencioso: tracker quebra → página continua funcionando.
      });

    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
      delete window.__FUTURAH_ANALISE_SLUG__;
    };
  }, [slug, variante, modelo]);

  return (
    <>
      {/* Sentinelas posicionadas em 50% e 90% da página inteira via CSS.
          Não interferem com o layout (height 1px, pointer-events none). */}
      <div
        id="anr-sentinel-50"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: 1,
          pointerEvents: "none",
        }}
      />
      <div
        id="anr-sentinel-90"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "90%",
          left: 0,
          width: "100%",
          height: 1,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
