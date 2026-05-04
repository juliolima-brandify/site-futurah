import "server-only";
import type {
    BreakdownDim,
    BreakdownResponse,
    Ctx,
    KpisResponse,
    PageviewResponse,
    SiteId,
    TimeseriesResponse,
    UtmResponse,
} from "./types";

// Helpers de fetch contra o Worker. Todos:
// - usam env vars TRACKER_API_URL + TRACKER_API_TOKEN (não disponíveis no
//   cliente — `server-only` bloqueia importação acidental no client).
// - usam `next: { revalidate: 60, tags: ['tracker:<siteId>'] }` pro Next
//   cachear no edge (combina com Cache-Control:60s do Worker).
// - retornam um shape vazio com `error: true` quando algo falha — UI
//   renderiza DataState ao invés de quebrar a árvore.

function buildBase(): { base: string; token: string } | null {
    const base = process.env.TRACKER_API_URL;
    const token = process.env.TRACKER_API_TOKEN;
    if (!base || !token) return null;
    return { base, token };
}

function buildWindowParams(ctx: Ctx): URLSearchParams {
    const sp = new URLSearchParams();
    sp.set("site_id", ctx.siteId);
    if (ctx.customRange && ctx.fromIso && ctx.toIso) {
        sp.set("from", ctx.fromIso);
        sp.set("to", ctx.toIso);
    } else {
        sp.set("since", ctx.sinceParam);
    }
    return sp;
}

async function fetchJson<T>(url: string, token: string, siteId: SiteId): Promise<T | null> {
    try {
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60, tags: [`tracker:${siteId}`] },
        });
        if (!res.ok) {
            console.error("[tracker-client] fetch failed", url, res.status);
            return null;
        }
        return (await res.json()) as T;
    } catch (err) {
        console.error("[tracker-client] fetch error", url, err);
        return null;
    }
}

const EMPTY_KPIS: KpisResponse = {
    pageviews: { current: 0, previous: 0 },
    visitors: { current: 0, previous: 0 },
    window: { approxHours: 0, bucketUnit: "HOUR" },
    error: true,
};

export async function fetchKpis(ctx: Ctx): Promise<KpisResponse> {
    const cfg = buildBase();
    if (!cfg) return EMPTY_KPIS;
    const sp = buildWindowParams(ctx);
    const data = await fetchJson<KpisResponse>(
        `${cfg.base}/api/kpis?${sp.toString()}`,
        cfg.token,
        ctx.siteId,
    );
    if (!data) return EMPTY_KPIS;
    return data;
}

export async function fetchTimeseries(ctx: Ctx): Promise<TimeseriesResponse> {
    const cfg = buildBase();
    if (!cfg) return { rows: [], bucketUnit: "HOUR", error: true };
    const sp = buildWindowParams(ctx);
    const data = await fetchJson<TimeseriesResponse>(
        `${cfg.base}/api/timeseries?${sp.toString()}`,
        cfg.token,
        ctx.siteId,
    );
    if (!data) return { rows: [], bucketUnit: "HOUR", error: true };
    return data;
}

export async function fetchBreakdown(
    ctx: Ctx,
    dim: BreakdownDim,
    limit = 10,
): Promise<BreakdownResponse> {
    const cfg = buildBase();
    if (!cfg) return { rows: [], dim, error: true };
    const sp = buildWindowParams(ctx);
    sp.set("dim", dim);
    sp.set("limit", String(limit));
    const data = await fetchJson<BreakdownResponse>(
        `${cfg.base}/api/breakdown?${sp.toString()}`,
        cfg.token,
        ctx.siteId,
    );
    if (!data) return { rows: [], dim, error: true };
    return data;
}

export async function fetchUtmSummary(ctx: Ctx): Promise<UtmResponse> {
    const cfg = buildBase();
    if (!cfg) return { rows: [], error: true };
    const sp = buildWindowParams(ctx);
    const data = await fetchJson<UtmResponse>(
        `${cfg.base}/api/utm-summary?${sp.toString()}`,
        cfg.token,
        ctx.siteId,
    );
    if (!data) return { rows: [], error: true };
    return data;
}

export async function fetchPageviews(ctx: Ctx): Promise<PageviewResponse> {
    const cfg = buildBase();
    if (!cfg) return { rows: [], error: true };
    const sp = buildWindowParams(ctx);
    const data = await fetchJson<PageviewResponse>(
        `${cfg.base}/api/pageviews?${sp.toString()}`,
        cfg.token,
        ctx.siteId,
    );
    if (!data) return { rows: [], error: true };
    return data;
}
