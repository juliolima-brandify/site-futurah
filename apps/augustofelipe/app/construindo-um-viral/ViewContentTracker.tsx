"use client";

import { useEffect } from "react";
import { trackConversion } from "@futurah/tracker-sdk";

// Dispara ViewContent (pixel×CAPI) ao abrir a página de venda direta — além do
// PageView automático do TrackerBoundary. Ajuda a otimizar campanhas de
// conversão e a montar público de "viu a oferta".
export function ViewContentTracker() {
  useEffect(() => {
    trackConversion("ViewContent", { value: 47, currency: "BRL" });
  }, []);
  return null;
}
