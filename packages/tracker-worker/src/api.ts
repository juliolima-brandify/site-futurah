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

function parseSince(raw: string | null): string {
  // Aceita "24h", "7d", "30d". Default 24h. Retorna intervalo SQL.
  const v = (raw || "24h").toLowerCase().trim();
  const m = v.match(/^(\d+)([hd])$/);
  if (!m) return "INTERVAL '24' HOUR";
  const n = parseInt(m[1], 10);
  const unit = m[2] === "h" ? "HOUR" : "DAY";
  // proteção contra valores absurdos
  const safe = Math.min(Math.max(n, 1), unit === "HOUR" ? 720 : 90);
  return `INTERVAL '${safe}' ${unit}`;
}

async function runSql(env: Env, sql: string): Promise<unknown> {
  if (!env.CF_ACCOUNT_ID || env.CF_ACCOUNT_ID.startsWith("REPLACE_")) {
    throw new Error("CF_ACCOUNT_ID não configurado");
  }
  const res = await fetch(AE_SQL_URL(env.CF_ACCOUNT_ID), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.CF_API_TOKEN_AE}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
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

  const since = parseSince(url.searchParams.get("since"));
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
      AND timestamp > NOW() - ${since}
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
    return new Response(JSON.stringify({ rows }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (err) {
    // Não retornar `String(err)` no body: a mensagem da fetch da CF AE pode
    // conter o bearer (ex.: "AE SQL 401: Bearer token invalid: cfat_...").
    console.error("[api] utm-summary failed", err);
    return new Response(JSON.stringify({ error: "query_failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function handlePageviews(request: Request, env: Env): Promise<Response> {
  if (!checkAuth(request, env)) return unauthorized();
  const url = new URL(request.url);
  const siteId = url.searchParams.get("site_id");
  if (!siteId || siteId.length > 64) return badRequest("missing_site_id");
  const since = parseSince(url.searchParams.get("since"));
  const dataset = env.AE_DATASET || "tracker_events";

  const sql = `
    SELECT
      blob2 AS path,
      SUM(_sample_interval) AS count
    FROM ${dataset}
    WHERE index1 = '${escapeSqlString(siteId)}'
      AND blob1 = 'pageview'
      AND timestamp > NOW() - ${since}
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
    return new Response(JSON.stringify({ rows }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[api] pageviews failed", err);
    return new Response(JSON.stringify({ error: "query_failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
