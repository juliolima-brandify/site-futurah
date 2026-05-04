import type { Ctx } from "../lib/types";
import { ctxQueryString, SITE_OPTIONS } from "../lib/ctx";

export function SiteSelector({ ctx }: { ctx: Ctx }) {
    return (
        <div className="trk-control-group">
            <span className="trk-control-label">Site</span>
            {SITE_OPTIONS.map((opt) => (
                <a
                    key={opt.key}
                    className="trk-control-link"
                    href={ctxQueryString(ctx, { site: opt.key })}
                    data-active={ctx.siteId === opt.key}
                >
                    {opt.label}
                </a>
            ))}
        </div>
    );
}
