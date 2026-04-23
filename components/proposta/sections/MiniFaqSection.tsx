import type { MiniFaqData } from "../types";

interface Props {
  data: MiniFaqData;
}

export function MiniFaqSection({ data }: Props) {
  return (
    <section id="faq" className="w-full bg-white px-4 md:px-8 lg:px-12 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
            {data.eyebrow}
          </span>
          <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
            {data.titulo}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {data.itens.map((item) => (
            <details
              key={item.pergunta}
              className="group rounded-2xl border border-brand-title/10 bg-brand-background/45 px-6 py-4"
            >
              <summary className="list-none cursor-pointer flex items-center justify-between gap-4">
                <span className="text-base md:text-lg font-medium text-brand-title">
                  {item.pergunta}
                </span>
                <span className="text-brand-body/70 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pt-3 text-sm md:text-base text-brand-body font-light leading-relaxed">
                {item.resposta}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
