import type { Ctx } from "../lib/types";
import { ctxQueryString, WINDOW_PRESETS } from "../lib/ctx";

export function WindowSelector({ ctx }: { ctx: Ctx }) {
    return (
        <div className="trk-control-group" style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
            <div className="trk-control-group" style={{ marginBottom: 0 }}>
                <span className="trk-control-label">Janela</span>
                {WINDOW_PRESETS.map((preset) => (
                    <a
                        key={preset.key}
                        className="trk-control-link"
                        href={ctxQueryString(ctx, { since: preset.key })}
                        data-active={!ctx.customRange && ctx.sinceParam === preset.key}
                    >
                        {preset.label}
                    </a>
                ))}
                {ctx.customRange ? (
                    <a
                        className="trk-control-link"
                        href={ctxQueryString(ctx, { since: "24h", clearRange: true })}
                        data-active={true}
                        title="Limpar range custom — voltar pra preset"
                    >
                        custom ✕
                    </a>
                ) : null}
            </div>
            <details className="trk-range-form" {...(ctx.customRange ? { open: true } : {})}>
                <summary>Range custom (from / to, UTC)</summary>
                <form method="GET" action="" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <input type="hidden" name="site" value={ctx.siteId} />
                    <input
                        type="datetime-local"
                        name="from"
                        defaultValue={ctx.fromIso?.slice(0, 16) ?? ""}
                        required
                    />
                    <span style={{ color: "var(--trk-text-dim)" }}>→</span>
                    <input
                        type="datetime-local"
                        name="to"
                        defaultValue={ctx.toIso?.slice(0, 16) ?? ""}
                        required
                    />
                    <button type="submit">Aplicar</button>
                </form>
            </details>
        </div>
    );
}
