import type { FrentesData } from "../types";

interface Props {
  data: FrentesData;
}

export function FrentesSection({ data }: Props) {
  return (
    <section
      id="proposta"
      className="w-full bg-white px-4 md:px-8 lg:px-12 py-16 lg:py-24"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {data.cards.map((card) => {
            const isDark = card.destaque;
            const base = isDark
              ? "bg-brand-title text-white rounded-[28px] p-8 flex flex-col gap-5 hover:shadow-2xl transition-all duration-300"
              : "bg-brand-background rounded-[28px] p-8 flex flex-col gap-5 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-title/5";

            const pillClasses =
              card.pillTone === "lime"
                ? "bg-brand-highlight text-brand-title"
                : "bg-brand-title text-white";

            const numberColor = isDark
              ? "text-white/30"
              : "text-brand-title/30";

            const headingColor = isDark ? "text-white" : "text-brand-title";

            const bodyColor = isDark
              ? "text-white/85"
              : "text-brand-body";

            const borderColor = isDark
              ? "border-white/15"
              : "border-brand-title/10";

            return (
              <div key={card.titulo} className={base}>
                <div className="flex items-start justify-between">
                  <span className={`text-5xl font-medium ${numberColor}`}>
                    {card.numero}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${pillClasses}`}
                  >
                    {card.pillLabel}
                  </span>
                </div>
                <h3
                  className={`text-2xl font-medium leading-tight ${headingColor}`}
                >
                  {card.titulo}
                </h3>
                <p
                  className={`text-sm font-light leading-relaxed ${bodyColor}`}
                >
                  {card.body}
                </p>
                <ul
                  className={`text-sm font-light space-y-2 pt-2 border-t ${borderColor} ${bodyColor}`}
                >
                  {card.bullets.map((b) => (
                    <li key={b}>→ {b}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {data.observacao && (
          <div className="rounded-[24px] bg-brand-highlight/30 border border-brand-highlight px-6 py-5 text-sm text-brand-title font-light leading-relaxed">
            {data.observacao}
          </div>
        )}
      </div>
    </section>
  );
}
