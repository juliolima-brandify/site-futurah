import type { FasesData } from "../types";

interface Props {
  data: FasesData;
}

export function FasesSection({ data }: Props) {
  return (
    <section className="w-full bg-brand-background px-4 md:px-8 lg:px-12 py-16 lg:py-24">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.fases.map((f) => (
            <div
              key={f.phase}
              className="bg-white rounded-[24px] p-7 flex flex-col gap-4 border border-brand-title/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-brand-button-hover">
                  {f.phase}
                </span>
                <span className="text-xs text-brand-body/60">{f.weeks}</span>
              </div>
              <h3 className="text-xl font-medium text-brand-title leading-tight">
                {f.title}
              </h3>
              <ul className="space-y-2 pt-2 border-t border-brand-title/10">
                {f.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-sm text-brand-body font-light leading-relaxed"
                  >
                    → {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
