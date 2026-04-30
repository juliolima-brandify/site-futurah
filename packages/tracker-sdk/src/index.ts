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

export type { AttributionPayload } from "./utm";
