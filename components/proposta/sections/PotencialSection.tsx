import type { PotencialData } from "../types";

interface Props {
  data: PotencialData;
}

export function PotencialSection({ data }: Props) {
  return (
    <section className="w-full bg-brand-title text-white px-4 md:px-8 lg:px-12 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-4 max-w-3xl">
          <span className="text-sm font-medium uppercase tracking-wider text-brand-highlight">
            {data.eyebrow}
          </span>
          <h2 className="text-4xl lg:text-[56px] font-medium leading-[1.05] text-white">
            {data.titulo}
          </h2>
          <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
            {data.subtitulo}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.cards.map((card) => {
            if (card.destaque) {
              return (
                <div
                  key={card.titulo}
                  className="rounded-[28px] border-2 border-brand-highlight bg-brand-highlight p-8 flex flex-col gap-4"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-brand-title">
                    {card.eyebrow}
                  </span>
                  <h3 className="text-2xl font-medium leading-tight text-brand-title">
                    {card.titulo}
                  </h3>
                  <p className="text-sm text-brand-title/80 font-light leading-relaxed">
                    {card.body}
                  </p>
                  <div className="pt-4 border-t border-brand-title/20">
                    <span className="text-xs text-brand-title/70 uppercase tracking-wider">
                      {card.potencialLabel}
                    </span>
                    <p className="text-3xl font-medium mt-1 text-brand-title">
                      {card.potencialValor}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={card.titulo}
                className="rounded-[28px] border border-white/20 bg-white/[0.08] p-8 flex flex-col gap-4"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-brand-highlight">
                  {card.eyebrow}
                </span>
                <h3 className="text-2xl font-medium leading-tight text-white">
                  {card.titulo}
                </h3>
                <p className="text-sm text-white/80 font-light leading-relaxed">
                  {card.body}
                </p>
                <div className="pt-4 border-t border-white/15">
                  <span className="text-xs text-white/60 uppercase tracking-wider">
                    {card.potencialLabel}
                  </span>
                  <p className="text-3xl font-medium mt-1 text-white">
                    {card.potencialValor}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {data.observacao && (
          <div className="rounded-[28px] border border-white/15 bg-white/[0.06] p-8 md:p-10 flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-brand-highlight">
              Sobre os números acima
            </span>
            <p className="text-sm md:text-base text-white/80 font-light leading-relaxed max-w-3xl">
              {data.observacao}
            </p>
          </div>
        )}

        {data.formatosParceria && (
          <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
            <span className="text-xs font-medium uppercase tracking-wider text-brand-highlight">
              Formatos possíveis de parceria
            </span>
            <p
              className="text-base text-white/80 font-light leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: data.formatosParceria }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
