// Tipagens compartilhadas do Worker.

export interface Env {
  ANALYTICS: AnalyticsEngineDataset;
  KV: KVNamespace;
  DB: D1Database;
  CF_ACCOUNT_ID: string;
  AE_DATASET: string;
  // Secrets:
  API_READ_TOKEN: string;
  CF_API_TOKEN_AE: string;
}

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;
};

export type TrackEvent = {
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
    current: Attribution;
    first: Attribution | null;
    last: Attribution | null;
  };
  props?: Record<string, unknown>;
};

export type EnrichedEvent = TrackEvent & {
  ip_hash: string;
  country: string;
  colo: string;
  device_type: string;
  browser: string;
};
