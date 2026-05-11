import type { PilaresData } from "../types";

interface Props {
  pilares: PilaresData;
}

function corPorScore(score: number): { dot: string; ring: string; bg: string; text: string } {
  if (score <= 4)
    return { dot: "#E84F3D", ring: "#E84F3D", bg: "#FDECE9", text: "#B23A2E" };
  if (score <= 7)
    return { dot: "#F2C037", ring: "#F2C037", bg: "#FEF6E0", text: "#9A6B0F" };
  return { dot: "#5BB967", ring: "#5BB967", bg: "#E8F5EA", text: "#2F6B3B" };
}

export function PilaresCards({ pilares }: Props) {
  if (pilares.pilares.length === 0) return null;

  return (
    <section className="w-full bg-white px-4 md:px-8 lg:px-12 pb-16 md:pb-20">
      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        {pilares.pilares.map((p) => {
          const cor = corPorScore(p.score);
          return (
            <div
              key={p.chave}
              className="rounded-2xl border px-5 py-4 md:px-6 md:py-5 flex items-start justify-between gap-4"
              style={{ backgroundColor: cor.bg, borderColor: `${cor.ring}33` }}
            >
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cor.dot }}
                  />
                  <span className="text-[15px] md:text-[16px] font-medium text-brand-title">
                    {p.nome}
                  </span>
                </div>
                <p className="text-[13px] md:text-[14px] text-brand-body font-light leading-relaxed pl-5">
                  {p.descricao}
                </p>
              </div>
              <span
                className="inline-flex items-center justify-center min-w-[52px] h-7 rounded-full text-[12px] font-medium border flex-shrink-0 mt-0.5"
                style={{ color: cor.text, borderColor: cor.ring, backgroundColor: "white" }}
              >
                {p.score}/10
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
