import { computeDelta, formatNumber } from "../lib/format";

type Props = {
    label: string;
    value: number;
    previous?: number;
    hint?: string;
    showDelta?: boolean;
};

export function KPICard({ label, value, previous, hint, showDelta = true }: Props) {
    const delta =
        showDelta && typeof previous === "number"
            ? computeDelta(value, previous)
            : null;
    return (
        <div className="trk-kpi">
            <span className="trk-kpi-label">{label}</span>
            <span className="trk-kpi-value">{formatNumber(value)}</span>
            <div className="trk-kpi-meta">
                {delta ? (
                    <>
                        <span className="trk-delta" data-direction={delta.direction}>
                            {delta.text}
                        </span>
                        <span style={{ color: "var(--trk-text-dim)" }}>vs janela anterior</span>
                    </>
                ) : null}
            </div>
            {hint ? <span className="trk-kpi-hint">{hint}</span> : null}
        </div>
    );
}
