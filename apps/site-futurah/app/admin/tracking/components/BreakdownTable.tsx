import { domainOf, formatNumber, shortenLabel } from "../lib/format";
import {
    fetchBreakdown,
    fetchPageviews,
    fetchUtmSummary,
} from "../lib/tracker-client";
import type {
    BreakdownDim,
    BreakdownRow,
    Ctx,
    PageviewRow,
    UtmRow,
} from "../lib/types";
import { DataState } from "./DataState";

// Tipo composto: rows que esta tabela aceita renderizar.
// - "default" (BreakdownRow): label/count/visitors
// - "path": vem de /api/pageviews — tem só path/count
// - "utm":  vem de /api/utm-summary — tem utm_source/utm_medium/count
type Variant = "default" | "path" | "utm";

type Props = {
    ctx: Ctx;
    title: string;
    subtitle?: string;
    // Para variant default (do /api/breakdown), passar dim.
    dim?: BreakdownDim;
    // path/utm usam fetchers próprios.
    variant?: Variant;
    limit?: number;
    // Pra dim=referrer mostramos só o domínio.
    transformLabel?: (s: string) => string;
};

export async function BreakdownTable({
    ctx,
    title,
    subtitle,
    dim,
    variant = "default",
    limit = 10,
    transformLabel,
}: Props) {
    let rowsErr = false;
    let total = 0;

    // Estrutura unificada que renderizamos. Cada variant mapeia pra cá.
    type UnifiedRow = {
        labelMain: string;
        labelSub?: string;
        count: number;
        visitors?: number;
    };
    let rows: UnifiedRow[] = [];

    if (variant === "path") {
        const data = await fetchPageviews(ctx);
        rowsErr = !!data.error;
        rows = (data.rows as PageviewRow[]).slice(0, limit).map((r) => ({
            labelMain: r.path || "/",
            count: r.count,
        }));
        total = (data.rows as PageviewRow[]).reduce((acc, r) => acc + r.count, 0);
    } else if (variant === "utm") {
        const data = await fetchUtmSummary(ctx);
        rowsErr = !!data.error;
        rows = (data.rows as UtmRow[]).slice(0, limit).map((r) => ({
            labelMain: r.utm_source || "(direct)",
            labelSub: r.utm_medium || "(none)",
            count: r.count,
        }));
        total = (data.rows as UtmRow[]).reduce((acc, r) => acc + r.count, 0);
    } else {
        if (!dim) {
            return (
                <div className="trk-card">
                    <div className="trk-card-header">
                        <h3 className="trk-card-title">{title}</h3>
                    </div>
                    <DataState status="error" message="Configuração inválida (dim ausente)." />
                </div>
            );
        }
        const data = await fetchBreakdown(ctx, dim, limit);
        rowsErr = !!data.error;
        rows = (data.rows as BreakdownRow[]).map((r) => ({
            labelMain: transformLabel
                ? transformLabel(r.label)
                : r.label || "(empty)",
            count: r.count,
            visitors: r.visitors,
        }));
        total = (data.rows as BreakdownRow[]).reduce((acc, r) => acc + r.count, 0);
    }

    return (
        <div className="trk-card">
            <div className="trk-card-header">
                <h3 className="trk-card-title">{title}</h3>
                {subtitle ? <span className="trk-card-subtitle">{subtitle}</span> : null}
            </div>

            {rowsErr ? (
                <DataState status="error" hint="Confira credenciais TRACKER_API_*." />
            ) : rows.length === 0 ? (
                <DataState status="empty" />
            ) : (
                <table className="trk-table">
                    <thead>
                        <tr>
                            <th>{labelHeader(variant)}</th>
                            <th className="trk-num">Pageviews</th>
                            <th className="trk-num">Visitantes</th>
                            <th>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => {
                            const pct = total > 0 ? (r.count / total) * 100 : 0;
                            return (
                                <tr key={`${r.labelMain}-${i}`}>
                                    <td className="trk-label-cell">
                                        <span title={r.labelMain}>
                                            {shortenLabel(r.labelMain || "(empty)", 40)}
                                        </span>
                                        {r.labelSub ? (
                                            <span className="trk-label-muted"> · {shortenLabel(r.labelSub, 24)}</span>
                                        ) : null}
                                    </td>
                                    <td className="trk-num">{formatNumber(r.count)}</td>
                                    <td className="trk-num">
                                        {r.visitors != null ? formatNumber(r.visitors) : "—"}
                                    </td>
                                    <td className="trk-bar-cell">
                                        <div className="trk-bar">
                                            <div
                                                className="trk-bar-fill"
                                                style={{ width: `${Math.min(pct, 100).toFixed(1)}%` }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function labelHeader(variant: Variant): string {
    if (variant === "path") return "Path";
    if (variant === "utm") return "Source / Medium";
    return "Valor";
}

// Helper exportado pra o page.tsx — usado em dim=referrer.
export function refLabel(s: string): string {
    if (!s) return "(direct)";
    return domainOf(s);
}
