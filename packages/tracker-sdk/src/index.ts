// Entrypoint do SDK. Singleton inicializado via init().

import { sendBeacon } from "./beacon";
import {
  getOrCreateAnonId,
  persistAttribution,
  readFirstTouch,
  readLastTouch,
} from "./cookies";
import { captureContext } from "./context";
import { parseAttribution, hasAnyAttribution, type AttributionPayload } from "./utm";

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

export type { AttributionPayload } from "./utm";
