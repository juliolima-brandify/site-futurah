"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// Client component: <select> de eventos. Atualiza query param `?event=`
// e mantém os outros params (site, since, from/to). Usa router.replace
// pra não empilhar no history quando o usuário troca várias vezes.

type Props = {
    events: string[];
    currentEvent: string;
};

export function EventNameSelectorClient({ events, currentEvent }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const next = new URLSearchParams(searchParams?.toString() ?? "");
            next.set("event", e.target.value);
            router.replace(`?${next.toString()}`, { scroll: false });
        },
        [router, searchParams],
    );

    return (
        <div className="trk-control-group" style={{ marginBottom: 0 }}>
            <span className="trk-control-label">Evento</span>
            <select
                className="trk-select"
                value={currentEvent}
                onChange={handleChange}
                aria-label="Selecionar evento custom"
            >
                {events.length === 0 ? (
                    <option value={currentEvent}>{currentEvent}</option>
                ) : (
                    events.map((ev) => (
                        <option key={ev} value={ev}>
                            {ev}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
}
