// Entrypoint do Worker. Roteia /e (ingest) e /api/* (read).
// Um único Worker atende t.futurah.com.br e t.fidevidraceiro.com.br;
// a separação por tenant é feita via site_id no payload + allowlists em KV.

import { handleIngest, handleIngestOptions } from "./ingest";
import { handleUtmSummary, handlePageviews } from "./api";
import { rotateSaltCron } from "./salt";
import type { Env } from "./types";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/e") {
      if (request.method === "OPTIONS") return handleIngestOptions(request, env);
      if (request.method === "POST") return handleIngest(request, env, ctx);
      return new Response(null, { status: 405 });
    }

    if (path === "/api/utm-summary") {
      if (request.method !== "GET") return new Response(null, { status: 405 });
      return handleUtmSummary(request, env);
    }

    if (path === "/api/pageviews") {
      if (request.method !== "GET") return new Response(null, { status: 405 });
      return handlePageviews(request, env);
    }

    if (path === "/health") {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "not_found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },

  // Cron de rotação de salt. Habilitar [triggers] no wrangler.toml após upgrade paid.
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    await rotateSaltCron(env);
  },
};
