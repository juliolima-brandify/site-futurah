import type { DiagnosticoData } from "../types";

interface Props {
  data: DiagnosticoData;
}

export function DiagnosticoSection({ data }: Props) {
  return (
    <section className="w-full bg-brand-background px-4 md:px-8 lg:px-12 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-4 max-w-3xl">
          <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
            {data.eyebrow}
          </span>
          <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
            {data.titulo}
          </h2>
          <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
            {data.subtitulo}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.cards.map((card) => (
            <div
              key={card.titulo}
              className="bg-white rounded-[24px] p-7 border border-brand-title/5 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-medium text-brand-title mb-3 leading-tight">
                {card.titulo}
              </h3>
              <p className="text-sm text-brand-body font-light leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
