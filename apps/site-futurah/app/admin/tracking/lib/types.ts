// Shapes consumidos pelo dashboard. Espelham exatamente o que o Worker
// retorna em /api/kpis, /api/timeseries, /api/breakdown e /api/utm-summary.

export type SiteId = "futurah" | "fidevidraceiro";

export type WindowPreset = "24h" | "7d" | "30d" | "90d";

export type Ctx = {
    siteId: SiteId;
    sinceLabel: string; // texto humano: "24h", "7 dias", etc.
    sinceParam: string; // valor pra query string ?since=
    fromIso?: string;
    toIso?: string;
    customRange: boolean;
    approxHours: number;
};

export type KpisResponse = {
    pageviews: { current: number; previous: number };
    visitors: { current: number; previous: number };
    window: { approxHours: number; bucketUnit: "HOUR" | "DAY" };
    error?: true;
};

export type TimeseriesRow = {
    bucket: string; // "YYYY-MM-DD HH:MM:SS" UTC
    pageviews: number;
    visitors: number;
};

export type TimeseriesResponse = {
    rows: TimeseriesRow[];
    bucketUnit: "HOUR" | "DAY";
    error?: true;
};

export type BreakdownRow = {
    label: string;
    count: number;
    visitors: number;
};

export type BreakdownDim = "campaign" | "referrer" | "country" | "device" | "browser";

export type BreakdownResponse = {
    rows: BreakdownRow[];
    dim: BreakdownDim;
    error?: true;
};

export type UtmRow = {
    utm_source: string;
    utm_medium: string;
    count: number;
};

export type UtmResponse = {
    rows: UtmRow[];
    error?: true;
};

export type PageviewRow = {
    path: string;
    count: number;
};

export type PageviewResponse = {
    rows: PageviewRow[];
    error?: true;
};
