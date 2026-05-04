import { formatNumber, shortenLabel } from "../lib/format";
import { fetchEvents } from "../lib/tracker-client";
import type { Ctx, EventBreakdownDim } from "../lib/types";
import { DataState } from "./DataState";

// Tabela de breakdown para eventos custom (link_click etc.).
// Reusa visual e classes do BreakdownTable existente, mas a fonte de dados
// é /api/events?event=&dim= — uma dim por widget. Não junta variantes
// como o BreakdownTable original (que tinha path/utm/default), porque o
// shape é único.

type Props = {
    ctx: Ctx;
    eventName: string;
    dim: EventBreakdownDim;
    title: string;
    subtitle?: string;
    limit?: number;
};

export async function EventBreakdownTable({
    ctx,
    eventName,
    dim,
    title,
    subtitle,
    limit = 10,
}: Props) {
    const data = await fetchEvents(ctx, eventName, dim, limit);
    const rowsErr = !!data.error;
    const rows = data.rows ?? [];
    const total = rows.reduce((acc, r) => acc + r.count, 0);

    return (
        <div className="trk-card">
            <div className="trk-card-header">
                <h3 className="trk-card-title">{title}</h3>
                {subtitle ? <span className="trk-card-subtitle">{subtitle}</span> : null}
            </div>

            {rowsErr ? (
                <DataState status="error" hint="Confira credenciais TRACKER_API_*." />
            ) : rows.length === 0 ? (
                <DataState
                    status="empty"
                    message={`Sem cliques de "${eventName}" nesta janela.`}
                />
            ) : (
                <table className="trk-table">
                    <thead>
                        <tr>
                            <th>{labelHeader(dim)}</th>
                            <th className="trk-num">Cliques</th>
                            <th className="trk-num">Visitantes</th>
                            <th>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => {
                            const pct = total > 0 ? (r.count / total) * 100 : 0;
                            const labelDisplay = r.label || "(empty)";
                            return (
                                <tr key={`${labelDisplay}-${i}`}>
                                    <td className="trk-label-cell">
                                        <span title={labelDisplay}>
                                            {shortenLabel(labelDisplay, 40)}
                                        </span>
                                    </td>
                                    <td className="trk-num">{formatNumber(r.count)}</td>
                                    <td className="trk-num">{formatNumber(r.visitors)}</td>
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

function labelHeader(dim: EventBreakdownDim): string {
    if (dim === "url") return "URL de destino";
    if (dim === "label") return "Label";
    if (dim === "target") return "Target";
    return "Path";
}
