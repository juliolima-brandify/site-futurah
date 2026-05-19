// Integração Meta (Facebook) Pixel — camada fina no browser.
//
// Estratégia 2026: o pixel client é redundante e minimalista. A fonte da
// verdade das conversões é o CAPI server-side (disparado pelo Worker). O
// pixel aqui serve só para (a) PageView, (b) gerar/continuar `_fbp`, e
// (c) permitir dedup pixel×CAPI via `eventID` compartilhado.
//
// `_fbc` é construído e persistido por nós a partir do `fbclid` da URL
// (cookie 1st-party 90d) — sobrevive melhor ao ITP do que o cookie que o
// fbevents.js setaria via JS, e fica disponível mesmo se o pixel for
// bloqueado por ad-blocker (o CAPI ainda recebe o `fbc`).

import { readRawCookie, writeRawCookie } from "./cookies";

const COOKIE_FBP = "_fbp";
const COOKIE_FBC = "_fbc";
const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
  }
}

function getQueryParam(name: string): string {
  if (typeof window === "undefined") return "";
  try {
    return new URLSearchParams(window.location.search).get(name) || "";
  } catch {
    return "";
  }
}

/**
 * Garante o cookie `_fbc` a partir do `fbclid` da URL. Formato exigido pela
 * Meta: `fb.1.<timestamp_ms>.<fbclid>`. Idempotente — só (re)escreve quando
 * chega um `fbclid` novo. Chamar no init() antes de qualquer track.
 */
export function ensureFbc(): void {
  if (typeof window === "undefined") return;
  const fbclid = getQueryParam("fbclid");
  if (!fbclid) return;
  const existing = readRawCookie(COOKIE_FBC);
  // Se o cookie atual já termina com este fbclid, não reescreve.
  if (existing && existing.endsWith(`.${fbclid}`)) return;
  const value = `fb.1.${Date.now()}.${fbclid}`;
  writeRawCookie(COOKIE_FBC, value, NINETY_DAYS);
}

/** Lê `_fbp` (setado pelo fbevents.js) e `_fbc` (setado por nós). */
export function readFbCookies(): { fbp: string; fbc: string } {
  return {
    fbp: readRawCookie(COOKIE_FBP) || "",
    fbc: readRawCookie(COOKIE_FBC) || "",
  };
}

let pixelLoaded = false;

/**
 * Injeta o fbevents.js e inicializa o pixel. `scriptUrl` é configurável para,
 * no futuro, apontar para um proxy 1st-party servido pelo Worker (anti
 * ad-blocker). Default = CDN padrão da Meta.
 *
 * Só dispara PageView automático. Conversões são responsabilidade do
 * `trackConversion()` no index.ts (que cuida do `eventID` p/ dedup).
 */
export function loadMetaPixel(
  pixelId: string,
  opts?: { scriptUrl?: string; autoPageview?: boolean },
): void {
  if (typeof window === "undefined" || !pixelId || pixelLoaded) return;
  pixelLoaded = true;
  const scriptUrl = opts?.scriptUrl || "https://connect.facebook.net/en_US/fbevents.js";

  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", scriptUrl);
  /* eslint-enable */

  window.fbq?.("init", pixelId);
  if (opts?.autoPageview !== false) {
    window.fbq?.("track", "PageView");
  }
}

/**
 * Dispara um evento padrão no pixel client com `eventID` explícito para
 * deduplicar contra o mesmo evento enviado via CAPI pelo Worker. No-op se o
 * pixel não carregou (ad-blocker) — o CAPI server-side cobre esse caso.
 */
export function fbqTrack(
  eventName: string,
  params: Record<string, unknown>,
  eventId: string,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", eventName, params, { eventID: eventId });
}
