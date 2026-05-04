import { fetchTimeseries } from "../lib/tracker-client";
import { formatBucket, formatNumber } from "../lib/format";
import type { Ctx } from "../lib/types";
import { DataState } from "./DataState";

// SVG inline. Sem JS no client. Tooltip via <title> nativo do SVG no hover
// dos circles.

const W = 720;
const H = 220;
const PAD_X = 36;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;

export async function TimeseriesChart({ ctx }: { ctx: Ctx }) {
    const data = await fetchTimeseries(ctx);
    if (data.error) {
        return (
            <div className="trk-card">
                <div className="trk-card-header">
                    <h3 className="trk-card-title">Pageviews ao longo do tempo</h3>
                </div>
                <DataState status="error" hint="Verifique TRACKER_API_URL/TRACKER_API_TOKEN ou logs do Worker." />
            </div>
        );
    }
    const rows = data.rows;
    if (rows.length === 0) {
        return (
            <div className="trk-card">
                <div className="trk-card-header">
                    <h3 className="trk-card-title">Pageviews ao longo do tempo</h3>
                </div>
                <DataState status="empty" hint={`Nenhum pageview em ${ctx.sinceLabel.toLowerCase()}.`} />
            </div>
        );
    }

    const max = Math.max(1, ...rows.map((r) => r.pageviews));
    const xStep = rows.length > 1 ? (W - PAD_X * 2) / (rows.length - 1) : 0;

    const points = rows.map((r, i) => {
        const x = PAD_X + i * xStep;
        const y = PAD_TOP + (1 - r.pageviews / max) * (H - PAD_TOP - PAD_BOTTOM);
        return { x, y, row: r };
    });

    const pathLine = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    const pathArea =
        points.length > 0
            ? `${pathLine} L ${points[points.length - 1].x.toFixed(1)} ${H - PAD_BOTTOM} L ${points[0].x.toFixed(1)} ${H - PAD_BOTTOM} Z`
            : "";

    // Eixo Y: 4 ticks (0, max/3, 2*max/3, max).
    const yTicks = [0, Math.round(max / 3), Math.round((2 * max) / 3), max];

    // Eixo X: até 6 ticks distribuídos.
    const xTickCount = Math.min(rows.length, 6);
    const xTicks = Array.from({ length: xTickCount }, (_, i) => {
        const idx = Math.round((i * (rows.length - 1)) / Math.max(xTickCount - 1, 1));
        return points[idx];
    });

    return (
        <div className="trk-card">
            <div className="trk-card-header">
                <h3 className="trk-card-title">Pageviews ao longo do tempo</h3>
                <span className="trk-card-subtitle">
                    bucket: {data.bucketUnit === "HOUR" ? "1h" : "1d"} · {rows.length} pontos
                </span>
            </div>
            <div className="trk-chart-wrap">
                <svg
                    className="trk-chart"
                    viewBox={`0 0 ${W} ${H}`}
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label="Gráfico de pageviews ao longo do tempo"
                >
                    {/* gridlines + Y ticks */}
                    {yTicks.map((tick, i) => {
                        const y = PAD_TOP + (1 - tick / max) * (H - PAD_TOP - PAD_BOTTOM);
                        return (
                            <g key={`y-${i}`}>
                                <line
                                    className="trk-chart-grid"
                                    x1={PAD_X}
                                    x2={W - PAD_X}
                                    y1={y}
                                    y2={y}
                                />
                                <text
                                    className="trk-chart-tick"
                                    x={PAD_X - 6}
                                    y={y + 3}
                                    textAnchor="end"
                                >
                                    {formatNumber(tick)}
                                </text>
                            </g>
                        );
                    })}

                    {/* eixo X */}
                    <line
                        className="trk-chart-axis"
                        x1={PAD_X}
                        x2={W - PAD_X}
                        y1={H - PAD_BOTTOM}
                        y2={H - PAD_BOTTOM}
                    />

                    {/* área + linha */}
                    {pathArea ? <path className="trk-chart-area" d={pathArea} /> : null}
                    <path className="trk-chart-line" d={pathLine} />

                    {/* dots com tooltip nativo */}
                    {points.map((p, i) => (
                        <circle
                            key={`pt-${i}`}
                            className="trk-chart-dot"
                            cx={p.x}
                            cy={p.y}
                            r={3}
                        >
                            <title>{`${formatBucket(p.row.bucket, data.bucketUnit)} — ${formatNumber(p.row.pageviews)} pv · ${formatNumber(p.row.visitors)} visitantes`}</title>
                        </circle>
                    ))}

                    {/* X ticks */}
                    {xTicks.map((p, i) =>
                        p ? (
                            <text
                                key={`x-${i}`}
                                className="trk-chart-tick"
                                x={p.x}
                                y={H - PAD_BOTTOM + 14}
                                textAnchor="middle"
                            >
                                {formatBucket(p.row.bucket, data.bucketUnit)}
                            </text>
                        ) : null,
                    )}
                </svg>
            </div>
        </div>
    );
}
