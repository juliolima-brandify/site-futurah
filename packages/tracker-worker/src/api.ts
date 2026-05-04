// API de leitura. Roda SQL no Analytics Engine via API HTTP da Cloudflare.
// Auth simples por bearer token.

import type { Env } from "./types";

const AE_SQL_URL = (accountId: string) =>
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`;

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function badRequest(msg: string): Response {
  return new Response(JSON.stringify({ error: msg }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

function checkAuth(request: Request, env: Env): boolean {
  const auth = request.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return false;
  const token = auth.slice("Bearer ".length).trim();
  // TODO(auth): trocar por comparação constant-time se o token virar dado sensível;
  // pra MVP a request já vem por TLS e o token é só pra rate-gate o dashboard.
  return token.length > 0 && token === env.API_READ_TOKEN;
}

// jsonResponse: wrapper padrão. Cache 60s default; opt-in `no-store`.
function jsonResponse(
  body: unknown,
  opts: { status?: number; cache?: number | "no-store" } = {},
): Response {
  const status = opts.status ?? 200;
  const cacheCtl =
    opts.cache === "no-store"
      ? "no-store"
      : `public, max-age=${typeof opts.cache === "number" ? opts.cache : 60}`;
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": cacheCtl,
    },
  });
}

// parseTimeWindow: lê since=Nh|Nd OU from=ISO&to=ISO da URL.
// Retorna fragmento SQL pra cláusula WHERE e a unidade de bucket recomendada.
export type TimeWindow = {
  // Cláusula SQL completa para filtro temporal, ex.:
  //   "timestamp > NOW() - INTERVAL '24' HOUR"
  //   "timestamp BETWEEN toDateTime('2026-05-01 00:00:00') AND toDateTime('2026-05-04 00:00:00')"
  whereSql: string;
  bucketUnit: "HOUR" | "DAY";
  // Para filtro de janela anterior (delta vs janela). Mesmo período, recuado.
  prevWhereSql: string;
  // Duração em horas (aproximada) — usada para detectar bucket e prev window.
  approxHours: number;
};

function isoToDateTime(s: string): string | null {
  // Aceita "YYYY-MM-DDTHH:MM" ou "YYYY-MM-DDTHH:MM:SS" ou com Z.
  // Normaliza pra "YYYY-MM-DD HH:MM:SS" (formato AE/ClickHouse toDateTime).
  const m = s.match(
    /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+\-]\d{2}:?\d{2})?$/,
  );
  if (!m) return null;
  const date = m[1];
  const time = m[2] + ":" + (m[3] || "00");
  return `${date} ${time}`;
}

export function parseTimeWindow(url: URL): TimeWindow {
  const fromRaw = url.searchParams.get("from");
  const toRaw = url.searchParams.get("to");

  if (fromRaw && toRaw) {
    const from = isoToDateTime(fromRaw);
    const to = isoToDateTime(toRaw);
    if (from && to) {
      const fromMs = Date.parse(fromRaw);
      const toMs = Date.parse(toRaw);
      if (!isNaN(fromMs) && !isNaN(toMs) && toMs > fromMs) {
        const deltaH = (toMs - fromMs) / 3_600_000;
        const safeDeltaH = Math.min(Math.max(deltaH, 0.1), 90 * 24);
        const unit: "HOUR" | "DAY" = safeDeltaH <= 7 * 24 ? "HOUR" : "DAY";
        // janela anterior de mesmo tamanho
        const prevToMs = fromMs;
        const prevFromMs = fromMs - (toMs - fromMs);
        const prevFrom = new Date(prevFromMs)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        const prevTo = new Date(prevToMs)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        return {
          whereSql: `timestamp BETWEEN toDateTime('${from}') AND toDateTime('${to}')`,
          prevWhereSql: `timestamp BETWEEN toDateTime('${prevFrom}') AND toDateTime('${prevTo}')`,
          bucketUnit: unit,
          approxHours: safeDeltaH,
        };
      }
    }
  }

  const raw = (url.searchParams.get("since") || "24h").toLowerCase().trim();
  const m = raw.match(/^(\d+)([hd])$/);
  let n = 24;
  let unit: "HOUR" | "DAY" = "HOUR";
  if (m) {
    n = parseInt(m[1], 10);
    unit = m[2] === "h" ? "HOUR" : "DAY";
  }
  const safe = Math.min(Math.max(n, 1), unit === "HOUR" ? 720 : 90);
  const approxHours = unit === "HOUR" ? safe : safe * 24;
  const bucketUnit: "HOUR" | "DAY" = approxHours <= 7 * 24 ? "HOUR" : "DAY";
  // janela anterior: 2× pra trás, recortando o atual.
  // Ex: since=24h → prev é "entre -48h e -24h".
  const prevWhereSql = `timestamp <= NOW() - INTERVAL '${safe}' ${unit} AND timestamp > NOW() - INTERVAL '${safe * 2}' ${unit}`;
  return {
    whereSql: `timestamp > NOW() - INTERVAL '${safe}' ${unit}`,
    prevWhereSql,
    bucketUnit,
    approxHours,
  };
}

async function runSql(env: Env, sql: string): Promise<unknown> {
  if (!env.CF_ACCOUNT_ID || env.CF_ACCOUNT_ID.startsWith("REPLACE_")) {
    throw new Error("CF_ACCOUNT_ID não configurado");
  }
  const res = await fetch(AE_SQL_URL(env.CF_ACCOUNT_ID), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.CF_API_TOKEN_AE}`,
      "Content-Type": "text/plain",
    },
    body: sql,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AE SQL ${res.status}: ${text}`);
  }
  return res.json();
}

function escapeSqlString(s: string): string {
  return s.replace(/'/g, "''");
}

export async function handleUtmSummary(request: Request, env: Env): Promise<Response> {
  if (!checkAuth(request, env)) return unauthorized();
  const url = new URL(request.url);
  const siteId = url.searchParams.get("site_id");
  if (!siteId || siteId.length > 64) return badRequest("missing_site_id");

  const win = parseTimeWindow(url);
  // blobs: [event, path, utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, country, device, browser]
  // index1 = site_id
  const dataset = env.AE_DATASET || "tracker_events";
  const sql = `
    SELECT
      blob3 AS utm_source,
      blob4 AS utm_medium,
      SUM(_sample_interval) AS count
    FROM ${dataset}
    WHERE index1 = '${escapeSqlString(siteId)}'
      AND blob1 = 'pageview'
      AND ${win.whereSql}
    GROUP BY blob3, blob4
    ORDER BY count DESC
    LIMIT 200
  `;

  try {
    const data = (await runSql(env, sql)) as { data?: Array<Record<string, unknown>> };
    const rows = (data.data || []).map((r) => ({
      utm_source: (r.utm_source as string) || "(direct)",
      utm_medium: (r.utm_medium as string) || "(none)",
      count: Number(r.count) || 0,
    }));
    return jsonResponse({ rows });
  } catch (err) {
    // Não retornar `String(err)` no body: a mensagem da fetch da CF AE pode
    // conter o bearer (ex.: "AE SQL 401: Bearer token invalid: cfat_...").
    console.error("[api] utm-summary failed", err);
    return jsonResponse({ error: "query_failed" }, { status: 500, cache: "no-store" });
  }
}

export async function handlePageviews(request: Request, env: Env): Promise<Response> {
  if (!checkAuth(request, env)) return unauthorized();
  const url = new URL(request.url);
  const siteId = url.searchParams.get("site_id");
  if (!siteId || siteId.length > 64) return badRequest("missing_site_id");
  const win = parseTimeWindow(url);
  const dataset = env.AE_DATASET || "tracker_events";

  const sql = `
    SELECT
      blob2 AS path,
      SUM(_sample_interval) AS count
    FROM ${dataset}
    WHERE index1 = '${escapeSqlString(siteId)}'
      AND blob1 = 'pageview'
      AND ${win.whereSql}
    GROUP BY blob2
    ORDER BY count DESC
    LIMIT 200
  `;

  try {
    const data = (await runSql(env, sql)) as { data?: Array<Record<string, unknown>> };
    const rows = (data.data || []).map((r) => ({
      path: (r.path as string) || "/",
      count: Number(r.count) || 0,
    }));
    return jsonResponse({ rows });
  } catch (err) {
    console.error("[api] pageviews failed", err);
    return jsonResponse({ error: "query_failed" }, { status: 500, cache: "no-store" });
  }
}
