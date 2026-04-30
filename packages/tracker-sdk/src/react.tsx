"use client";

import { useEffect, useRef } from "react";
import { init, isInitialized, pageview } from "./index";

export type TrackerProps = {
  siteId: string;
  endpoint: string;
  debug?: boolean;
  /**
   * Pathname atual fornecido pelo caller (geralmente Next.js usePathname()).
   * Se não passar, o componente só dispara pageview no mount.
   */
  pathname?: string | null;
};

/**
 * Componente de bootstrap do tracker. Montar dentro de <Suspense> no layout
 * do app — o useSearchParams interno do Next.js (caso o caller queira UTMs
 * em SPA navigations) exige Suspense boundary.
 */
export function Tracker({ siteId, endpoint, debug, pathname }: TrackerProps): null {
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!isInitialized()) {
      init({ siteId, endpoint, debug });
    }
    // pageview inicial
    if (lastPath.current === null) {
      lastPath.current = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
      pageview();
      return;
    }
    // pageview em SPA navigations
    const next = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
    if (next !== lastPath.current) {
      lastPath.current = next;
      pageview();
    }
  }, [siteId, endpoint, debug, pathname]);

  return null;
}

/**
 * Hook utilitário para uso fora do componente (caso o app já tenha um
 * provider próprio).
 */
export function useTrackPageview(pathname: string | null | undefined): void {
  const last = useRef<string | null>(null);
  useEffect(() => {
    if (!isInitialized()) return;
    const next = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
    if (next !== last.current) {
      last.current = next;
      pageview();
    }
  }, [pathname]);
}
