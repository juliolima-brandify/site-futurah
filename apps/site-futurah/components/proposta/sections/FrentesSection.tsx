import type { FrentesData } from "../types";

interface Props {
  data: FrentesData;
}

export function FrentesSection({ data }: Props) {
  const isStack = data.layout === "stack";

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

        <div
          className={
            isStack
              ? "flex flex-col gap-5"
              : "grid grid-cols-1 lg:grid-cols-3 gap-6"
          }
        >
          {data.cards.map((card) => {
            const isDark = card.destaque;
            const base = isDark
              ? "bg-brand-title text-white rounded-[28px] p-8 flex flex-col gap-5 hover:shadow-2xl transition-all duration-300"
              : "bg-brand-background rounded-[28px] p-8 flex flex-col gap-5 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-title/5";
            const stackBase = isDark
              ? "bg-brand-title text-white rounded-[28px] p-8 lg:p-10 border border-brand-title/40 hover:shadow-2xl transition-all duration-300"
              : "bg-white rounded-[28px] p-8 lg:p-10 border border-brand-title/10 shadow-sm hover:shadow-xl transition-all duration-300";

            const pillClasses =
              card.pillTone === "lime"
                ? "bg-brand-highlight text-brand-title"
                : "bg-brand-title text-white";

            const darkPillClasses = isDark
              ? "bg-white text-brand-title"
              : pillClasses;

            const numberColor = isDark ? "text-white" : "text-brand-title";
            const headingColor = isDark ? "text-white" : "text-brand-title";
            const bodyColor = isDark ? "text-white/85" : "text-brand-body";
            const labelColor = isDark
              ? "text-white/50"
              : "text-brand-title/50";
            const dividerColor = isDark
              ? "lg:border-white/15"
              : "lg:border-brand-title/10";

            if (!isStack) {
              return (
                <div key={card.titulo} className={base}>
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-5xl font-medium ${
                        isDark ? "text-white/30" : "text-brand-title/30"
                      }`}
                    >
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
                    className={`text-sm font-light space-y-2 pt-2 border-t ${
                      isDark ? "border-white/15" : "border-brand-title/10"
                    } ${bodyColor}`}
                  >
                    {card.bullets.map((b) => (
                      <li key={b}>→ {b}</li>
                    ))}
                  </ul>
                </div>
              );
            }

            return (
              <div key={card.titulo} className={stackBase}>
                <div
                  className={`grid grid-cols-1 lg:grid-cols-[minmax(280px,35%)_1fr] gap-8 lg:gap-10`}
                >
                  <div
                    className={`flex flex-col gap-4 lg:border-r ${dividerColor} lg:pr-10`}
                  >
                    <span
                      className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${darkPillClasses}`}
                    >
                      {card.pillLabel}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-xs font-medium uppercase tracking-wider ${labelColor}`}
                      >
                        Investimento
                      </span>
                      <span
                        className={`text-4xl lg:text-5xl font-semibold tracking-tight leading-none ${numberColor}`}
                      >
                        {card.numero}
                      </span>
                    </div>
                    <h3
                      className={`text-xl lg:text-2xl font-medium leading-tight ${headingColor}`}
                    >
                      {card.titulo}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-5">
                    <p
                      className={`text-sm lg:text-base font-light leading-relaxed ${bodyColor}`}
                    >
                      {card.body}
                    </p>
                    <ul
                      className={`text-sm font-light space-y-3 ${bodyColor}`}
                    >
                      {card.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5">
                          <span
                            className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                              isDark
                                ? "bg-brand-highlight text-brand-title"
                                : "bg-brand-title text-brand-highlight"
                            }`}
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.5 5L4 7.5L8.5 3"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
