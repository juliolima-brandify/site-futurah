import { fetchKpis } from "../lib/tracker-client";
import type { Ctx } from "../lib/types";
import { KPICard } from "./KPICard";

export async function KPIGrid({ ctx }: { ctx: Ctx }) {
    const kpis = await fetchKpis(ctx);

    const pv = kpis.pageviews.current;
    const pvPrev = kpis.pageviews.previous;
    const vi = kpis.visitors.current;
    const viPrev = kpis.visitors.previous;
    const days = Math.max(ctx.approxHours / 24, 1 / 24);
    const pvPerDay = days > 0 ? Math.round(pv / days) : 0;
    const pvPerDayPrev = days > 0 ? Math.round(pvPrev / days) : 0;
    // Estimativa de sessões: ~1 sessão por visitante único na janela. É só
    // proxy — a real precisa de heuristic de last-seen, que ainda não temos.
    const sessions = vi;
    const sessionsPrev = viPrev;

    return (
        <div className="trk-kpi-grid">
            <KPICard label="Pageviews" value={pv} previous={pvPrev} />
            <KPICard
                label="Visitantes únicos"
                value={vi}
                previous={viPrev}
                hint="≈ count(DISTINCT anon_id)"
            />
            <KPICard
                label="Pageviews / dia"
                value={pvPerDay}
                previous={pvPerDayPrev}
                hint={`média na janela (${days.toFixed(1)} dias)`}
            />
            <KPICard
                label="Sessões (estimativa)"
                value={sessions}
                previous={sessionsPrev}
                hint="proxy: 1 visitante = 1 sessão"
            />
        </div>
    );
}
