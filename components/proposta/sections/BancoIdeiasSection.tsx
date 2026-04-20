import type { BancoIdeiasData } from "../types";

interface Props {
  data: BancoIdeiasData;
}

export function BancoIdeiasSection({ data }: Props) {
  return (
    <section className="w-full bg-white px-4 md:px-8 lg:px-12 py-16 lg:py-24 border-t border-brand-title/5">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.categorias.map((cat) => {
            if (cat.fullWidth) {
              return (
                <div
                  key={cat.titulo}
                  className="md:col-span-2 bg-brand-title text-white rounded-[28px] p-8 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-brand-highlight text-brand-title flex items-center justify-center text-sm font-medium">
                      {cat.numero}
                    </span>
                    <h3 className="text-xl font-medium text-white">
                      {cat.titulo}
                    </h3>
                  </div>
                  <ul className="text-sm text-white/85 font-light space-y-2.5 leading-relaxed md:columns-2 md:gap-8">
                    {cat.itens.map((item) => (
                      <li key={item}>→ {item}</li>
                    ))}
                  </ul>
                </div>
              );
            }

            return (
              <div
                key={cat.titulo}
                className="bg-brand-background rounded-[28px] p-8 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-title text-brand-highlight flex items-center justify-center text-sm font-medium">
                    {cat.numero}
                  </span>
                  <h3 className="text-xl font-medium text-brand-title">
                    {cat.titulo}
                  </h3>
                </div>
                <ul className="text-sm text-brand-body font-light space-y-2.5 leading-relaxed">
                  {cat.itens.map((item) => (
                    <li key={item}>→ {item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {data.fechamento && (
          <div className="rounded-[24px] bg-brand-background px-6 py-5 text-sm text-brand-body font-light leading-relaxed max-w-3xl">
            {data.fechamento}
          </div>
        )}
      </div>
    </section>
  );
}
