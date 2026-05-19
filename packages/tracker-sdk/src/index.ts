// Entrypoint do SDK. Singleton inicializado via init().

import { sendBeacon } from "./beacon";
import {
  getOrCreateAnonId,
  persistAttribution,
  readFirstTouch,
  readLastTouch,
} from "./cookies";
import { captureContext } from "./context";
import { ensureFbc, fbqTrack, readFbCookies } from "./fb";
import { parseAttribution, hasAnyAttribution, type AttributionPayload } from "./utm";

function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export type TrackerConfig = {
  siteId: string;
  endpoint: string;
  debug?: boolean;
};

export type TrackEventPayload = {
  v: 1;
  site_id: string;
  event: string;
  ts: number;
  anon_id: string;
  url: string;
  path: string;
  title: string;
  referrer: string;
  language: string;
  timezone: string;
  screen_w: number;
  screen_h: number;
  viewport_w: number;
  viewport_h: number;
  attribution: {
    current: AttributionPayload;
    first: AttributionPayload | null;
    last: AttributionPayload | null;
  };
  props?: Record<string, unknown>;
  // Conversões: id único compartilhado com o pixel client (dedup pixel×CAPI
  // na janela de 48h da Meta). Ausente em pageview/eventos normais.
  event_id?: string;
  // Dados de match do CAPI. Email/telefone vão CRUS por HTTPS — o Worker
  // hasheia (SHA-256) e NÃO persiste no Analytics Engine. fbp/fbc são
  // preenchidos automaticamente a partir dos cookies.
  identity?: {
    email?: string;
    phone?: string;
    fbp?: string;
    fbc?: string;
  };
};

export type ConversionOpts = {
  /** Valor monetário da conversão (ex: 47). */
  value?: number;
  /** Moeda ISO-4217. Default "BRL". */
  currency?: string;
  /** Email do lead (cru — hasheado server-side). */
  email?: string;
  /** Telefone do lead, só dígitos (cru — hasheado server-side). */
  phone?: string;
  /** Props extras para o Analytics Engine (não vão pro CAPI). */
  props?: Record<string, unknown>;
};

let config: TrackerConfig | null = null;
let bootstrapped = false;

function log(...args: unknown[]): void {
  if (config?.debug) {
    // eslint-disable-next-line no-console
    console.log("[tracker]", ...args);
  }
}

// TODO(consent): hoje assume consent. Adicionar gate de consent banner antes de qualquer cookie/beacon.
export function init(opts: TrackerConfig): void {
  if (typeof window === "undefined") return;
  config = opts;
  if (bootstrapped) return;
  bootstrapped = true;
  // Garante que o anon id existe.
  getOrCreateAnonId();
  // Constrói/persiste o cookie _fbc a partir do fbclid da URL (antes de
  // qualquer track, pra primeira conversão já sair com fbc).
  ensureFbc();
  // Captura UTMs da URL atual e persiste em cookies (first/last).
  const current = parseAttribution(window.location.search);
  if (hasAnyAttribution(current)) {
    persistAttribution(current);
  }
  log("init", opts.siteId);
}

export function isInitialized(): boolean {
  return config !== null;
}

export function track(eventName: string, props?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!config) {
    if (typeof console !== "undefined") {
      console.warn("[tracker] track() chamado antes de init()");
    }
    return;
  }
  const ctx = captureContext();
  const current = parseAttribution(window.location.search);
  const first = readFirstTouch();
  const last = readLastTouch();
  const payload: TrackEventPayload = {
    v: 1,
    site_id: config.siteId,
    event: eventName,
    ts: Date.now(),
    anon_id: getOrCreateAnonId(),
    url: ctx.url,
    path: ctx.path,
    title: ctx.title,
    referrer: ctx.referrer,
    language: ctx.language,
    timezone: ctx.timezone,
    screen_w: ctx.screen_w,
    screen_h: ctx.screen_h,
    viewport_w: ctx.viewport_w,
    viewport_h: ctx.viewport_h,
    attribution: {
      current: hasAnyAttribution(current) ? current : {},
      first,
      last,
    },
    props,
  };
  log("track", eventName, payload);
  sendBeacon(config.endpoint, payload);
}

// TODO(fase 2): implementar identify() ligando anon_id a user_id em D1.
export function identify(_userId: string, _traits?: Record<string, unknown>): void {
  if (config?.debug) log("identify (noop, fase 2)", _userId, _traits);
}

export function pageview(extraProps?: Record<string, unknown>): void {
  track("pageview", extraProps);
}

/**
 * Conversão deduplicada pixel×CAPI. Gera UM `event_id`, dispara o pixel
 * client com esse `eventID` E manda o beacon pro Worker com o mesmo
 * `event_id` + identity. O Worker reenvia via CAPI server-side; a Meta
 * deduplica os dois pelo par (event_name, event_id) na janela de 48h.
 *
 * `eventName` deve ser um evento PADRÃO da Meta ("Lead", "Purchase",
 * "InitiateCheckout", "CompleteRegistration", "ViewContent"...). Retorna o
 * `event_id` gerado (útil pra logs/teste).
 */
export function trackConversion(eventName: string, opts: ConversionOpts = {}): string {
  const eventId = uuid();
  if (typeof window === "undefined" || !config) return eventId;

  const { value, currency = "BRL", email, phone, props } = opts;

  // Pixel client (no-op se bloqueado — o CAPI cobre).
  const pixelParams: Record<string, unknown> = {};
  if (typeof value === "number") {
    pixelParams.value = value;
    pixelParams.currency = currency;
  }
  fbqTrack(eventName, pixelParams, eventId);

  const ctx = captureContext();
  const current = parseAttribution(window.location.search);
  const { fbp, fbc } = readFbCookies();
  const payload: TrackEventPayload = {
    v: 1,
    site_id: config.siteId,
    event: eventName,
    ts: Date.now(),
    anon_id: getOrCreateAnonId(),
    url: ctx.url,
    path: ctx.path,
    title: ctx.title,
    referrer: ctx.referrer,
    language: ctx.language,
    timezone: ctx.timezone,
    screen_w: ctx.screen_w,
    screen_h: ctx.screen_h,
    viewport_w: ctx.viewport_w,
    viewport_h: ctx.viewport_h,
    attribution: {
      current: hasAnyAttribution(current) ? current : {},
      first: readFirstTouch(),
      last: readLastTouch(),
    },
    props:
      typeof value === "number" ? { value, currency, ...(props ?? {}) } : props,
    event_id: eventId,
    identity: {
      email: email || undefined,
      phone: phone || undefined,
      fbp: fbp || undefined,
      fbc: fbc || undefined,
    },
  };
  log("conversion", eventName, eventId, payload);
  sendBeacon(config.endpoint, payload);
  return eventId;
}

/**
 * Opções de `trackClick`. Os campos `url`, `label`, `target`, `position` e
 * `value` são **promoted keys** no Worker — viram colunas dedicadas no
 * Analytics Engine (blob13/blob14/blob15 e double3/double4) e ficam
 * disponíveis em `/api/events?dim=url|label|target` no dashboard.
 *
 * Qualquer chave fora dessas 5 vai para `props.rest_json` (blob16) com cap
 * de ~1.5KB no JSON serializado — use só metadata leve.
 */
export type TrackClickOpts = {
  /** URL de destino do clique. Sem espaços (validação no Worker). */
  url: string;
  /** Texto humano do botão/link. Truncado em 128 chars. */
  label?: string;
  /** Slug interno (segmenta múltiplos botões pra mesma url). 128 chars. */
  target?: string;
  /** Índice (0-based) na lista de links — útil pra heatmap de posição. */
  position?: number;
  /** Valor monetário/numérico associado ao clique. */
  value?: number;
  /** Nome do evento. Default `link_click`. */
  event?: string;
  /** Metadata extra — vai pra blob16 como JSON; manter leve. */
  extra?: Record<string, unknown>;
};

/**
 * Helper acima de `track()` para registrar cliques em links/botões com
 * shape padronizado. Equivalente a:
 *
 *   track('link_click', { url, label, target, position, value, ...extra })
 *
 * As 5 promoted keys (`url`, `label`, `target`, `position`, `value`) viram
 * colunas dedicadas no AE e podem ser quebradas no dashboard.
 */
export function trackClick(opts: TrackClickOpts): void {
  const { url, label, target, position, value, event = "link_click", extra } = opts;
  const props: Record<string, unknown> = { url };
  if (label) props.label = label;
  if (target) props.target = target;
  if (typeof position === "number") props.position = position;
  if (typeof value === "number") props.value = value;
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      // Não permitir extra sobrescrever as promoted keys já setadas acima.
      if (k in props) continue;
      props[k] = v;
    }
  }
  track(event, props);
}

export { loadMetaPixel } from "./fb";
export type { AttributionPayload } from "./utm";
