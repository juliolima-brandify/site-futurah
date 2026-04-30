// POST /e — ingestão de eventos.
// Valida origem, valida site_id, enriquece, escreve no Analytics Engine.
// Resposta 204 imediata; persistência fica em ctx.waitUntil — sem essa garantia
// a CF pode cortar a escrita após a response (mesma classe de bug do
// gerarAnaliseEmBackground na Vercel).

import { getCfMeta, getClientIp, parseUserAgent } from "./enrichment";
import { hashIp } from "./salt";
import type { Env, TrackEvent, EnrichedEvent } from "./types";

const MAX_BODY_BYTES = 16 * 1024;
const ALLOWED_SITES_KEY = "config:sites";
const ALLOWED_ORIGINS_KEY = "config:allowed_origins";

async function readAllowlist(env: Env, key: string): Promise<string[]> {
  const raw = await env.KV.get(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s) => typeof s === "string");
  } catch {
    return [];
  }
}

function isValidEvent(body: unknown): body is TrackEvent {
  if (!body || typeof body !== "object") return false;
  const e = body as Record<string, unknown>;
  if (e.v !== 1) return false;
  if (typeof e.site_id !== "string" || e.site_id.length === 0 || e.site_id.length > 64) return false;
  if (typeof e.event !== "string" || e.event.length === 0 || e.event.length > 64) return false;
  if (typeof e.anon_id !== "string" || e.anon_id.length < 8) return false;
  if (typeof e.path !== "string") return false;
  return true;
}

function sanitizeBlob(value: unknown, max = 200): string {
  if (typeof value !== "string") return "";
  return value.slice(0, max);
}

function corsHeaders(origin: string, allowed: boolean): HeadersInit {
  if (!allowed) {
    return { "Content-Type": "application/json" };
  }
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export async function handleIngestOptions(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get("Origin") || "";
  const allowed = await readAllowlist(env, ALLOWED_ORIGINS_KEY);
  const ok = origin.length > 0 && allowed.includes(origin);
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin, ok),
  });
}

export async function handleIngest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = await readAllowlist(env, ALLOWED_ORIGINS_KEY);
  const originOk = origin.length > 0 && allowedOrigins.includes(origin);

  if (!originOk) {
    return new Response(JSON.stringify({ error: "origin_not_allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cl = request.headers.get("Content-Length");
  if (cl && parseInt(cl, 10) > MAX_BODY_BYTES) {
    return new Response(null, { status: 413, headers: corsHeaders(origin, true) });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return new Response(JSON.stringify({ error: "body_read_failed" }), {
      status: 400,
      headers: { ...corsHeaders(origin, true), "Content-Type": "application/json" },
    });
  }

  if (raw.length > MAX_BODY_BYTES) {
    return new Response(null, { status: 413, headers: corsHeaders(origin, true) });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders(origin, true), "Content-Type": "application/json" },
    });
  }

  if (!isValidEvent(parsed)) {
    return new Response(JSON.stringify({ error: "invalid_event" }), {
      status: 400,
      headers: { ...corsHeaders(origin, true), "Content-Type": "application/json" },
    });
  }

  const event = parsed;
  const allowedSites = await readAllowlist(env, ALLOWED_SITES_KEY);
  if (!allowedSites.includes(event.site_id)) {
    return new Response(JSON.stringify({ error: "site_not_allowed" }), {
      status: 403,
      headers: { ...corsHeaders(origin, true), "Content-Type": "application/json" },
    });
  }

  // ctx.waitUntil é obrigatório: garante que a escrita no AE termine
  // mesmo após a Response 204 já ter saído. Sem isso, em alta latência
  // a runtime pode cancelar o write.
  ctx.waitUntil(persistEvent(event, request, env));

  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin, true),
  });
}

async function persistEvent(event: TrackEvent, request: Request, env: Env): Promise<void> {
  // Dedup 5 min por (site, anon_id, event, path): mesma combinação em janela
  // de 300s vira no-op. Protege quota do AE contra flood (ataque ou bug de
  // SDK que dispara o mesmo pageview em loop). Não bloqueia browsing legítimo
  // porque event/path mudam.
  const evtPart = (event.event || "").slice(0, 32);
  const pathPart = (event.path || "").slice(0, 64);
  const windowKey = Math.floor(Date.now() / 300_000);
  const dedupKey = `dedup:${event.site_id}:${event.anon_id}:${evtPart}:${pathPart}:${windowKey}`;
  try {
    if (await env.KV.get(dedupKey)) return;
    await env.KV.put(dedupKey, "1", { expirationTtl: 300 });
  } catch (err) {
    // KV indisponível: segue sem dedup. Perder a guarda é melhor do que
    // perder o evento.
    console.error("[ingest] dedup KV failed", err);
  }

  const ip = getClientIp(request);
  const ua = request.headers.get("User-Agent") || "";
  const { country, colo } = getCfMeta(request);
  const { device_type, browser } = parseUserAgent(ua);
  const ip_hash = await hashIp(ip, env);

  const enriched: EnrichedEvent = {
    ...event,
    ip_hash,
    country,
    colo,
    device_type,
    browser,
  };

  // Attribution preference: current > last > first.
  const attribution =
    pickAttr(event.attribution?.current) ??
    pickAttr(event.attribution?.last) ??
    pickAttr(event.attribution?.first) ??
    {};

  try {
    env.ANALYTICS.writeDataPoint({
      indexes: [enriched.site_id],
      blobs: [
        sanitizeBlob(enriched.event, 64),
        sanitizeBlob(enriched.path, 256),
        sanitizeBlob(attribution.utm_source),
        sanitizeBlob(attribution.utm_medium),
        sanitizeBlob(attribution.utm_campaign),
        sanitizeBlob(attribution.utm_term),
        sanitizeBlob(attribution.utm_content),
        sanitizeBlob(enriched.referrer, 256),
        sanitizeBlob(enriched.country, 8),
        sanitizeBlob(enriched.device_type, 16),
        sanitizeBlob(enriched.browser, 16),
      ],
      doubles: [enriched.viewport_w || 0, enriched.viewport_h || 0],
    });
  } catch (err) {
    console.error("[ingest] writeDataPoint failed", err);
  }
}

function pickAttr(a: TrackEvent["attribution"]["current"] | null | undefined) {
  if (!a) return null;
  const hasAny = Object.values(a).some((v) => typeof v === "string" && v.length > 0);
  return hasAny ? a : null;
}
