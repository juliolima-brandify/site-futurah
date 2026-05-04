import { Suspense } from "react";
import { requireSuperadmin } from "./lib/auth";
import { resolveCtx } from "./lib/ctx";
import type { Ctx } from "./lib/types";
import { SiteSelector } from "./components/SiteSelector";
import { WindowSelector } from "./components/WindowSelector";
import { KPIGrid } from "./components/KPIGrid";
import { TimeseriesChart } from "./components/TimeseriesChart";
import { DataState } from "./components/DataState";

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

                <BreakdownGridPlaceholder />
            </div>
        </main>
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

// Placeholder pra Fase E. Mantém o lugar da grid no layout pra evitar
// reflow grande quando a próxima fase plugar os componentes.
function BreakdownGridPlaceholder(_props: { ctx?: Ctx } = {}) {
    return (
        <section style={{ marginTop: 8 }}>
            <div className="trk-card-header" style={{ marginBottom: 12 }}>
                <h3 className="trk-card-title">Breakdown</h3>
                <span className="trk-card-subtitle">páginas, UTMs, referrers, países, devices</span>
            </div>
            <DataState status="empty" message="Em breve (Fase E)." hint="Tabelas por dimensão chegam no próximo deploy." />
        </section>
    );
}
