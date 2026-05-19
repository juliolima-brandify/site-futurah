// Meta Conversions API — forward server-side (V1 enxuto, sem Queues).
//
// Chamado de dentro de ctx.waitUntil no /e: roda DEPOIS da Response 204,
// não bloqueia ingestão. Sem Queue = sem retry/batch (aceitável no volume
// atual; migrar pra Queue é Fase 4 completa no TRACKING_PLAN.md).
//
// PRIVACIDADE: a PII (email/phone) chega crua em event.identity, é hasheada
// SHA-256 aqui e enviada só pro Graph API. NUNCA é escrita no Analytics
// Engine (ingest.ts não referencia identity) nem logada.

import { getClientIp } from "./enrichment";
import type { Env, TrackEvent } from "./types";

// Só estes eventos são reenviados pro CAPI. Qualquer outro (pageview,
// link_click, etc.) segue só pro AE — comportamento inalterado.
const FORWARD_EVENTS = new Set([
  "Lead",
  "Purchase",
  "InitiateCheckout",
  "CompleteRegistration",
  "ViewContent",
  "Subscribe",
]);

const DEFAULT_API_VERSION = "v21.0";

type MetaSiteConfig = {
  pixel_id: string;
  api_version?: string;
  test_event_code?: string;
};

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Meta exige email lowercase + trim, hasheado.
async function hashEmail(email: string): Promise<string | null> {
  const norm = email.trim().toLowerCase();
  if (!norm || !norm.includes("@")) return null;
  return sha256Hex(norm);
}

// Meta exige telefone só dígitos, com código de país, sem '+'/zeros à
// esquerda. WhatsApp BR chega com 10–11 dígitos sem DDI → prefixa 55.
async function hashPhone(phone: string): Promise<string | null> {
  let d = (phone || "").replace(/\D+/g, "");
  if (!d) return null;
  if ((d.length === 10 || d.length === 11) && !d.startsWith("55")) d = `55${d}`;
  if (d.length < 10) return null;
  return sha256Hex(d);
}

function readSiteConfig(raw: string | null, siteId: string): MetaSiteConfig | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, MetaSiteConfig>;
    const cfg = parsed[siteId];
    if (cfg && typeof cfg.pixel_id === "string" && cfg.pixel_id.length > 0) return cfg;
    return null;
  } catch {
    return null;
  }
}

function readToken(env: Env, siteId: string): string | null {
  if (!env.META_CAPI_TOKENS) return null;
  try {
    const map = JSON.parse(env.META_CAPI_TOKENS) as Record<string, string>;
    const t = map[siteId];
    return typeof t === "string" && t.length > 0 ? t : null;
  } catch {
    return null;
  }
}

/**
 * Reenvia a conversão pro Meta CAPI se (a) for evento da allowlist, (b) o
 * site tiver pixel configurado em KV `config:meta` e (c) houver token em
 * META_CAPI_TOKENS. Qualquer condição falha = no-op silencioso (o tracking
 * normal não pode quebrar por causa do CAPI).
 */
export async function maybeForwardToMeta(
  event: TrackEvent,
  request: Request,
  env: Env,
): Promise<void> {
  if (!FORWARD_EVENTS.has(event.event)) return;

  const token = readToken(env, event.site_id);
  if (!token) return;

  let cfgRaw: string | null;
  try {
    cfgRaw = await env.KV.get("config:meta");
  } catch {
    return;
  }
  const cfg = readSiteConfig(cfgRaw, event.site_id);
  if (!cfg) return;

  const id = event.identity ?? {};
  const userData: Record<string, unknown> = {};

  const em = id.email ? await hashEmail(id.email) : null;
  if (em) userData.em = [em];
  const ph = id.phone ? await hashPhone(id.phone) : null;
  if (ph) userData.ph = [ph];
  if (id.fbp) userData.fbp = id.fbp;
  if (id.fbc) userData.fbc = id.fbc;
  if (event.anon_id) userData.external_id = [await sha256Hex(event.anon_id)];

  const ip = getClientIp(request);
  if (ip) userData.client_ip_address = ip;
  const ua = request.headers.get("User-Agent");
  if (ua) userData.client_user_agent = ua;

  const customData: Record<string, unknown> = {};
  const pVal = event.props && (event.props as Record<string, unknown>).value;
  const pCur = event.props && (event.props as Record<string, unknown>).currency;
  if (typeof pVal === "number") customData.value = pVal;
  if (typeof pCur === "string") customData.currency = pCur;

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: event.event,
        event_time: Math.floor((event.ts || Date.now()) / 1000),
        event_id: event.event_id || undefined,
        action_source: "website",
        event_source_url: event.url || undefined,
        user_data: userData,
        custom_data: Object.keys(customData).length > 0 ? customData : undefined,
      },
    ],
  };
  if (cfg.test_event_code) body.test_event_code = cfg.test_event_code;

  const apiVersion = cfg.api_version || DEFAULT_API_VERSION;
  const endpoint = `https://graph.facebook.com/${apiVersion}/${cfg.pixel_id}/events?access_token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      // Loga status + corpo (sem PII — o body que enviamos é hasheado, mas
      // não ecoamos ele; só a resposta de erro da Meta).
      const txt = await res.text().catch(() => "");
      console.error(`[capi] ${event.site_id} ${event.event} HTTP ${res.status} ${txt.slice(0, 300)}`);
    }
  } catch (err) {
    console.error("[capi] fetch failed", err);
  }
}
