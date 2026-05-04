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

// Eventos custom — espelha /api/events e /api/event-names do Worker.
export type EventBreakdownDim = "url" | "label" | "target" | "path";

export type EventBreakdownRow = {
    label: string;
    count: number;
    visitors: number;
    avg_value: number;
};

export type EventBreakdownResponse = {
    rows: EventBreakdownRow[];
    dim: EventBreakdownDim;
    event: string;
    error?: true;
};

export type EventNameRow = {
    event: string;
    count: number;
};

export type EventNamesResponse = {
    rows: EventNameRow[];
    error?: true;
};
