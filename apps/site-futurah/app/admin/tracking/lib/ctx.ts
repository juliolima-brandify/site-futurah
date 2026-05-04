import type { Ctx, SiteId, WindowPreset } from "./types";

const SINCE_LABELS: Record<WindowPreset, { label: string; hours: number }> = {
    "24h": { label: "Últimas 24h", hours: 24 },
    "7d": { label: "Últimos 7 dias", hours: 7 * 24 },
    "30d": { label: "Últimos 30 dias", hours: 30 * 24 },
    "90d": { label: "Últimos 90 dias", hours: 90 * 24 },
};

const VALID_SITES: SiteId[] = ["futurah", "fidevidraceiro"];

export function resolveCtx(searchParams: Record<string, string | string[] | undefined>): Ctx {
    const siteRaw = typeof searchParams.site === "string" ? searchParams.site : undefined;
    const siteId: SiteId = VALID_SITES.includes(siteRaw as SiteId)
        ? (siteRaw as SiteId)
        : "futurah";

    const fromIso = typeof searchParams.from === "string" ? searchParams.from : undefined;
    const toIso = typeof searchParams.to === "string" ? searchParams.to : undefined;
    const customRange = !!(fromIso && toIso);

    if (customRange) {
        const fromMs = Date.parse(fromIso!);
        const toMs = Date.parse(toIso!);
        const approxHours =
            !isNaN(fromMs) && !isNaN(toMs) && toMs > fromMs
                ? (toMs - fromMs) / 3_600_000
                : 24;
        return {
            siteId,
            sinceLabel: `${fromIso!.slice(0, 16)} → ${toIso!.slice(0, 16)}`,
            sinceParam: "24h", // não usado quando customRange
            fromIso,
            toIso,
            customRange: true,
            approxHours,
        };
    }

    const sinceRaw = typeof searchParams.since === "string" ? searchParams.since : "24h";
    const preset: WindowPreset =
        sinceRaw === "7d" || sinceRaw === "30d" || sinceRaw === "90d" ? sinceRaw : "24h";
    return {
        siteId,
        sinceLabel: SINCE_LABELS[preset].label,
        sinceParam: preset,
        customRange: false,
        approxHours: SINCE_LABELS[preset].hours,
    };
}

export function ctxQueryString(
    ctx: Ctx,
    overrides: Partial<{ site: SiteId; since: WindowPreset; from: string; to: string; clearRange: boolean }> = {},
): string {
    const sp = new URLSearchParams();
    const site = overrides.site ?? ctx.siteId;
    sp.set("site", site);

    if (overrides.from && overrides.to) {
        sp.set("from", overrides.from);
        sp.set("to", overrides.to);
        return `?${sp.toString()}`;
    }

    if (overrides.clearRange || overrides.since) {
        const since = overrides.since ?? "24h";
        sp.set("since", since);
        return `?${sp.toString()}`;
    }

    if (ctx.customRange && ctx.fromIso && ctx.toIso) {
        sp.set("from", ctx.fromIso);
        sp.set("to", ctx.toIso);
    } else {
        sp.set("since", ctx.sinceParam);
    }
    return `?${sp.toString()}`;
}

export const WINDOW_PRESETS: Array<{ key: WindowPreset; label: string }> = [
    { key: "24h", label: "24h" },
    { key: "7d", label: "7d" },
    { key: "30d", label: "30d" },
    { key: "90d", label: "90d" },
];

export const SITE_OPTIONS: Array<{ key: SiteId; label: string }> = [
    { key: "futurah", label: "futurah" },
    { key: "fidevidraceiro", label: "fidevidraceiro" },
];
