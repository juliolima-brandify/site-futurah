import { fetchEventNames } from "../lib/tracker-client";
import type { Ctx } from "../lib/types";
import { EventNameSelectorClient } from "./EventNameSelectorClient";

// RSC: lista os eventos custom disponíveis no site na janela atual e
// passa pro client component que renderiza o <select>. Filtra `pageview`
// porque a seção "Eventos custom" do dashboard é justamente o que NÃO é
// pageview (esse já tem sua própria seção de breakdowns).

type Props = {
    ctx: Ctx;
    currentEvent: string;
};

export async function EventNameSelector({ ctx, currentEvent }: Props) {
    const data = await fetchEventNames(ctx);
    const events = (data.rows ?? [])
        .map((r) => r.event)
        .filter((e) => e && e !== "pageview");

    // Garante que o evento atual sempre apareça, mesmo que não tenha
    // dados na janela (evita o <select> "pular" pra outro valor).
    if (currentEvent && !events.includes(currentEvent)) {
        events.unshift(currentEvent);
    }

    return <EventNameSelectorClient events={events} currentEvent={currentEvent} />;
}
