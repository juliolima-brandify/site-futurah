import type { PilaresData } from "../types";

interface Props {
  pilares: PilaresData;
}

export function MaturidadeSlider({ pilares }: Props) {
  const maturidade = pilares.pilares.find((p) => p.chave === "maturidade");
  if (!maturidade) return null;

  const pct = Math.max(0, Math.min(100, (maturidade.score / 10) * 100));

  return (
    <section className="w-full bg-white px-4 md:px-8 lg:px-12 py-12">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
        <div className="space-y-2">
          <h3 className="text-[22px] md:text-[28px] font-medium text-brand-title">
            Nível de Maturidade
          </h3>
          <p className="text-sm md:text-base text-brand-body font-light">
            Como está o nível de maturidade da sua operação.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <div className="relative h-2 rounded-full bg-gradient-to-r from-[#E84F3D] via-[#F2C037] to-[#5BB967]">
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-brand-title shadow-sm"
              style={{ left: `${pct}%` }}
              aria-label={`Score: ${maturidade.score} de 10`}
            />
          </div>
          <div className="mt-3 flex justify-between text-[12px] md:text-[13px] text-brand-body/70 font-medium">
            <span>Iniciante</span>
            <span>Intermediário</span>
            <span>Avançado</span>
          </div>
        </div>

        <p className="text-sm md:text-[15px] text-brand-body font-light max-w-xl leading-relaxed">
          O <span className="font-medium text-brand-title">Nível de Maturidade</span>{" "}
          indica o quanto sua operação está estruturada em relação às práticas de mercado.{" "}
          <span className="text-brand-title">{maturidade.descricao}</span>
        </p>
      </div>
    </section>
  );
}
