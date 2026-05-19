// Tipagens compartilhadas do Worker.

export interface Env {
  ANALYTICS: AnalyticsEngineDataset;
  KV: KVNamespace;
  CF_ACCOUNT_ID: string;
  AE_DATASET: string;
  // Secrets:
  API_READ_TOKEN: string;
  CF_API_TOKEN_AE: string;
  // JSON `{ "<site_id>": "<meta_capi_access_token>" }`. Opcional — sem ele
  // o forward pro CAPI vira no-op (tracking normal segue funcionando).
  META_CAPI_TOKENS?: string;
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
  // Conversões (ver tracker-sdk trackConversion). event_id deduplica
  // pixel×CAPI. identity carrega PII CRUA usada SÓ pra montar o payload
  // hasheado do CAPI — NUNCA escrita no Analytics Engine.
  event_id?: string;
  identity?: {
    email?: string;
    phone?: string;
    fbp?: string;
    fbc?: string;
  };
};

export type EnrichedEvent = TrackEvent & {
  ip_hash: string;
  country: string;
  colo: string;
  device_type: string;
  browser: string;
};

// Props promovidos a colunas dedicadas no AE.
// Usados pelo /api/events para breakdown por url/label/target.
// blob13..blob16 e double3..double4 do dataset.
export type PromotedProps = {
  url: string;        // blob13
  label: string;      // blob14
  target: string;     // blob15
  rest_json: string;  // blob16
  position: number;   // double3
  value: number;      // double4
};
