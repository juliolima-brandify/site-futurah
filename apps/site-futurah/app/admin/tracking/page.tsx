import { Suspense } from "react";
import { requireSuperadmin } from "./lib/auth";
import { resolveCtx } from "./lib/ctx";
import { SiteSelector } from "./components/SiteSelector";
import { WindowSelector } from "./components/WindowSelector";
import { KPIGrid } from "./components/KPIGrid";
import { TimeseriesChart } from "./components/TimeseriesChart";
import { BreakdownTable, refLabel } from "./components/BreakdownTable";
import { DataState } from "./components/DataState";
import { EventBreakdownTable } from "./components/EventBreakdownTable";
import { EventNameSelector } from "./components/EventNameSelector";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function TrackingDashboardPage({
    searchParams,
}: {
    searchParams?: SearchParams;
}) {
    await requireSuperadmin();
    const sp = (await searchParams) ?? {};
    const ctx = resolveCtx(sp);
    // `event` controla a seção "Eventos custom" abaixo. Default link_click,
    // que é o evento disparado pelo LinkButton da bio do fidevidraceiro.
    const eventName =
        typeof sp.event === "string" && sp.event.length > 0 ? sp.event : "link_click";

    return (
        <main className="trk-root">
            <div className="trk-container">
                <header className="trk-header">
                    <div>
                        <h1 className="trk-title">Tracking — {ctx.siteId}</h1>
                        <p className="trk-subtitle">{ctx.sinceLabel}</p>
                    </div>
                    <div className="trk-controls" style={{ marginBottom: 0 }}>
                        <SiteSelector ctx={ctx} />
                        <WindowSelector ctx={ctx} />
                    </div>
                </header>

                <Suspense fallback={<KpiGridFallback />}>
                    <KPIGrid ctx={ctx} />
                </Suspense>

                <Suspense fallback={<ChartFallback />}>
                    <TimeseriesChart ctx={ctx} />
                </Suspense>

                <section style={{ marginTop: 8 }}>
                    <div className="trk-card-header" style={{ marginBottom: 12 }}>
                        <h3 className="trk-card-title">Breakdown</h3>
                        <span className="trk-card-subtitle">páginas, UTMs, referrers, países, devices, browsers</span>
                    </div>
                    <div className="trk-grid">
                        <Suspense fallback={<TableFallback title="Páginas mais vistas" />}>
                            <BreakdownTable
                                ctx={ctx}
                                variant="path"
                                title="Páginas mais vistas"
                                subtitle="top 10 por pageviews"
                            />
                        </Suspense>
                        <Suspense fallback={<TableFallback title="UTMs (source / medium)" />}>
                            <BreakdownTable
                                ctx={ctx}
                                variant="utm"
                                title="UTMs"
                                subtitle="source × medium · top 10"
                            />
                        </Suspense>
                        <Suspense fallback={<TableFallback title="Campanhas" />}>
                            <BreakdownTable
                                ctx={ctx}
                                dim="campaign"
                                title="Campanhas"
                                subtitle="utm_campaign · top 10"
                            />
                        </Suspense>
                        <Suspense fallback={<TableFallback title="Referrers" />}>
                            <BreakdownTable
                                ctx={ctx}
                                dim="referrer"
                                title="Referrers"
                                subtitle="domínio de origem · top 10"
                                transformLabel={refLabel}
                            />
                        </Suspense>
                        <Suspense fallback={<TableFallback title="Países" />}>
                            <BreakdownTable
                                ctx={ctx}
                                dim="country"
                                title="Países"
                                subtitle="ISO-2 · top 10"
                            />
                        </Suspense>
                        <Suspense fallback={<TableFallback title="Devices" />}>
                            <BreakdownTable
                                ctx={ctx}
                                dim="device"
                                title="Devices"
                                subtitle="mobile / desktop / tablet · top 10"
                            />
                        </Suspense>
                        <Suspense fallback={<TableFallback title="Browsers" />}>
                            <BreakdownTable
                                ctx={ctx}
                                dim="browser"
                                title="Browsers"
                                subtitle="user-agent simplificado · top 10"
                            />
                        </Suspense>
                    </div>
                </section>

                <section style={{ marginTop: 8 }}>
                    <div
                        className="trk-card-header"
                        style={{
                            marginBottom: 12,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            flexWrap: "wrap",
                            gap: 12,
                        }}
                    >
                        <div>
                            <h3 className="trk-card-title">Eventos custom</h3>
                            <span className="trk-card-subtitle">
                                cliques e outros eventos disparados via track() — top destinos por url
                            </span>
                        </div>
                        <Suspense fallback={null}>
                            <EventNameSelector ctx={ctx} currentEvent={eventName} />
                        </Suspense>
                    </div>
                    <div className="trk-grid">
                        <Suspense fallback={<TableFallback title="Top destinos clicados" />}>
                            <EventBreakdownTable
                                ctx={ctx}
                                eventName={eventName}
                                dim="url"
                                title="Top destinos clicados"
                                subtitle={`${eventName} · agrupado por url`}
                            />
                        </Suspense>
                    </div>
                </section>
            </div>
        </main>
    );
}

function TableFallback({ title }: { title: string }) {
    return (
        <div className="trk-card">
            <div className="trk-card-header">
                <h3 className="trk-card-title">{title}</h3>
            </div>
            <DataState status="loading" />
        </div>
    );
}

function KpiGridFallback() {
    return (
        <div className="trk-kpi-grid">
            {[0, 1, 2, 3].map((i) => (
                <div className="trk-kpi" key={i}>
                    <span className="trk-row-skeleton" style={{ width: "50%" }} />
                    <span className="trk-row-skeleton" style={{ width: "70%", height: 28 }} />
                </div>
            ))}
        </div>
    );
}

function ChartFallback() {
    return (
        <div className="trk-card">
            <div className="trk-card-header">
                <h3 className="trk-card-title">Pageviews ao longo do tempo</h3>
            </div>
            <DataState status="loading" />
        </div>
    );
}

