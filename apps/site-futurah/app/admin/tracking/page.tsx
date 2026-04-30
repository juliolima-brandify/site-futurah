import { Suspense } from "react";
import { headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

async function requireSuperadmin(): Promise<void> {
    const payload = await getPayload({ config });
    const headers = await nextHeaders();
    const { user } = await payload.auth({ headers });
    if (!user || user.role !== "superadmin") {
        notFound();
    }
}

type UtmRow = { utm_source: string; utm_medium: string; count: number };

async function fetchUtmSummary(siteId: string): Promise<UtmRow[]> {
    const base = process.env.TRACKER_API_URL;
    const token = process.env.TRACKER_API_TOKEN;
    if (!base || !token) return [];
    try {
        const res = await fetch(
            `${base}/api/utm-summary?site_id=${encodeURIComponent(siteId)}&since=24h`,
            {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            },
        );
        if (!res.ok) return [];
        const data = (await res.json()) as { rows?: UtmRow[] };
        return data.rows || [];
    } catch {
        return [];
    }
}

async function UtmTable({ siteId }: { siteId: string }) {
    const rows = await fetchUtmSummary(siteId);
    return (
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
            <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
                    <th style={{ padding: "8px 12px" }}>utm_source</th>
                    <th style={{ padding: "8px 12px" }}>utm_medium</th>
                    <th style={{ padding: "8px 12px", textAlign: "right" }}>count</th>
                </tr>
            </thead>
            <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td
                            colSpan={3}
                            style={{ padding: "16px 12px", color: "#666", fontStyle: "italic" }}
                        >
                            Sem eventos nas últimas 24h. Verifique se TRACKER_API_URL e
                            TRACKER_API_TOKEN estão configurados, e se o Worker já recebeu
                            tráfego.
                        </td>
                    </tr>
                ) : (
                    rows.map((r, i) => (
                        <tr key={`${r.utm_source}-${r.utm_medium}-${i}`} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "8px 12px" }}>{r.utm_source || "(direct)"}</td>
                            <td style={{ padding: "8px 12px" }}>{r.utm_medium || "(none)"}</td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                                {r.count}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}

export default async function TrackingDashboardPage({
    searchParams,
}: {
    searchParams?: Promise<{ site?: string }>;
}) {
    await requireSuperadmin();
    return (
        <main style={{ maxWidth: 960, margin: "40px auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
            <h1 style={{ fontSize: 24, marginBottom: 8 }}>Tracking — UTM summary (24h)</h1>
            <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
                MVP. Auth Payload (superadmin); sem filtros; sem gráficos. Lê do Worker
                <code style={{ marginLeft: 4, padding: "2px 4px", background: "#eee", borderRadius: 3 }}>
                    GET /api/utm-summary
                </code>
                .
            </p>

            <SiteSelector searchParams={searchParams} />

            <Suspense fallback={<p>Carregando...</p>}>
                <SiteTables searchParams={searchParams} />
            </Suspense>
        </main>
    );
}

async function SiteSelector({
    searchParams,
}: {
    searchParams?: Promise<{ site?: string }>;
}) {
    const sp = (await searchParams) ?? {};
    const current = sp.site ?? "futurah";
    return (
        <p style={{ marginBottom: 16, fontSize: 14 }}>
            Site:{" "}
            <a href="?site=futurah" style={{ fontWeight: current === "futurah" ? 700 : 400 }}>
                futurah
            </a>{" "}
            |{" "}
            <a href="?site=fidevidraceiro" style={{ fontWeight: current === "fidevidraceiro" ? 700 : 400 }}>
                fidevidraceiro
            </a>
        </p>
    );
}

async function SiteTables({
    searchParams,
}: {
    searchParams?: Promise<{ site?: string }>;
}) {
    const sp = (await searchParams) ?? {};
    const siteId = sp.site === "fidevidraceiro" ? "fidevidraceiro" : "futurah";
    return <UtmTable siteId={siteId} />;
}
