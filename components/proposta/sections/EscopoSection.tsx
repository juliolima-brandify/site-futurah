import type { EscopoData } from "../types";

interface Props {
  data: EscopoData;
}

export function EscopoSection({ data }: Props) {
  return (
    <section className="w-full bg-white px-4 md:px-8 lg:px-12 py-16 lg:py-24">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.itens.map((item) => (
            <div
              key={item}
              className="flex items-start gap-4 p-5 rounded-[20px] bg-brand-background hover:bg-brand-highlight/20 transition-all duration-300"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-title text-white flex items-center justify-center text-xs font-medium">
                ✓
              </span>
              <p className="text-base text-brand-body font-light leading-relaxed pt-1">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
